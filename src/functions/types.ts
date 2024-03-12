import { z } from "zod"
import { DeviceOrAlias, Ralias, RaliasOrValue } from "../ZodTypes"
import type Environment from "../abstract/Environment"

export type FunctionData = (string | number)[]

export const tupleR_DA = z.tuple([Ralias, DeviceOrAlias])
export const tupleR_R = z.tuple([Ralias, Ralias])
export const tupleR_RV = z.tuple([Ralias, RaliasOrValue])
export const tupleR_RV_RV = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
export const tupleR_RV_RV_RV = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue])

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
