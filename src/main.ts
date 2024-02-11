import {Environment} from "./abstract/Environment";
import {Line} from "./core/Line";

export class InterpreterIc10 {
    constructor(public readonly env: Environment, private code: string) {
        this.parseCode()
    }

    public setCode(code: string) {
        this.code = code
    }

    parseCode() {
        return this.code.split('\n').map((line) => {
            const l = line.trim().replace(/\s+/g, ' ')
            return new Line(this, l)
        });
    }
}