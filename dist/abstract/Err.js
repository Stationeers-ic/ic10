export class Err extends Error {
    level;
    lineStart;
    lineEnd;
    charStart;
    charEnd;
    constructor(message, level = "error", lineStart, lineEnd, charStart, charEnd) {
        super(message);
        this.level = level;
        this.lineStart = lineStart;
        this.lineEnd = lineEnd;
        this.charStart = charStart;
        this.charEnd = charEnd;
    }
    format() {
        if (this.lineStart === undefined)
            return `${this.level}: ${this.message}`;
        if (this.charStart === undefined)
            return `${this.level}: ${this.message} at ${this.lineStart}`;
        return `${this.level}: ${this.message} at ${this.lineStart}:${this.charStart + 1}`;
    }
    position() {
        return {
            start: { line: this.lineStart ?? -1, char: this.charStart ?? -1 },
            end: { line: this.lineEnd ?? -1, char: this.charEnd ?? -1 },
        };
    }
}
export default Err;
