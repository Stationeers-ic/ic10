import { InterpreterIc10 } from "../main";
export declare class Line {
    private scope;
    line: string;
    lineIndex: number;
    fn: string | undefined;
    args: any[] | undefined;
    comment: string | undefined;
    runCounter: number;
    constructor(scope: InterpreterIc10, line: string, lineIndex: number);
    parseLine(): void;
    parseHash(str: string): number | undefined;
    run(): Promise<void>;
}
