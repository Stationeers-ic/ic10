import { z } from "zod"

export const StringOrNumberOrNaN = z.union([z.string(), z.number(), z.nan()])
export const StringOrNumber = z.union([z.string(), z.number()])
export const NumberOrNan = z.number().or(z.nan())
export const Register = z.string().regex(/^r([0-9]|1[0-7])$/) //https://regex101.com/r/UiCGWX/1
export const Device = z.string().regex(/^d([0-6])$/) //https://regex101.com/r/0x46i6/1
export const RegisterOrAlias = z.string()
// export const Result = RegisterOrAlias
export const DeviceOrAlias = z.string()
export const RegisterOrDevice = Register.or(Device)
/*
export const RegisterOrAlias = Register.or(z.string())
export const DeviceOrAlias = Device.or(z.string())
 */
/*
 *TODO: Add list reserved words
 */
export const NotReservedWord = z.string()
