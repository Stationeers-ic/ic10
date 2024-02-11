import { InterpreterIc10 } from "../main.js";
export declare class Line {
    private scope;
    line: string;
    lineIndex: number;
    private fn;
    private args;
    private comment;
    constructor(scope: InterpreterIc10, line: string, lineIndex: number);
    parseLine(): void;
    run(): Promise<void>;
}
