import {icFunction} from "./types.js";
import {arithmetic} from "./functions/arithmetic.js";

export const functions: { [key: string]: icFunction } = {
    ...arithmetic,
}