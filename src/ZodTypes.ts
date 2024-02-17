import { z } from "zod"

export const StringOrNumberOrNaN = z.union([z.string(), z.number(), z.nan()])
export const StringOrNumber = z.union([z.string(), z.number()])
export const NumberOrNan = z.number().or(z.nan())
// export const Result = RegisterOrAlias

export const Value = z.number()
export const Alias = z.string()

/**
 * r0 - r17
 */
export const Register = z.string().regex(/^r([0-9]|1[0-7])$/) //https://regex101.com/r/UiCGWX/1
/**
 * d0 - d6
 */
export const Device = z.string().regex(/^d([b0-5])$/) //https://regex101.com/r/pAET99/1
/**
 * Register | Alias
 */
export const Ralias = Register.or(Alias)
/**
 * Register | Alias
 *
 * alias for "Ralias"
 */
export const RegisterOrAlias = Ralias
/**
 * Device | Alias
 */
export const DeviceOrAlias = Device.or(Alias)

/**
 * Alias | numeric value
 */
export const AliasOrValue = Alias.or(Value)
/**
 * Alias | Register | numeric value
 */
export const RaliasOrValue = Alias.or(Value)
export const RaliasOrValuePositive = Alias.or(Value.positive())
export const SlotIndex = Alias.or(Value.positive().int())
export const LineIndex = Alias.or(Value.positive().int())
export const RelativeLineIndex = Alias.or(Value.int())
export const Hash = Alias.or(Value.int())

/**
 * Alias | NaN | numeric value
 */
export const AliasOrValueOrNaN = AliasOrValue.or(z.nan())
/**
 * Alias | Register | NaN | numeric value
 */
export const RaliasOrValueOrNaN = AliasOrValue.or(z.nan())

export const Logic = z.string()
/*
export const RegisterOrAlias = Register.or(z.string())
export const DeviceOrAlias = Device.or(z.string())
 */
/*
 *TODO: Add list reserved words
 */
export const NotReservedWord = z.string().refine((val) => ![
	'NaN',
	'Average',
	'Sum',
	'Minimum',
	'Maximum',
].includes(val),{
	message: 'Reserved word',
});



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
])
export type JumpFunctionName = z.infer<typeof JumpFunctionName>
