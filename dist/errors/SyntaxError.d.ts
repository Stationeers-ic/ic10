import type { ZodError } from "zod";
import type Line from "../core/Line";
import Err from "../abstract/Err";
export declare class SyntaxError extends Err {
    level: "error" | "warn" | "info" | "debug";
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    charStart?: number | undefined;
    charEnd?: number | undefined;
    readonly name: string;
    constructor(message: string, level?: "error" | "warn" | "info" | "debug", lineStart?: number | undefined, lineEnd?: number | undefined, charStart?: number | undefined, charEnd?: number | undefined);
    static fromZod(zodError: ZodError, line: Line): SyntaxError[];
}
export default SyntaxError;
