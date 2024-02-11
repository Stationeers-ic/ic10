import { Environment } from "./abstract/Environment.js";
import { Line } from "./core/Line.js";
export declare class InterpreterIc10 {
    readonly env: Environment;
    private code;
    constructor(env: Environment, code: string);
    setCode(code: string): void;
    parseCode(): Line[];
    run(): void;
}
