declare abstract class Err extends Error {
    level: "error" | "warn" | "info" | "debug";
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    charStart?: number | undefined;
    charEnd?: number | undefined;
    protected constructor(message: string, level?: "error" | "warn" | "info" | "debug", lineStart?: number | undefined, lineEnd?: number | undefined, charStart?: number | undefined, charEnd?: number | undefined);
    format(): string;
    position(): {
        start: {
            line: number;
            char: number;
        };
        end: {
            line: number;
            char: number;
        };
    };
}
export default Err;
