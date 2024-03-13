import { z } from "zod"

export const StringOrNumberOrNaN = z.union([z.string(), z.number(), z.nan()])
export type StringOrNumberOrNaN = z.infer<typeof StringOrNumberOrNaN>
export const StringOrNumber = z.union([z.string(), z.number()])
export type StringOrNumber = z.infer<typeof StringOrNumber>
export const NumberOrNan = z.number().or(z.nan())
export type NumberOrNan = z.infer<typeof NumberOrNan>

/**
 * r0 - r17, sp,
 *
 * nested registers (rrr?) also
 */
export const Register = z.union([z.literal("sp"), z.string().regex(/r+[0-9]+/)])
export type Register = z.infer<typeof Register>
/**
 * d0 - d5, db,
 *
 * nested registers (drr?) also
 */
export const Device = z.union([z.literal("db"), z.string().regex(/(dr*[0-9]+)|:([0-9]+)/)])
export type Device = z.infer<typeof Device>
/**
 * Register | Device
 */
export const RegisterOrDevice = Register.or(Device)
export type RegisterOrDevice = z.infer<typeof RegisterOrDevice>
/**
 * Number
 */
export const Value = z.number()
export type Value = z.infer<typeof Value>

/**
 * Alias
 *
 * Any string that is not Register or Device
 */
export const Alias = z.string().refine((val: string) => {
	return !RegisterOrDevice.safeParse(val).success
}, "Alias can be only string and not a register or device name.")
export type Alias = z.infer<typeof Alias>

/**
 * Register | Alias
 */
export const Ralias = Register.or(Alias)
export type Ralias = z.infer<typeof Ralias>
/**
 * Register | Alias
 *
 * alias for "Ralias"
 */
export const RegisterOrAlias = Ralias
export type RegisterOrAlias = z.infer<typeof RegisterOrAlias>

/**
 * Device | Alias
 */
export const DeviceOrAlias = Device.or(Alias)
export type DeviceOrAlias = z.infer<typeof DeviceOrAlias>

/**
 * Alias | Number
 */
export const AliasOrValue = Alias.or(Value)
export type AliasOrValue = z.infer<typeof AliasOrValue>
/**
 * Alias | Register | Number
 */
export const RaliasOrValue = Ralias.or(Value)
export type RaliasOrValue = z.infer<typeof RaliasOrValue>
/**
 * TODO: add jsdoc
 */
export const RaliasOrValuePositive = Ralias.or(Value.min(0))
export type RaliasOrValuePositive = z.infer<typeof RaliasOrValuePositive>
/**
 * TODO: add jsdoc
 */
export const SlotIndex = Ralias.or(Value.min(0).int())
export type SlotIndex = z.infer<typeof SlotIndex>
/**
 * TODO: add jsdoc
 */
export const RelativeSlotIndex = Ralias.or(Value.int())
export type RelativeSlotIndex = z.infer<typeof RelativeSlotIndex>
/**
 * TODO: add jsdoc
 */
export const LineIndex = Ralias.or(Value.min(0).int())
export type LineIndex = z.infer<typeof LineIndex>
/**
 * TODO: add jsdoc
 */
export const RelativeLineIndex = Ralias.or(Value.int())
export type RelativeLineIndex = z.infer<typeof RelativeLineIndex>
/**
 * TODO: add jsdoc
 */
export const Hash = Ralias.or(Value.int())
export type Hash = z.infer<typeof Hash>

/**
 * Alias | NaN | Number
 */
export const AliasOrValueOrNaN = AliasOrValue.or(z.nan())
export type AliasOrValueOrNaN = z.infer<typeof AliasOrValueOrNaN>
/**
 * Alias | Register | NaN | Number
 */
export const RaliasOrValueOrNaN = AliasOrValue.or(z.nan())
export type RaliasOrValueOrNaN = z.infer<typeof RaliasOrValueOrNaN>
/**
 * TODO: add jsdoc
 */
export const Logic = z.string()
export type Logic = z.infer<typeof Logic>
/**
 * TODO: add jsdoc
 */
export const Mode = z.string()
export type Mode = z.infer<typeof Mode>
/*
export const RegisterOrAlias = Register.or(z.string())
export const DeviceOrAlias = Device.or(z.string())
 */
/*
 *TODO: Add list reserved words
 */
export const NotReservedWord = z
	.string()
	.refine((val) => !["NaN", "Average", "Sum", "Minimum", "Maximum"].includes(val), {
		message: "Reserved word",
	})

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
])
export type ConditionName = z.infer<typeof ConditionName>

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
])
export type ArithmeticInstructionName = z.infer<typeof ArithmeticInstructionName>

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
])
export type SelectInstructionName = z.infer<typeof SelectInstructionName>

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
])
export type JumpInstructionName = z.infer<typeof JumpInstructionName>

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
])
export type DeviceInstructionName = z.infer<typeof DeviceInstructionName>

export const MiscInstructionName = z.union([
	z.literal("alias"),
	z.literal("define"),
	z.literal("move"),
	z.literal("yield"),
	z.literal("sleep"),
	z.literal("hcf"),
])
export type MiscInstructionName = z.infer<typeof MiscInstructionName>

export const StackInstructionName = z.union([z.literal("push"), z.literal("pop"), z.literal("peek")])
export type StackInstructionName = z.infer<typeof StackInstructionName>

export const AnyInstructionName = z.union([
	ArithmeticInstructionName,
	SelectInstructionName,
	JumpInstructionName,
	DeviceInstructionName,
	MiscInstructionName,
	StackInstructionName,
])
export type AnyInstructionName = z.infer<typeof AnyInstructionName>

export function isKeyOfObject<T extends object>(key: string | number | symbol, obj: T): key is keyof T {
	return key in obj
}

export function isKeyOfArray<T extends Array<any>>(key: string | number | symbol, arr: T): key is keyof T {
	return arr.includes(key)
}
