import { icFunction } from "../functions"
import { z } from "zod"
import { Alias, AliasOrValue, MiscFunctionName, Ralias, RaliasOrValue, RaliasOrValueOrNaN, RegisterOrDevice } from "../ZodTypes"

const alias: icFunction = (env, data) => {
	const [alias, dr] = z.tuple([Alias, RegisterOrDevice]).parse(data)
	env.alias(alias, dr)
}
const define: icFunction = (env, data) => {
	const d = z.tuple([Alias, AliasOrValue]).parse(data)
	env.alias(d[0], env.get(d[1]))
}
const move: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], env.get(d[1]))
}
// TODO: ?
const yield_: icFunction = (env, data) => {}
const sleep: icFunction = async (env, data) => {
	const [time] = z.tuple([RaliasOrValueOrNaN]).parse(data)
	return new Promise<void>((resolve) => {
		setTimeout(
			() => {
				resolve()
			},
			env.get(time) * 1000,
		)
	})
}
const hcf: icFunction = (env, data) => {
	env.hcf()
}

export const misc: Record<MiscFunctionName, icFunction> = {
	alias,
	define,
	move,
	yield: yield_,
	sleep,
	hcf,
}
export default misc
