import Err from "../abstract/Err";
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
export default InfiniteLoop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5maW5pdGVMb29wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy9JbmZpbml0ZUxvb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0saUJBQWlCLENBQUE7QUFFakMsTUFBTSxPQUFPLFlBQWEsU0FBUSxHQUFHO0lBRzVCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFOUixZQUNDLE9BQWUsRUFDUixRQUE2QyxPQUFPLEVBQ3BELFNBQWtCLEVBQ2xCLE9BQWdCLEVBQ2hCLFNBQWtCLEVBQ2xCLE9BQWdCO1FBRXZCLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBTnRELFVBQUssR0FBTCxLQUFLLENBQStDO1FBQ3BELGNBQVMsR0FBVCxTQUFTLENBQVM7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFTO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFHdkIsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLENBQUE7SUFDM0IsQ0FBQztDQUNEO0FBRUQsZUFBZSxZQUFZLENBQUEifQ==