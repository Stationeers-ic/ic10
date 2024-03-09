class Err extends Error {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Fic3RyYWN0L0Vyci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFlLEdBQUksU0FBUSxLQUFLO0lBR3ZCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFOUixZQUNDLE9BQWUsRUFDUixRQUE2QyxPQUFPLEVBQ3BELFNBQWtCLEVBQ2xCLE9BQWdCLEVBQ2hCLFNBQWtCLEVBQ2xCLE9BQWdCO1FBRXZCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQU5QLFVBQUssR0FBTCxLQUFLLENBQStDO1FBQ3BELGNBQVMsR0FBVCxTQUFTLENBQVM7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFTO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQVM7SUFHeEIsQ0FBQztJQUVELE1BQU07UUFDTCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztZQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN6RSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztZQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQzlGLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxPQUFPLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFBO0lBQ25GLENBQUM7SUFFRCxRQUFRO1FBSVAsT0FBTztZQUNOLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ2pFLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFO1NBQzNELENBQUE7SUFDRixDQUFDO0NBQ0Q7QUFFRCxlQUFlLEdBQUcsQ0FBQSJ9