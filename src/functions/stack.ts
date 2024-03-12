import type { icPartialFunction } from "./types"
import type { StackFunctionName } from "../ZodTypes"
import { z } from "zod"
import { Ralias, RaliasOrValue } from "../ZodTypes"

const push: icPartialFunction = async (env, data) => {
	const d = push.validate.parse(data)
	await env.push(d[0])
}
push.validate = z.tuple([RaliasOrValue])
const pop: icPartialFunction = async (env, data) => {
	const d = pop.validate.parse(data)
	await env.set(d[0], await env.pop())
}
pop.validate = z.tuple([Ralias])
const peek: icPartialFunction = async (env, data) => {
	const d = peek.validate.parse(data)
	await env.set(d[0], await env.peek())
}
peek.validate = z.tuple([Ralias])

export const stack: Record<StackFunctionName, icPartialFunction> = {
	push,
	pop,
	peek,
}
export default stack
