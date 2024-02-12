import {arithmetic} from "./functions/arithmetic.js";
import {Environment} from "./abstract/Environment.js";
import {misc} from "./functions/misc.js";
import {jump} from "./functions/jump.js";

export type icFunction =(env: Environment, data: (string | number)[]) => void|Promise<void>
export type icCondition = (env: Environment, data: (string | number)[]) => boolean

export const functions: { [key: string]: icFunction } = {
    ...arithmetic,
    ...misc,
    ...jump,
}