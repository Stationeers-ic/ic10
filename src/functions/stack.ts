import { icFunction } from "../functions"
import { z } from "zod"
import { dev, reg } from "../regexps"
import { Alias, Ralias, RaliasOrValue, RaliasOrValueOrNaN, AliasOrValue } from "../ZodTypes"
import { RegisterOrDevice } from "../RegisterOrDevice"

export const stack: Record<string, icFunction> = {
	push: (env, data) => {
		const d = z.tuple([RaliasOrValue]).parse(data)
		env.push(d[0])
	},
	pop: (env, data) => {
		const d = z.tuple([Ralias]).parse(data)
		env.set(d[0], env.pop())
	},
	peek: (env, data) => {
		const d = z.tuple([Ralias]).parse(data)
		env.set(d[0], env.peek())
	},
}
