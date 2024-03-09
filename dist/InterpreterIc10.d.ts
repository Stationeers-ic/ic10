import Environment from "./abstract/Environment";
declare class InterpreterIc10 {
    private code;
    private stopRun;
    readonly env: Environment;
    constructor(env: Environment, code: string);
    setCode(code: string): this;
    private parseCode;
    stop(): void;
    step(): Promise<string | boolean>;
    testCode(): Promise<void>;
    run(codeLines?: number, dryRun?: number): Promise<string>;
}
export default InterpreterIc10;
