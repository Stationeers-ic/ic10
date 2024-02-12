import {hash, line} from "../regexps.js";
import {InterpreterIc10} from "../main.js";
import {functions} from "../functions.js";
import {z} from "zod";
import {crc32} from "crc";

export class Line {
    public fn: string | undefined;
    public args: any[] | undefined;
    public comment: string | undefined
    public runCounter: number = 0

    constructor(private scope: InterpreterIc10, public line: string, public lineIndex: number) {
        this.parseLine()
    }

    parseLine() {
        const m = line.exec(this.line) as [string, string | undefined, string | undefined, string | undefined] | null
        if (m) {
            const [str, fn, args, comment] = m
            const matches = z.object({
                str: z.string(),
                fn: z.string().optional(),
                args: z.array(z.union([z.string(), z.number()])).optional(),
                comment: z.string().optional()
            }).parse({
                str,
                fn,
                args: args?.split(" ").filter((i) => i).map((i): number | string => {
                    if (!isNaN(parseFloat(i))) return parseFloat(i)
                    const h = this.parseHash(i)
                    if (h) return h.toString()
                    return i
                }),
                comment
            })
            this.fn = matches.fn
            this.args = matches.args
            this.comment = matches.comment
        }
    }

    // parse str HASH("SOME_STRING") to crc32(SOME_STRING)
    parseHash(str: string) {
        const matches = hash.exec(str) as [string, string] | null
        if (matches) {
            return crc32(matches[1])
        }
    }

    public async run() {
        this.runCounter++
        if (this.fn && !this.fn.endsWith(':')) {
            if (this.fn in functions) {
                functions[this.fn](this.scope.env, this.args ?? []);
                return
            } else {
                console.warn(`Function ${this.fn} not found`)
            }
        }
    }

}