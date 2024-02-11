import {line} from "../regexps";
import {InterpreterIc10} from "../main";

export class Line {
    private fn: string | undefined;
    private args: any[] | undefined;
    private comment: string | undefined;
    constructor(private scope: InterpreterIc10, public line: string) {
        this.parseLine()
    }

    parseLine() {
        const [str, fn, args, comment] = this.line.match(line) as [string, string | undefined, string | undefined, string | undefined]
        const matches = {
            str,
            fn,
            args: args?.split(" ").filter((i) => i),
            comment
        }
        console.log(matches)
        this.fn = matches.fn
        this.args = matches.args
        this.comment = matches.comment
    }

}