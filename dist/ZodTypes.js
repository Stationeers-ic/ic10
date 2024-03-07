import { z } from "zod";
export const StringOrNumberOrNaN = z.union([z.string(), z.number(), z.nan()]);
export const StringOrNumber = z.union([z.string(), z.number()]);
export const NumberOrNan = z.number().or(z.nan());
export const Register = z.union([z.literal("sp"), z.string().regex(/r[0-9]+/)]);
export const Device = z.union([z.literal("db"), z.string().regex(/d[0-9]+/)]);
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
export const ArithmeticFunctionName = z.union([
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
export const SelectFunctionName = z.union([
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
export const JumpFunctionName = z.union([
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
export const DeviceFunctionName = z.union([
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
export const MiscFunctionName = z.union([
    z.literal("alias"),
    z.literal("define"),
    z.literal("move"),
    z.literal("yield"),
    z.literal("sleep"),
    z.literal("hcf"),
]);
export const StackFunctionName = z.union([z.literal("push"), z.literal("pop"), z.literal("peek")]);
export const AnyFunctionName = z.union([
    ArithmeticFunctionName,
    SelectFunctionName,
    JumpFunctionName,
    DeviceFunctionName,
    MiscFunctionName,
    StackFunctionName,
]);
export function isKeyOfObject(key, obj) {
    return key in obj;
}
export function isKeyOfArray(key, arr) {
    return arr.includes(key);
}
