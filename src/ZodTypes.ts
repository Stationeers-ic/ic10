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
 * d0 | d1 | d2 | d3 | d4 | d5 | d6
 */
export const Device = z.string().regex(/^d([0-6])$/) //https://regex101.com/r/0x46i6/1
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
 * Register | Device
 */
export const RegisterOrDevice = Register.or(Device)

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
