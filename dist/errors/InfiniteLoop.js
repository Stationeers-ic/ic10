import Err from "../abstract/Err";
class InfiniteLoop extends Err {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5maW5pdGVMb29wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy9JbmZpbml0ZUxvb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0saUJBQWlCLENBQUE7QUFFakMsTUFBTSxZQUFhLFNBQVEsR0FBRztJQUdyQjtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBTlIsWUFDQyxPQUFlLEVBQ1IsUUFBNkMsT0FBTyxFQUNwRCxTQUFrQixFQUNsQixPQUFnQixFQUNoQixTQUFrQixFQUNsQixPQUFnQjtRQUV2QixLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQU50RCxVQUFLLEdBQUwsS0FBSyxDQUErQztRQUNwRCxjQUFTLEdBQVQsU0FBUyxDQUFTO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsY0FBUyxHQUFULFNBQVMsQ0FBUztRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBR3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFBO0lBQzNCLENBQUM7Q0FDRDtBQUVELGVBQWUsWUFBWSxDQUFBIn0=