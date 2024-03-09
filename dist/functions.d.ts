import Environment from "./abstract/Environment";
import { AnyFunctionName } from "./ZodTypes";
export type FunctionData = (string | number)[];
export type icFunction = (env: Environment, data: FunctionData) => Promise<void>;
export type icCondition = (env: Environment, data: FunctionData) => Promise<boolean>;
export declare const functions: Record<AnyFunctionName, icFunction>;
export default functions;
