import { Environment } from "./abstract/Environment";
import { Line } from "./core/Line";
export declare class InterpreterIc10 {
    readonly env: Environment;
    private code;
    constructor(env: Environment, code: string);
    setCode(code: string): void;
    parseCode(): Map<number, Line>;
    run(): Promise<void>;
}
export default InterpreterIc10;
