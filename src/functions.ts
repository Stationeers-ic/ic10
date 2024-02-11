import {icFunction} from "./types";
import {arithmetic} from "./functions/arithmetic";

export const functions: { [key: string]: icFunction } = {
    ...arithmetic,
}