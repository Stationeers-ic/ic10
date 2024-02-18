export declare abstract class Err extends Error {
    level: "error" | "warn" | "info" | "debug";
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    charStart?: number | undefined;
    charEnd?: number | undefined;
    protected constructor(message: string, level?: "error" | "warn" | "info" | "debug", lineStart?: number | undefined, lineEnd?: number | undefined, charStart?: number | undefined, charEnd?: number | undefined);
}
export default Err;
