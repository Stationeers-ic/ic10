import { icPartialFunction } from "../functions"
import { z } from "zod"
import {
	Alias,
	AliasOrValue,
	MiscFunctionName,
	Ralias,
	RaliasOrValue,
	RaliasOrValueOrNaN,
	RegisterOrDevice,
} from "../ZodTypes"

const alias: icPartialFunction = async (env, data) => {
	const [a, dr] = alias.validate.parse(data)
	await env.alias(a, dr)
}
alias.validate = z.tuple([Alias, RegisterOrDevice])
const define: icPartialFunction = async (env, data) => {
	const d = define.validate.parse(data)
	await env.alias(d[0], await env.get(d[1]))
}
define.validate = z.tuple([Alias, AliasOrValue])
const move: icPartialFunction = async (env, data) => {
	const d = move.validate.parse(data)
	await env.set(d[0], await env.get(d[1]))
}
move.validate = z.tuple([Ralias, RaliasOrValue])
const yield_: icPartialFunction = async (env, data) => {}
yield_.validate = z.tuple([])
const sleep: icPartialFunction = async (env, data) => {
	const [time] = sleep.validate.parse(data)
	return new Promise<void>(async (resolve) => {
		setTimeout(
			() => {
				resolve()
			},
			(await env.get(time)) * 1000,
		)
	})
}
sleep.validate = z.tuple([RaliasOrValueOrNaN])
const hcf: icPartialFunction = async (env, data) => {
	await env.hcf()
}
hcf.validate = z.tuple([])

export const misc: Record<MiscFunctionName, icPartialFunction> = {
	alias,
	define,
	move,
	yield: yield_,
	sleep,
	hcf,
}
export default misc
