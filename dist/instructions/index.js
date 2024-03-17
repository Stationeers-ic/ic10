import arithmetic from "./arithmetic";
import jump from "./jump";
import select from "./select";
import misc from "./misc";
import device from "./device";
import stack from "./stack";
import { AnyInstructionName } from "../ZodTypes";
import allInstructions from "../data/instructions";
const instructionsPartial = {
    ...arithmetic,
    ...misc,
    ...jump,
    ...select,
    ...device,
    ...stack,
};
allInstructions.forEach(({ name, preview, description, deprecated }) => {
    const data = AnyInstructionName.safeParse(name);
    if (!data.success)
        return console.error(`${name} is not implemented`);
    const n = data.data;
    instructionsPartial[n].description = description;
    instructionsPartial[n].example = preview;
    instructionsPartial[n].deprecated = deprecated || false;
});
export const instructions = instructionsPartial;
export default instructions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5zdHJ1Y3Rpb25zL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sVUFBVSxNQUFNLGNBQWMsQ0FBQTtBQUNyQyxPQUFPLElBQUksTUFBTSxRQUFRLENBQUE7QUFDekIsT0FBTyxNQUFNLE1BQU0sVUFBVSxDQUFBO0FBQzdCLE9BQU8sSUFBSSxNQUFNLFFBQVEsQ0FBQTtBQUN6QixPQUFPLE1BQU0sTUFBTSxVQUFVLENBQUE7QUFDN0IsT0FBTyxLQUFLLE1BQU0sU0FBUyxDQUFBO0FBQzNCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUNoRCxPQUFPLGVBQWUsTUFBTSxzQkFBc0IsQ0FBQTtBQUVsRCxNQUFNLG1CQUFtQixHQUFxRDtJQUM3RSxHQUFHLFVBQVU7SUFDYixHQUFHLElBQUk7SUFDUCxHQUFHLElBQUk7SUFDUCxHQUFHLE1BQU07SUFDVCxHQUFHLE1BQU07SUFDVCxHQUFHLEtBQUs7Q0FDUixDQUFBO0FBRUQsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRTtJQUN0RSxNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQUUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxDQUFBO0lBQ3JFLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDbkIsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtJQUNoRCxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0lBQ3hDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxVQUFVLElBQUksS0FBSyxDQUFBO0FBQ3hELENBQUMsQ0FBQyxDQUFBO0FBR0YsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUE4QyxtQkFHdEUsQ0FBQTtBQUNELGVBQWUsWUFBWSxDQUFBIn0=