import {arrToObj, reverseMapping} from "../types";
import {hashStr} from "../Utils";
import {isRM, TypeRM} from "../icTypes";

export const reagents = [
    "Astroloy",
    "Hastelloy",
    "Inconel",
    "Stellite",
    "Waspaloy",
    "Constantan",
    "Electrum",
    "Invar",
    "Solder",
    "Steel",
    "Copper",
    "Gold",
    "Iron",
    "Lead",
    "Nickel",
    "Silicon",
    "Silver",
    "Hydrocarbon"
] as const

export const reagentMapping = arrToObj(reagents, n => [n, hashStr(n)])
export const reverseReagentMapping = reverseMapping(reagentMapping)

export type Reagent = (typeof reagents)[number]

export const isReagent = (v: string): v is Reagent => reagents.includes(v as Reagent)

export const getReagent = (v: string | number): Reagent | undefined => {
    if (typeof v  === "string") {
        if (isReagent(v))
            return v
        return undefined
    }

    return reverseReagentMapping[v]
}

export const reagentModeMapping = {
    Contents: 0,
    Required: 1,
    Recipe: 2
} as const satisfies Record<TypeRM, number>

export const reverseReagentModeMapping = reverseMapping<keyof typeof reagentModeMapping, number>(reagentModeMapping)

export const getReagentMode = (v: string | number): TypeRM | undefined => {
    if (typeof v === "string") {
        if (isRM(v))
            return v
        return undefined
    }
    return reverseReagentModeMapping[v]
}