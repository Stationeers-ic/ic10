import { z } from "zod";
export declare const StringOrNumberOrNaN: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNaN]>;
export declare const StringOrNumber: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const NumberOrNan: z.ZodUnion<[z.ZodNumber, z.ZodNaN]>;
/**
 * r0 - r17, sp
 */
export declare const Register: z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>;
/**
 * d0 - d5, db
 */
export declare const Device: z.ZodUnion<[z.ZodLiteral<"db">, z.ZodString]>;
export declare const RegisterOrDevice: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodUnion<[z.ZodLiteral<"db">, z.ZodString]>]>;
export declare const Value: z.ZodNumber;
export declare const Alias: z.ZodEffects<z.ZodString, string, string>;
/**
 * Register | Alias
 */
export declare const Ralias: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>;
/**
 * Register | Alias
 *
 * alias for "Ralias"
 */
export declare const RegisterOrAlias: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>;
/**
 * Device | Alias
 */
export declare const DeviceOrAlias: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"db">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>;
/**
 * Alias | numeric value
 */
export declare const AliasOrValue: z.ZodUnion<[z.ZodEffects<z.ZodString, string, string>, z.ZodNumber]>;
/**
 * Alias | Register | numeric value
 */
export declare const RaliasOrValue: z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>, z.ZodNumber]>;
export declare const RaliasOrValuePositive: z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>, z.ZodNumber]>;
export declare const SlotIndex: z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>, z.ZodNumber]>;
export declare const LineIndex: z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>, z.ZodNumber]>;
export declare const RelativeLineIndex: z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>, z.ZodNumber]>;
export declare const Hash: z.ZodUnion<[z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"sp">, z.ZodString]>, z.ZodEffects<z.ZodString, string, string>]>, z.ZodNumber]>;
/**
 * Alias | NaN | numeric value
 */
export declare const AliasOrValueOrNaN: z.ZodUnion<[z.ZodUnion<[z.ZodEffects<z.ZodString, string, string>, z.ZodNumber]>, z.ZodNaN]>;
/**
 * Alias | Register | NaN | numeric value
 */
export declare const RaliasOrValueOrNaN: z.ZodUnion<[z.ZodUnion<[z.ZodEffects<z.ZodString, string, string>, z.ZodNumber]>, z.ZodNaN]>;
export declare const Logic: z.ZodString;
export declare const NotReservedWord: z.ZodEffects<z.ZodString, string, string>;
export declare const ConditionName: z.ZodUnion<[z.ZodLiteral<"eq">, z.ZodLiteral<"ge">, z.ZodLiteral<"gt">, z.ZodLiteral<"le">, z.ZodLiteral<"lt">, z.ZodLiteral<"ne">, z.ZodLiteral<"na">, z.ZodLiteral<"ap">, z.ZodLiteral<"dse">, z.ZodLiteral<"dns">, z.ZodLiteral<"nan">, z.ZodLiteral<"nanz">]>;
export type ConditionName = z.infer<typeof ConditionName>;
export declare const ArithmeticFunctionName: z.ZodUnion<[z.ZodLiteral<"add">, z.ZodLiteral<"sub">, z.ZodLiteral<"mul">, z.ZodLiteral<"div">, z.ZodLiteral<"mod">, z.ZodLiteral<"sqrt">, z.ZodLiteral<"round">, z.ZodLiteral<"trunc">, z.ZodLiteral<"ceil">, z.ZodLiteral<"floor">, z.ZodLiteral<"max">, z.ZodLiteral<"min">, z.ZodLiteral<"abs">, z.ZodLiteral<"log">, z.ZodLiteral<"exp">, z.ZodLiteral<"rand">, z.ZodLiteral<"sll">, z.ZodLiteral<"srl">, z.ZodLiteral<"sla">, z.ZodLiteral<"sra">, z.ZodLiteral<"sin">, z.ZodLiteral<"cos">, z.ZodLiteral<"tan">, z.ZodLiteral<"asin">, z.ZodLiteral<"acos">, z.ZodLiteral<"atan">, z.ZodLiteral<"atan2">, z.ZodLiteral<"and">, z.ZodLiteral<"or">, z.ZodLiteral<"xor">, z.ZodLiteral<"nor">]>;
export type ArithmeticFunctionName = z.infer<typeof ArithmeticFunctionName>;
export declare const SelectFunctionName: z.ZodUnion<[z.ZodLiteral<"seq">, z.ZodLiteral<"sge">, z.ZodLiteral<"sgt">, z.ZodLiteral<"sle">, z.ZodLiteral<"slt">, z.ZodLiteral<"sne">, z.ZodLiteral<"sap">, z.ZodLiteral<"sna">, z.ZodLiteral<"seqz">, z.ZodLiteral<"sgez">, z.ZodLiteral<"sgtz">, z.ZodLiteral<"slez">, z.ZodLiteral<"sltz">, z.ZodLiteral<"snez">, z.ZodLiteral<"sapz">, z.ZodLiteral<"snaz">, z.ZodLiteral<"sdse">, z.ZodLiteral<"sdns">, z.ZodLiteral<"snan">, z.ZodLiteral<"snanz">, z.ZodLiteral<"select">]>;
export type SelectFunctionName = z.infer<typeof SelectFunctionName>;
export declare const JumpFunctionName: z.ZodUnion<[z.ZodLiteral<"j">, z.ZodLiteral<"jr">, z.ZodLiteral<"jal">, z.ZodLiteral<"beq">, z.ZodLiteral<"beqz">, z.ZodLiteral<"bge">, z.ZodLiteral<"bgez">, z.ZodLiteral<"bgt">, z.ZodLiteral<"bgtz">, z.ZodLiteral<"ble">, z.ZodLiteral<"blez">, z.ZodLiteral<"blt">, z.ZodLiteral<"bltz">, z.ZodLiteral<"bne">, z.ZodLiteral<"bnez">, z.ZodLiteral<"bap">, z.ZodLiteral<"bapz">, z.ZodLiteral<"bna">, z.ZodLiteral<"bnaz">, z.ZodLiteral<"bdse">, z.ZodLiteral<"bdns">, z.ZodLiteral<"bnan">, z.ZodLiteral<"breq">, z.ZodLiteral<"breqz">, z.ZodLiteral<"brge">, z.ZodLiteral<"brgez">, z.ZodLiteral<"brgt">, z.ZodLiteral<"brgtz">, z.ZodLiteral<"brle">, z.ZodLiteral<"brlez">, z.ZodLiteral<"brlt">, z.ZodLiteral<"brltz">, z.ZodLiteral<"brne">, z.ZodLiteral<"brnez">, z.ZodLiteral<"brap">, z.ZodLiteral<"brapz">, z.ZodLiteral<"brna">, z.ZodLiteral<"brnaz">, z.ZodLiteral<"brdse">, z.ZodLiteral<"brdns">, z.ZodLiteral<"brnan">, z.ZodLiteral<"beqal">, z.ZodLiteral<"beqzal">, z.ZodLiteral<"bgeal">, z.ZodLiteral<"bgezal">, z.ZodLiteral<"bgtal">, z.ZodLiteral<"bgtzal">, z.ZodLiteral<"bleal">, z.ZodLiteral<"blezal">, z.ZodLiteral<"bltal">, z.ZodLiteral<"bltzal">, z.ZodLiteral<"bneal">, z.ZodLiteral<"bnezal">, z.ZodLiteral<"bapal">, z.ZodLiteral<"bapzal">, z.ZodLiteral<"bnaal">, z.ZodLiteral<"bnazal">, z.ZodLiteral<"bdseal">, z.ZodLiteral<"bdnsal">]>;
export type JumpFunctionName = z.infer<typeof JumpFunctionName>;
export declare const DeviceFunctionName: z.ZodUnion<[z.ZodLiteral<"s">, z.ZodLiteral<"l">, z.ZodLiteral<"ls">, z.ZodLiteral<"sb">, z.ZodLiteral<"lb">, z.ZodLiteral<"lbn">, z.ZodLiteral<"lr">, z.ZodLiteral<"sbn">, z.ZodLiteral<"lbs">, z.ZodLiteral<"lbns">, z.ZodLiteral<"ss">, z.ZodLiteral<"sbs">]>;
export type DeviceFunctionName = z.infer<typeof DeviceFunctionName>;
export declare const MiscFunctionName: z.ZodUnion<[z.ZodLiteral<"alias">, z.ZodLiteral<"define">, z.ZodLiteral<"move">, z.ZodLiteral<"yield">, z.ZodLiteral<"sleep">, z.ZodLiteral<"hcf">]>;
export type MiscFunctionName = z.infer<typeof MiscFunctionName>;
export declare const StackFunctionName: z.ZodUnion<[z.ZodLiteral<"push">, z.ZodLiteral<"pop">, z.ZodLiteral<"peek">]>;
export type StackFunctionName = z.infer<typeof StackFunctionName>;
export declare const AnyFunctionName: z.ZodUnion<[z.ZodUnion<[z.ZodLiteral<"add">, z.ZodLiteral<"sub">, z.ZodLiteral<"mul">, z.ZodLiteral<"div">, z.ZodLiteral<"mod">, z.ZodLiteral<"sqrt">, z.ZodLiteral<"round">, z.ZodLiteral<"trunc">, z.ZodLiteral<"ceil">, z.ZodLiteral<"floor">, z.ZodLiteral<"max">, z.ZodLiteral<"min">, z.ZodLiteral<"abs">, z.ZodLiteral<"log">, z.ZodLiteral<"exp">, z.ZodLiteral<"rand">, z.ZodLiteral<"sll">, z.ZodLiteral<"srl">, z.ZodLiteral<"sla">, z.ZodLiteral<"sra">, z.ZodLiteral<"sin">, z.ZodLiteral<"cos">, z.ZodLiteral<"tan">, z.ZodLiteral<"asin">, z.ZodLiteral<"acos">, z.ZodLiteral<"atan">, z.ZodLiteral<"atan2">, z.ZodLiteral<"and">, z.ZodLiteral<"or">, z.ZodLiteral<"xor">, z.ZodLiteral<"nor">]>, z.ZodUnion<[z.ZodLiteral<"seq">, z.ZodLiteral<"sge">, z.ZodLiteral<"sgt">, z.ZodLiteral<"sle">, z.ZodLiteral<"slt">, z.ZodLiteral<"sne">, z.ZodLiteral<"sap">, z.ZodLiteral<"sna">, z.ZodLiteral<"seqz">, z.ZodLiteral<"sgez">, z.ZodLiteral<"sgtz">, z.ZodLiteral<"slez">, z.ZodLiteral<"sltz">, z.ZodLiteral<"snez">, z.ZodLiteral<"sapz">, z.ZodLiteral<"snaz">, z.ZodLiteral<"sdse">, z.ZodLiteral<"sdns">, z.ZodLiteral<"snan">, z.ZodLiteral<"snanz">, z.ZodLiteral<"select">]>, z.ZodUnion<[z.ZodLiteral<"j">, z.ZodLiteral<"jr">, z.ZodLiteral<"jal">, z.ZodLiteral<"beq">, z.ZodLiteral<"beqz">, z.ZodLiteral<"bge">, z.ZodLiteral<"bgez">, z.ZodLiteral<"bgt">, z.ZodLiteral<"bgtz">, z.ZodLiteral<"ble">, z.ZodLiteral<"blez">, z.ZodLiteral<"blt">, z.ZodLiteral<"bltz">, z.ZodLiteral<"bne">, z.ZodLiteral<"bnez">, z.ZodLiteral<"bap">, z.ZodLiteral<"bapz">, z.ZodLiteral<"bna">, z.ZodLiteral<"bnaz">, z.ZodLiteral<"bdse">, z.ZodLiteral<"bdns">, z.ZodLiteral<"bnan">, z.ZodLiteral<"breq">, z.ZodLiteral<"breqz">, z.ZodLiteral<"brge">, z.ZodLiteral<"brgez">, z.ZodLiteral<"brgt">, z.ZodLiteral<"brgtz">, z.ZodLiteral<"brle">, z.ZodLiteral<"brlez">, z.ZodLiteral<"brlt">, z.ZodLiteral<"brltz">, z.ZodLiteral<"brne">, z.ZodLiteral<"brnez">, z.ZodLiteral<"brap">, z.ZodLiteral<"brapz">, z.ZodLiteral<"brna">, z.ZodLiteral<"brnaz">, z.ZodLiteral<"brdse">, z.ZodLiteral<"brdns">, z.ZodLiteral<"brnan">, z.ZodLiteral<"beqal">, z.ZodLiteral<"beqzal">, z.ZodLiteral<"bgeal">, z.ZodLiteral<"bgezal">, z.ZodLiteral<"bgtal">, z.ZodLiteral<"bgtzal">, z.ZodLiteral<"bleal">, z.ZodLiteral<"blezal">, z.ZodLiteral<"bltal">, z.ZodLiteral<"bltzal">, z.ZodLiteral<"bneal">, z.ZodLiteral<"bnezal">, z.ZodLiteral<"bapal">, z.ZodLiteral<"bapzal">, z.ZodLiteral<"bnaal">, z.ZodLiteral<"bnazal">, z.ZodLiteral<"bdseal">, z.ZodLiteral<"bdnsal">]>, z.ZodUnion<[z.ZodLiteral<"s">, z.ZodLiteral<"l">, z.ZodLiteral<"ls">, z.ZodLiteral<"sb">, z.ZodLiteral<"lb">, z.ZodLiteral<"lbn">, z.ZodLiteral<"lr">, z.ZodLiteral<"sbn">, z.ZodLiteral<"lbs">, z.ZodLiteral<"lbns">, z.ZodLiteral<"ss">, z.ZodLiteral<"sbs">]>, z.ZodUnion<[z.ZodLiteral<"alias">, z.ZodLiteral<"define">, z.ZodLiteral<"move">, z.ZodLiteral<"yield">, z.ZodLiteral<"sleep">, z.ZodLiteral<"hcf">]>, z.ZodUnion<[z.ZodLiteral<"push">, z.ZodLiteral<"pop">, z.ZodLiteral<"peek">]>]>;
export type AnyFunctionName = z.infer<typeof AnyFunctionName>;
export declare function isKeyOfObject<T extends object>(key: string | number | symbol, obj: T): key is keyof T;
export declare function isKeyOfArray<T extends Array<any>>(key: string | number | symbol, arr: T): key is keyof T;
