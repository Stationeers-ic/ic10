import {line} from "../regexps.js";
import {InterpreterIc10} from "../main.js";
import {functions} from "../functions.js";

export class Line {
    private fn: string | undefined;
    private args: any[] | undefined;
    private comment: string | undefined;

    constructor(private scope: InterpreterIc10, public line: string, public lineIndex: number) {
        this.parseLine()
    }

    parseLine() {
        const m = line.exec(this.line) as [string, string | undefined, string | undefined, string | undefined] | null
        if (m) {
            const [str, fn, args, comment] = m
            const matches = {
                str,
                fn,
                args: args?.split(" ").filter((i) => i),
                comment
            }
            this.fn = matches.fn
            this.args = matches.args
            this.comment = matches.comment
        }
    }

    public async run() {
        if (this.fn) {
            if (this.fn in functions) {
                return functions[this.fn](this.scope.env, this.args ?? []);
            }
        }
    }

}