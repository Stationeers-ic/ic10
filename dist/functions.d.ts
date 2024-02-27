import Environment from "./abstract/Environment";
import { AnyFunctionName } from "./ZodTypes";
export type FunctionData = (string | number)[];
export type icFunction = (env: Environment, data: FunctionData) => void | Promise<void> | Error[] | Promise<Error[]>;
export type icCondition = (env: Environment, data: FunctionData) => boolean;
export declare const functions: Record<AnyFunctionName, icFunction>;
export default functions;
