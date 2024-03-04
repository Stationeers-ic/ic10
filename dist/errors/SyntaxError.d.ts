import {Err} from "../abstract/Err";
import {ZodError} from "zod";
import Line from "../core/Line";

export declare class SyntaxError extends Err {
    level: "error" | "warn" | "info" | "debug";
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    charStart?: number | undefined;
    charEnd?: number | undefined;
    constructor(message: string, level?: "error" | "warn" | "info" | "debug", lineStart?: number | undefined, lineEnd?: number | undefined, charStart?: number | undefined, charEnd?: number | undefined);
    static fromZod(zodError: ZodError, line: Line): SyntaxError[];
}
export default SyntaxError;
