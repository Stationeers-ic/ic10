import Err from "../abstract/Err";
export class SyntaxError extends Err {
    level;
    lineStart;
    lineEnd;
    charStart;
    charEnd;
    constructor(message, level = "error", lineStart, lineEnd, charStart, charEnd) {
        super(message, level, lineStart, lineEnd, charStart, charEnd);
        this.level = level;
        this.lineStart = lineStart;
        this.lineEnd = lineEnd;
        this.charStart = charStart;
        this.charEnd = charEnd;
        this.name = "SyntaxError";
    }
    static fromZod(zodError, line) {
        const errors = [];
        const defaultError = (e, line) => {
            errors.push(new SyntaxError(e.message, "error", line.lineIndex, line.lineIndex, 0, line.line.length));
        };
        zodError.errors.forEach((e) => {
            if (e.path.length === 0) {
                return defaultError(e, line);
            }
            e.path.forEach((opIndex) => {
                const tokens = line.tokens;
                if (!tokens) {
                    return defaultError(e, line);
                }
                const op = parseInt(opIndex.toString());
                if (isNaN(op)) {
                    return defaultError(e, line);
                }
                const p = tokens.args[op];
                if (typeof p === "undefined") {
                    return defaultError(e, line);
                }
                errors.push(new SyntaxError(e.message, "error", line.lineIndex, line.lineIndex, p.start, p.end));
            });
        });
        return errors;
    }
}
export default SyntaxError;
