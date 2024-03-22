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
    format(startLineNumber = 0) {
        if (this.lineStart === undefined)
            return `${this.level}: ${this.message}`;
        if (this.charStart === undefined)
            return `${this.level}: ${this.message} at ${this.lineStart + startLineNumber}`;
        return `${this.level}: ${this.message} at ${this.lineStart + startLineNumber}:${this.charStart + 1}`;
    }
    position() {
        return {
            start: { line: this.lineStart ?? -1, char: this.charStart ?? -1 },
            end: { line: this.lineEnd ?? -1, char: this.charEnd ?? -1 },
        };
    }
}
export default Err;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Fic3RyYWN0L0Vyci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQWdCLEdBQUksU0FBUSxLQUFLO0lBRzlCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFOUixZQUNDLE9BQWUsRUFDUixRQUE2QyxPQUFPLEVBQ3BELFNBQWtCLEVBQ2xCLE9BQWdCLEVBQ2hCLFNBQWtCLEVBQ2xCLE9BQWdCO1FBRXZCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQU5QLFVBQUssR0FBTCxLQUFLLENBQStDO1FBQ3BELGNBQVMsR0FBVCxTQUFTLENBQVM7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFTO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQVM7SUFHeEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxrQkFBeUIsQ0FBQztRQUNoQyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztZQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN6RSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztZQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLE9BQU8sSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFlLEVBQUUsQ0FBQTtRQUNoSCxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxPQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLENBQUE7SUFDckcsQ0FBQztJQUVELFFBQVE7UUFJUCxPQUFPO1lBQ04sS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDakUsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLEVBQUU7U0FDM0QsQ0FBQTtJQUNGLENBQUM7Q0FDRDtBQUVELGVBQWUsR0FBRyxDQUFBIn0=