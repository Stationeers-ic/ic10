import {arithmetic} from "./functions/arithmetic.js";
import {Environment} from "./abstract/Environment";
export type icFunction =(env: Environment, data: (string | number)[]) => void|Promise<void>

export const functions: { [key: string]: icFunction } = {
    ...arithmetic,
}