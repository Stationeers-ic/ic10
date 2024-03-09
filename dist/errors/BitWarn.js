import Err from "../abstract/Err";
class BitWarn extends Err {
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
        this.name = "BitWarn";
    }
}
export default BitWarn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQml0V2Fybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvQml0V2Fybi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQTtBQUVqQyxNQUFNLE9BQVEsU0FBUSxHQUFHO0lBR2hCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFOUixZQUNDLE9BQWUsRUFDUixRQUE2QyxPQUFPLEVBQ3BELFNBQWtCLEVBQ2xCLE9BQWdCLEVBQ2hCLFNBQWtCLEVBQ2xCLE9BQWdCO1FBRXZCLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBTnRELFVBQUssR0FBTCxLQUFLLENBQStDO1FBQ3BELGNBQVMsR0FBVCxTQUFTLENBQVM7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFTO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFHdkIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUE7SUFDdEIsQ0FBQztDQUNEO0FBQ0QsZUFBZSxPQUFPLENBQUEifQ==