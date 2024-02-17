import { arithmetic } from "./functions/arithmetic"
import { Environment } from "./abstract/Environment"
import { misc } from "./functions/misc"
import { jump } from "./functions/jump"
import { select } from "./functions/select"
import { device } from "./functions/device"
import { stack } from "./functions/stack"

export type icFunction = (
	env: Environment,
	data: (string | number)[],
) => void | Promise<void> | Error[] | Promise<Error[]>
export type icCondition = (env: Environment, data: (string | number)[]) => boolean

export const functions: { [key: string]: icFunction } = {
	...arithmetic,
	...misc,
	...jump,
	...select,
	...device,
	...stack,
}

