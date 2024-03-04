import arithmetic from "./functions/arithmetic"
import jump from "./functions/jump"
import select from "./functions/select"
import Environment from "./abstract/Environment"
import misc from "./functions/misc"
import device from "./functions/device"
import stack from "./functions/stack"
import { AnyFunctionName } from "./ZodTypes"

export type FunctionData = (string | number)[]

export type icFunction = (env: Environment, data: FunctionData) => void | Promise<void> | Error[] | Promise<Error[]>
export type icCondition = (env: Environment, data: FunctionData) => boolean

export const functions: Record<AnyFunctionName, icFunction> = {
	...arithmetic,
	...misc,
	...jump,
	...select,
	...device,
	...stack,
}

export default functions
