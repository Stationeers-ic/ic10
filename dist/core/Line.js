import { hash, line } from "../regexps";
import { functions } from "../functions";
import { z, ZodError } from "zod";
import CRC32 from "crc-32";
import { SyntaxError } from "../errors/SyntaxError";
export class Line {
    scope;
    line;
    lineIndex;
    fn;
    args;
    comment;
    runCounter = 0;
    constructor(scope, line, lineIndex) {
        this.scope = scope;
        this.line = line;
        this.lineIndex = lineIndex;
        this.parseLine();
    }
    parseLine() {
        const m = line.exec(this.line);
        if (m) {
            const [str, fn, args, comment] = m;
            const matches = z
                .object({
                str: z.string(),
                fn: z.string().optional(),
                args: z.array(z.union([z.string(), z.number()])).optional(),
                comment: z.string().optional(),
            })
                .parse({
                str,
                fn,
                args: args
                    ?.split(" ")
                    .filter((i) => i)
                    .map((i) => {
                    if (!isNaN(parseFloat(i)))
                        return parseFloat(i);
                    const h = this.parseHash(i);
                    if (h)
                        return h.toString();
                    return i;
                }),
                comment,
            });
            this.fn = matches.fn;
            this.args = matches.args;
            this.comment = matches.comment;
        }
    }
    // parse str HASH("SOME_STRING") to crc32(SOME_STRING)
    parseHash(str) {
        const matches = hash.exec(str);
        if (matches) {
            return CRC32.str(matches[1]);
        }
    }
    async run() {
        this.runCounter++;
        if (this.fn && !this.fn.endsWith(":")) {
            if (this.fn in functions) {
                try {
                    functions[this.fn](this.scope.env, this.args ?? []);
                }
                catch (e) {
                    if (e instanceof ZodError) {
                        this.scope.env.throw(new SyntaxError(e.errors[0].message, "error"));
                    }
                    else {
                        throw e;
                    }
                }
                return;
            }
            else {
                this.scope.env.throw(new SyntaxError(`Function ${this.fn} not found`, "error"));
            }
        }
    }
}
export default Line;
