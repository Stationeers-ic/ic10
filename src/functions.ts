import arithmetic from "./functions/arithmetic"
import jump from "./functions/jump"
import select from "./functions/select"
import Environment from "./abstract/Environment"
import misc from "./functions/misc"
import device from "./functions/device"
import stack from "./functions/stack"
import { AnyFunctionName } from "./ZodTypes"
import { z } from "zod"
import allFunctions from "./data/functions"

export type FunctionData = (string | number)[]

export type icFunction = {
	(env: Environment, data: FunctionData): Promise<void>
	validate: z.ZodType
	description?: string
	example?: string
	deprecated?: boolean
}
export type icCondition = (env: Environment, data: FunctionData) => Promise<boolean>

export const functions: Record<AnyFunctionName, icFunction> = {
	...arithmetic,
	...misc,
	...jump,
	...select,
	...device,
	...stack,
}

allFunctions.forEach(({ name, preview, description, deprecated }) => {
	const data = AnyFunctionName.safeParse(name)
	if (!data.success) return console.error(`${name} is not implemented`)
	const n = data.data
	functions[n].description = description
	functions[n].example = preview
	functions[n].deprecated = deprecated || false
})
export default functions
