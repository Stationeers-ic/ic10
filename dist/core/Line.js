import { getLineRegexGroupPositions, hash } from "../regexps";
import { functions } from "../functions";
import { z, ZodError } from "zod";
import CRC32 from "crc-32";
import { SyntaxError } from "../errors/SyntaxError";
import { AnyFunctionName } from "../ZodTypes";
const LineTest = z
    .tuple([
    z.string(),
    z.string().optional(),
    z
        .string()
        .optional()
        .transform((args) => args
        ?.split(" ")
        .filter((i) => i)
        .map((i) => {
        if (!isNaN(parseFloat(i)))
            return parseFloat(i);
        const h = Line.parseHash(i);
        if (h)
            return h.toString();
        return i;
    }))
        .pipe(z.array(z.union([z.string(), z.number()])).optional()),
    z.string().optional(),
])
    .nullable();
export class Line {
    scope;
    line;
    lineIndex;
    fn = "";
    args = [];
    comment = "";
    runCounter = 0;
    isGoTo;
    tokens = null;
    constructor(scope, line, lineIndex) {
        this.scope = scope;
        this.line = line;
        this.lineIndex = lineIndex;
        this.parseLine();
        this.isGoTo = this.fn?.endsWith(":") ?? false;
    }
    parseLine() {
        this.tokens = getLineRegexGroupPositions(this.line);
        if (!this.tokens) {
            return;
        }
        this.fn = this.tokens.fn.value;
        this.args = this.tokens.args.map((i) => {
            if (!isNaN(parseFloat(i.value)))
                return parseFloat(i.value);
            const h = Line.parseHash(i.value);
            if (h)
                return h.toString();
            return i.value;
        });
        this.comment = this.tokens.comment.value;
    }
    // parse str HASH("SOME_STRING") to crc32(SOME_STRING)
    static parseHash(str) {
        const matches = hash.exec(str);
        if (matches) {
            return CRC32.str(matches[1]);
        }
    }
    async run() {
        if (this.fn && !this.fn.endsWith(":")) {
            this.runCounter++;
            const fn = AnyFunctionName.safeParse(this.fn);
            if (fn.success) {
                try {
                    this.scope.env.emit(`before_${fn.data}`, this.args ?? [], this);
                    functions[fn.data](this.scope.env, this.args ?? []);
                    this.scope.env.emit(`after_${fn.data}`, this.args ?? [], this);
                }
                catch (e) {
                    if (e instanceof ZodError) {
                        // this.scope.env.throw(new SyntaxError(e.errors[0].message, "error"))
                        SyntaxError.fromZod(e, this).forEach((e) => this.scope.env.throw(e));
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                this.scope.env.throw(new SyntaxError(`Function ${this.fn} not found`, "error", this.lineIndex, this.lineIndex, this.tokens?.fn.start, this.tokens?.fn.end));
            }
            return true;
        }
        return false;
    }
}
export default Line;
