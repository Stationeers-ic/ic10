import type Environment from "./abstract/Environment";
export declare class InterpreterIc10 {
    code: string;
    stopRun: boolean;
    env: Environment;
    constructor(env: Environment, code: string);
    setCode(code: string): this;
    setEnv(env: Environment): this;
    parseCode(): this;
    testCode(): Promise<void>;
    step(): Promise<string | boolean>;
    run(codeLines?: number, dryRun?: number): Promise<string>;
    stop(): void;
}
export default InterpreterIc10;
