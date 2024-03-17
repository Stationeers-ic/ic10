import type { ArithmeticInstructionName } from "../ZodTypes";
import { type icPartialInstruction } from "./types";
export declare function jsThing(value: number): number;
export declare const arithmetic: Record<ArithmeticInstructionName, icPartialInstruction>;
export default arithmetic;
