import { icFunction } from '../functions';
import { z } from "zod"
import { Ralias, RaliasOrValue, StackFunctionName } from "../ZodTypes"


const push: icFunction = (env, data) => {
	const d = z.tuple([RaliasOrValue]).parse(data)
	env.push(d[0])
}
const pop: icFunction = (env, data) => {
	const d = z.tuple([Ralias]).parse(data)
	env.set(d[0], env.pop())
}
const peek: icFunction = (env, data) => {
	const d = z.tuple([Ralias]).parse(data)
	env.set(d[0], env.peek())
}

export const stack: Record<StackFunctionName, icFunction> = {
	push,
	pop,
	peek,
}
export default stack
