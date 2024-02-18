import { Environment } from "./abstract/Environment";
export type icFunction = (env: Environment, data: (string | number)[]) => void | Promise<void> | Error[] | Promise<Error[]>;
export type icCondition = (env: Environment, data: (string | number)[]) => boolean;
export declare const functions: {
    [key: string]: icFunction;
};
export default functions;
