import {Positions} from "../regexps";
import {InterpreterIc10} from "../";

export declare class Line {
    private scope;
    readonly line: string;
    lineIndex: number;
    fn: string;
    args: (string | number)[];
    comment: string;
    runCounter: number;
    isGoTo: boolean;
    tokens: Positions | null;
    constructor(scope: InterpreterIc10, line: string, lineIndex: number);
    parseLine(): void;
    static parseHash(str: string): number | undefined;
    run(): Promise<Boolean>;
}
export default Line;
