import { Err } from "../abstract/Err";
export class InfiniteLoop extends Err {
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
        this.name = "InfiniteLoop";
    }
}
