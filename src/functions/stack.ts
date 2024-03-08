import { icFunction } from "../functions"
import { z } from "zod"
import { Ralias, RaliasOrValue, StackFunctionName } from "../ZodTypes"

const push: icFunction = async (env, data) => {
	const d = z.tuple([RaliasOrValue]).parse(data)
	await env.push(d[0])
}
const pop: icFunction = async (env, data) => {
	const d = z.tuple([Ralias]).parse(data)
	await env.set(d[0], await env.pop())
}
const peek: icFunction = async (env, data) => {
	const d = z.tuple([Ralias]).parse(data)
	await env.set(d[0], await env.peek())
}

export const stack: Record<StackFunctionName, icFunction> = {
	push,
	pop,
	peek,
}
export default stack
