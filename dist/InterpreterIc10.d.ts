import { Environment } from "./abstract/Environment";
export declare class InterpreterIc10 {
    private code;
    readonly env: Environment;
    constructor(env: Environment, code: string);
    setCode(code: string): this;
    private parseCode;
    step(): Promise<string | boolean>;
    testCode(): Promise<void>;
    run(codeLines?: number, dryRun?: number): Promise<string>;
}
export default InterpreterIc10;
