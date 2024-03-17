import { z } from "zod";
export const StringOrNumberOrNaN = z.union([z.string(), z.number(), z.nan()]);
export const StringOrNumber = z.union([z.string(), z.number()]);
export const NumberOrNan = z.number().or(z.nan());
export const Register = z.union([z.literal("sp"), z.string().regex(/r+[0-9]+/)]);
export const Device = z.union([z.literal("db"), z.string().regex(/(dr*[0-9]+)|:([0-9]+)/)]);
export const RegisterOrDevice = Register.or(Device);
export const Value = z.number();
export const Alias = z.string().refine((val) => {
    return !RegisterOrDevice.safeParse(val).success;
}, "Alias can be only string and not a register or device name.");
export const Ralias = Register.or(Alias);
export const RegisterOrAlias = Ralias;
export const DeviceOrAlias = Device.or(Alias);
export const AliasOrValue = Alias.or(Value);
export const RaliasOrValue = Ralias.or(Value);
export const RaliasOrValuePositive = Ralias.or(Value.min(0));
export const SlotIndex = Ralias.or(Value.min(0).int());
export const RelativeSlotIndex = Ralias.or(Value.int());
export const LineIndex = Ralias.or(Value.min(0).int());
export const RelativeLineIndex = Ralias.or(Value.int());
export const Hash = Ralias.or(Value.int());
export const AliasOrValueOrNaN = AliasOrValue.or(z.nan());
export const RaliasOrValueOrNaN = AliasOrValue.or(z.nan());
export const Logic = z.string();
export const Mode = z.string();
export const NotReservedWord = z
    .string()
    .refine((val) => !["NaN", "Average", "Sum", "Minimum", "Maximum"].includes(val), {
    message: "Reserved word",
});
export const ConditionName = z.union([
    z.literal("eq"),
    z.literal("ge"),
    z.literal("gt"),
    z.literal("le"),
    z.literal("lt"),
    z.literal("ne"),
    z.literal("na"),
    z.literal("ap"),
    z.literal("dse"),
    z.literal("dns"),
    z.literal("nan"),
    z.literal("nanz"),
]);
export const ArithmeticInstructionName = z.union([
    z.literal("add"),
    z.literal("sub"),
    z.literal("mul"),
    z.literal("div"),
    z.literal("mod"),
    z.literal("sqrt"),
    z.literal("round"),
    z.literal("trunc"),
    z.literal("ceil"),
    z.literal("floor"),
    z.literal("max"),
    z.literal("min"),
    z.literal("abs"),
    z.literal("log"),
    z.literal("exp"),
    z.literal("rand"),
    z.literal("sll"),
    z.literal("srl"),
    z.literal("sla"),
    z.literal("sra"),
    z.literal("sin"),
    z.literal("cos"),
    z.literal("tan"),
    z.literal("asin"),
    z.literal("acos"),
    z.literal("atan"),
    z.literal("atan2"),
    z.literal("and"),
    z.literal("or"),
    z.literal("xor"),
    z.literal("nor"),
]);
export const SelectInstructionName = z.union([
    z.literal("seq"),
    z.literal("sge"),
    z.literal("sgt"),
    z.literal("sle"),
    z.literal("slt"),
    z.literal("sne"),
    z.literal("sap"),
    z.literal("sna"),
    z.literal("seqz"),
    z.literal("sgez"),
    z.literal("sgtz"),
    z.literal("slez"),
    z.literal("sltz"),
    z.literal("snez"),
    z.literal("sapz"),
    z.literal("snaz"),
    z.literal("sdse"),
    z.literal("sdns"),
    z.literal("snan"),
    z.literal("snanz"),
    z.literal("select"),
]);
export const JumpInstructionName = z.union([
    z.literal("j"),
    z.literal("jr"),
    z.literal("jal"),
    z.literal("beq"),
    z.literal("beqz"),
    z.literal("bge"),
    z.literal("bgez"),
    z.literal("bgt"),
    z.literal("bgtz"),
    z.literal("ble"),
    z.literal("blez"),
    z.literal("blt"),
    z.literal("bltz"),
    z.literal("bne"),
    z.literal("bnez"),
    z.literal("bap"),
    z.literal("bapz"),
    z.literal("bna"),
    z.literal("bnaz"),
    z.literal("bdse"),
    z.literal("bdns"),
    z.literal("bnan"),
    z.literal("breq"),
    z.literal("breqz"),
    z.literal("brge"),
    z.literal("brgez"),
    z.literal("brgt"),
    z.literal("brgtz"),
    z.literal("brle"),
    z.literal("brlez"),
    z.literal("brlt"),
    z.literal("brltz"),
    z.literal("brne"),
    z.literal("brnez"),
    z.literal("brap"),
    z.literal("brapz"),
    z.literal("brna"),
    z.literal("brnaz"),
    z.literal("brdse"),
    z.literal("brdns"),
    z.literal("brnan"),
    z.literal("beqal"),
    z.literal("beqzal"),
    z.literal("bgeal"),
    z.literal("bgezal"),
    z.literal("bgtal"),
    z.literal("bgtzal"),
    z.literal("bleal"),
    z.literal("blezal"),
    z.literal("bltal"),
    z.literal("bltzal"),
    z.literal("bneal"),
    z.literal("bnezal"),
    z.literal("bapal"),
    z.literal("bapzal"),
    z.literal("bnaal"),
    z.literal("bnazal"),
    z.literal("bdseal"),
    z.literal("bdnsal"),
]);
export const DeviceInstructionName = z.union([
    z.literal("s"),
    z.literal("l"),
    z.literal("ls"),
    z.literal("sb"),
    z.literal("lb"),
    z.literal("lbn"),
    z.literal("lr"),
    z.literal("sbn"),
    z.literal("lbs"),
    z.literal("lbns"),
    z.literal("ss"),
    z.literal("sbs"),
]);
export const MiscInstructionName = z.union([
    z.literal("alias"),
    z.literal("label"),
    z.literal("define"),
    z.literal("move"),
    z.literal("yield"),
    z.literal("sleep"),
    z.literal("hcf"),
]);
export const StackInstructionName = z.union([
    z.literal("push"),
    z.literal("pop"),
    z.literal("peek"),
]);
export const AnyInstructionName = z.union([
    ArithmeticInstructionName,
    SelectInstructionName,
    JumpInstructionName,
    DeviceInstructionName,
    MiscInstructionName,
    StackInstructionName,
]);
export function isKeyOfObject(key, obj) {
    return key in obj;
}
export function isKeyOfArray(key, arr) {
    return arr.includes(key);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9kVHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvWm9kVHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQTtBQUV2QixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBRTdFLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFFL0QsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7QUFRakQsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBT2hGLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFBO0FBSzNGLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7QUFLbkQsTUFBTSxDQUFDLE1BQU0sS0FBSyxH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QUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDaEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Q0FDaEIsQ0FBQyxDQUFBO0FBR0YsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM1QyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztDQUNuQixDQUFDLENBQUE7QUFHRixNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2QsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDZixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztDQUNuQixDQUFDLENBQUE7QUFHRixNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2QsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDZCxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUNmLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDZixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUNoQixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUNmLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Q0FDaEIsQ0FBQyxDQUFBO0FBR0YsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMxQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNuQixDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNsQixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztDQUNoQixDQUFDLENBQUE7QUFHRixNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBRTNDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0NBQ2pCLENBQUMsQ0FBQTtBQUdGLE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDekMseUJBQXlCO0lBQ3pCLHFCQUFxQjtJQUNyQixtQkFBbUI7SUFDbkIscUJBQXFCO0lBQ3JCLG1CQUFtQjtJQUNuQixvQkFBb0I7Q0FDcEIsQ0FBQyxDQUFBO0FBR0YsTUFBTSxVQUFVLGFBQWEsQ0FBbUIsR0FBNkIsRUFBRSxHQUFNO0lBQ3BGLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQTtBQUNsQixDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FBdUIsR0FBNkIsRUFBRSxHQUFNO0lBQ3ZGLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUN6QixDQUFDIn0=