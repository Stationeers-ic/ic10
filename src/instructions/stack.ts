import { type icPartialInstruction, tupleR, tupleRV } from "./types"
import type { StackInstructionName } from "../ZodTypes"

const push: icPartialInstruction = async (env, data) => {
	const d = push.validate.parse(data)
	await env.push(d[0])
}
push.validate = tupleRV
const pop: icPartialInstruction = async (env, data) => {
	const d = pop.validate.parse(data)
	await env.set(d[0], await env.pop())
}
pop.validate = tupleR
const peek: icPartialInstruction = async (env, data) => {
	const d = peek.validate.parse(data)
	await env.set(d[0], await env.peek())
}
peek.validate = tupleR

export const stack: Record<StackInstructionName, icPartialInstruction> = {
	push,
	pop,
	peek,
}
export default stack
