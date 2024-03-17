import Err from "../abstract/Err";
export class BitWarn extends Err {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQml0V2Fybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lcnJvcnMvQml0V2Fybi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQTtBQUVqQyxNQUFNLE9BQU8sT0FBUSxTQUFRLEdBQUc7SUFHdkI7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQU5SLFlBQ0MsT0FBZSxFQUNSLFFBQTZDLE9BQU8sRUFDcEQsU0FBa0IsRUFDbEIsT0FBZ0IsRUFDaEIsU0FBa0IsRUFDbEIsT0FBZ0I7UUFFdkIsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFOdEQsVUFBSyxHQUFMLEtBQUssQ0FBK0M7UUFDcEQsY0FBUyxHQUFULFNBQVMsQ0FBUztRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGNBQVMsR0FBVCxTQUFTLENBQVM7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUd2QixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQTtJQUN0QixDQUFDO0NBQ0Q7QUFDRCxlQUFlLE9BQU8sQ0FBQSJ9