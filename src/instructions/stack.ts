import type { StackInstructionName } from "../ZodTypes"
import { type icPartialInstruction, tupleR, tupleRV } from "./types"

const push: icPartialInstruction = async (env, data) => {
	const d = push.validate.parse(data)
	await env.stackPush(d[0])
}
push.validate = tupleRV
const pop: icPartialInstruction = async (env, data) => {
	const d = pop.validate.parse(data)
	await env.set(d[0], await env.stackPop())
}
pop.validate = tupleR
const peek: icPartialInstruction = async (env, data) => {
	const d = peek.validate.parse(data)
	await env.set(d[0], await env.stackPeek())
}
peek.validate = tupleR

export const stack: Record<StackInstructionName, icPartialInstruction> = {
	push,
	pop,
	peek,
}
export default stack
