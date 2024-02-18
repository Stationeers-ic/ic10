import { z } from "zod";
export declare const StringOrNumberOrNaN: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNaN]>;
export declare const StringOrNumber: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const NumberOrNan: z.ZodUnion<[z.ZodNumber, z.ZodNaN]>;
export declare const Value: z.ZodNumber;
export declare const Alias: z.ZodString;
/**
 * r0 - r17
 */
export declare const Register: z.ZodString;
/**
 * d0 - d6
 */
export declare const Device: z.ZodString;
/**
 * Register | Alias
 */
export declare const Ralias: z.ZodUnion<[z.ZodString, z.ZodString]>;
/**
 * Register | Alias
 *
 * alias for "Ralias"
 */
export declare const RegisterOrAlias: z.ZodUnion<[z.ZodString, z.ZodString]>;
/**
 * Device | Alias
 */
export declare const DeviceOrAlias: z.ZodUnion<[z.ZodString, z.ZodString]>;
/**
 * Alias | numeric value
 */
export declare const AliasOrValue: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
/**
 * Alias | Register | numeric value
 */
export declare const RaliasOrValue: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const RegisterOrDevice: z.ZodUnion<[z.ZodString, z.ZodString]>;
export declare const RaliasOrValuePositive: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const SlotIndex: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const LineIndex: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const RelativeLineIndex: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
export declare const Hash: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
/**
 * Alias | NaN | numeric value
 */
export declare const AliasOrValueOrNaN: z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodNumber]>, z.ZodNaN]>;
/**
 * Alias | Register | NaN | numeric value
 */
export declare const RaliasOrValueOrNaN: z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodNumber]>, z.ZodNaN]>;
export declare const Logic: z.ZodString;
export declare const NotReservedWord: z.ZodEffects<z.ZodString, string, string>;
export declare const JumpFunctionName: z.ZodUnion<[z.ZodLiteral<"j">, z.ZodLiteral<"jr">, z.ZodLiteral<"jal">, z.ZodLiteral<"beq">, z.ZodLiteral<"beqz">, z.ZodLiteral<"bge">, z.ZodLiteral<"bgez">, z.ZodLiteral<"bgt">, z.ZodLiteral<"bgtz">, z.ZodLiteral<"ble">, z.ZodLiteral<"blez">, z.ZodLiteral<"blt">, z.ZodLiteral<"bltz">, z.ZodLiteral<"bne">, z.ZodLiteral<"bnez">, z.ZodLiteral<"bap">, z.ZodLiteral<"bapz">, z.ZodLiteral<"bna">, z.ZodLiteral<"bnaz">, z.ZodLiteral<"bdse">, z.ZodLiteral<"bdns">, z.ZodLiteral<"bnan">, z.ZodLiteral<"breq">, z.ZodLiteral<"breqz">, z.ZodLiteral<"brge">, z.ZodLiteral<"brgez">, z.ZodLiteral<"brgt">, z.ZodLiteral<"brgtz">, z.ZodLiteral<"brle">, z.ZodLiteral<"brlez">, z.ZodLiteral<"brlt">, z.ZodLiteral<"brltz">, z.ZodLiteral<"brne">, z.ZodLiteral<"brnez">, z.ZodLiteral<"brap">, z.ZodLiteral<"brapz">, z.ZodLiteral<"brna">, z.ZodLiteral<"brnaz">, z.ZodLiteral<"brdse">, z.ZodLiteral<"brdns">, z.ZodLiteral<"brnan">, z.ZodLiteral<"beqal">, z.ZodLiteral<"beqzal">, z.ZodLiteral<"bgeal">, z.ZodLiteral<"bgezal">, z.ZodLiteral<"bgtal">, z.ZodLiteral<"bgtzal">, z.ZodLiteral<"bleal">, z.ZodLiteral<"blezal">, z.ZodLiteral<"bltal">, z.ZodLiteral<"bltzal">, z.ZodLiteral<"bneal">, z.ZodLiteral<"bnezal">, z.ZodLiteral<"bapal">, z.ZodLiteral<"bapzal">, z.ZodLiteral<"bnaal">, z.ZodLiteral<"bnazal">, z.ZodLiteral<"bdseal">, z.ZodLiteral<"bdnsal">]>;
export type JumpFunctionName = z.infer<typeof JumpFunctionName>;
