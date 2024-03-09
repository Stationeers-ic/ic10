import Environment from "./abstract/Environment";
declare class InterpreterIc10 {
    code: string;
    stopRun: boolean;
    env: Environment;
    constructor(env: Environment, code: string);
    setCode(code: string): this;
    setEnv(env: Environment): this;
    private parseCode;
    stop(): void;
    step(): Promise<string | boolean>;
    testCode(): Promise<void>;
    run(codeLines?: number, dryRun?: number): Promise<string>;
}
export default InterpreterIc10;
