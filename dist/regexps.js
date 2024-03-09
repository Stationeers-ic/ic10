import { z } from "zod";
import { isKeyOfObject } from "./ZodTypes";
export const line = /^\s*(?<fn>[^#:\s]+:?)(?<args>.*?)(?<comment>#.*)*$/;
export const args = /\s*(HASH\(".*?(?="\))"\)|\S+)/g;
export const dynamicRegisterReg = /^(?<rr>r+)(?<first>r\d+)$/;
export const dynamicRegisterGroups = z.object({
    rr: z.string(),
    first: z.string(),
});
export const dynamicDevice = /^d(?<rr>(r+\d+))$/;
export const dynamicDeviceGroups = z.object({
    rr: z.string(),
});
export const Position = z.object({
    value: z.string(),
    start: z.number(),
    end: z.number(),
    length: z.number(),
});
export const Positions = z.object({
    fn: Position,
    args: z.array(Position),
    comment: Position,
});
export const tokenize = (text) => {
    const match = line.exec(text);
    if (match === null)
        return null;
    const groups = match.groups;
    if (!groups)
        return null;
    const groupPositions = {
        fn: { value: "", start: 0, end: 0, length: 0 },
        args: [],
        comment: { value: "", start: 0, end: 0, length: 0 },
    };
    Object.entries(groups).forEach(([groupName, group]) => {
        if (group !== undefined) {
            const start = match.index + match[0].indexOf(group);
            const length = group.length;
            const end = start + length;
            if (isKeyOfObject(groupName, groupPositions)) {
                if (groupName === "args") {
                    ;
                    [...group.matchAll(args)].forEach((k, i) => {
                        const [v, arg] = k;
                        const argStart = start + v.indexOf(arg) + (k.index ?? 0);
                        const argLength = arg.length;
                        const argEnd = argStart + argLength;
                        groupPositions[groupName].push({
                            value: arg,
                            start: argStart,
                            end: argEnd,
                            length: argLength,
                        });
                    });
                }
                else
                    groupPositions[groupName] = {
                        value: group,
                        start,
                        end,
                        length,
                    };
            }
        }
    });
    return Positions.parse(groupPositions);
};
export const hash = new RegExp('^HASH\\("(?<hash>.+?)"\\)$', "");
export const reg = /^(?<prefix>r*)r(?<index>0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a)$/;
export const dev = /^d([012345b])$/;
export const strStart = /^".+$/;
export const strEnd = /.+"$/;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXhwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZWdleHBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUUxQyxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsb0RBQW9ELENBQUE7QUFDeEUsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLGdDQUFnQyxDQUFBO0FBRXBELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLDJCQUEyQixDQUFBO0FBQzdELE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDN0MsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUU7SUFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtDQUNqQixDQUFDLENBQUE7QUFDRixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUE7QUFDaEQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUMzQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtDQUNkLENBQUMsQ0FBQTtBQUNGLE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2hDLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO0lBQ2pCLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO0lBQ2pCLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO0lBQ2YsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUU7Q0FDbEIsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDakMsRUFBRSxFQUFFLFFBQVE7SUFDWixJQUFJLEVBQUUsQ0FB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