import type { icPartialFunction, icFunction } from "./types"
export type { icFunction } from "./types"
import arithmetic from "./arithmetic"
import jump from "./jump"
import select from "./select"
import misc from "./misc"
import device from "./device"
import stack from "./stack"
import { AnyFunctionName } from "../ZodTypes"
import allFunctions from "../data/functions"

const functionsPartial: Record<AnyFunctionName, icPartialFunction> = {
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
	functionsPartial[n].description = description
	functionsPartial[n].example = preview
	functionsPartial[n].deprecated = deprecated || false
})

//						validated in types									validated in types
export const functions: Record<AnyFunctionName, icFunction> = functionsPartial as Record<AnyFunctionName, icFunction>
export default functions
