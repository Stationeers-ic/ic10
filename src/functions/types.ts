import { z } from "zod"
import {
	Alias,
	AliasOrValue,
	DeviceOrAlias,
	LineIndex,
	Ralias,
	RaliasOrValue,
	RegisterOrDevice,
	RelativeLineIndex,
} from "../ZodTypes"
import type Environment from "../abstract/Environment"

export type FunctionData = (string | number)[]

export const tupleA_RD = z.tuple([Alias, RegisterOrDevice])
export const tupleR = z.tuple([Ralias])
export const tupleRV = z.tuple([RaliasOrValue])
export const tupleA_AV = z.tuple([Alias, AliasOrValue])
export const tupleR_DA = z.tuple([Ralias, DeviceOrAlias])
export const tupleR_R = z.tuple([Ralias, Ralias])
export const tupleR_RV = z.tuple([Ralias, RaliasOrValue])
export const tupleR_RV_RV = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
export const tupleR_RV_RV_RV = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue])
export const tupleLI = z.tuple([LineIndex])
export const tupleRLI = z.tuple([RelativeLineIndex])
export const tupleR_LI = z.tuple([Ralias, LineIndex])
export const tupleR_RLI = z.tuple([Ralias, RelativeLineIndex])
export const tupleRV_LI = z.tuple([RaliasOrValue, LineIndex])
export const tupleRV_RLI = z.tuple([RaliasOrValue, RelativeLineIndex])
export const tupleDA_LI = z.tuple([DeviceOrAlias, LineIndex])
export const tupleDA_RLI = z.tuple([DeviceOrAlias, RelativeLineIndex])
export const tupleRV_RV_LI = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex])
export const tupleRV_RV_RV_LI = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, LineIndex])
export const tupleRV_RV_RLI = z.tuple([RaliasOrValue, RaliasOrValue, RelativeLineIndex])
export const tupleRV_RV_RV_RLI = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, RelativeLineIndex])
export const tupleEmpty = z.tuple([])

export type icPartialFunction = {
	(env: Environment, data: FunctionData): Promise<void>
	validate: z.ZodTuple | z.ZodTuple<[]>
	description?: string
	example?: string
	deprecated?: boolean
}
export type icFunction = {
	(env: Environment, data: FunctionData): Promise<void>
	validate: z.ZodTuple | z.ZodTuple<[]>
	description: string
	example: string
	deprecated: boolean
}

export type icCondition = (env: Environment, data: FunctionData) => Promise<boolean>
