import {Environment} from "./abstract/Environment.js";
import {Line} from "./core/Line.js";

export class InterpreterIc10 {
    constructor(public readonly env: Environment, private code: string) {
        this.parseCode()
    }

    public setCode(code: string) {
        this.code = code
    }

    parseCode() {
        return this.code.split('\n').map((line, i) => {
            const l = line.trim().replace(/\s+/g, ' ')// clear string
            return new Line(this, l, i)
        });
    }

    public run() {
        this.parseCode().forEach(async (line) => {
           await line.run()
        })
    }
}