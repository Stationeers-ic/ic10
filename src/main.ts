import {Environment} from "./abstract/Environment.js";
import {Line} from "./core/Line.js";

export class InterpreterIc10 {
    constructor(public readonly env: Environment, private code: string) {
    }

    public setCode(code: string) {
        this.code = code
    }

    parseCode() {
        return new Map(this.code.split('\n').map((line, i) => {
            const l = line.trim().replace(/\s+/g, ' ')// clear string
            return [i, new Line(this, l, i)]
        }));
    }

    public async run() {
        const lines = this.parseCode()

        const size = lines.size
        while (this.env.line < size) {
            let old = this.env.line
            const line = lines.get(this.env.line)
            if (line) {
                await line.run()
            }
            if (old === this.env.line) {
                this.env.line++
            }
        }
    }
}