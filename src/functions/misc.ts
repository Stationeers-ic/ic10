import { icFunction } from "../functions"
import { z } from "zod"
import { dev, reg } from "../regexps"
import { Alias, Ralias, RegisterOrDevice, RaliasOrValue, RaliasOrValueOrNaN, AliasOrValue } from "../ZodTypes"

export const misc: Record<string, icFunction> = {
	alias: (env, data) => {
		const [alias, dr] = z.tuple([Alias, RegisterOrDevice]).parse(data)
		env.alias(alias, dr)
	},
	define: (env, data) => {
		const d = z.tuple([Alias, AliasOrValue]).parse(data)
		env.alias(d[0], env.get(d[1]))
	},
	move: (env, data) => {
		const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
		env.set(d[0], env.get(d[1]))
	},
	// TODO: ?
	yield: (env, data) => {},
	sleep: async (env, data) => {
		const [time] = z.tuple([RaliasOrValueOrNaN]).parse(data)
		return new Promise<void>((resolve) => {
			setTimeout(
				() => {
					resolve()
				},
				env.get(time) * 1000,
			)
		})
	},
	hcf: (env, data) => {
		env.hcf()
	},
}
