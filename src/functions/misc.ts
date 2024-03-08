import { icFunction } from "../functions"
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

const alias: icFunction = async (env, data) => {
	const [alias, dr] = z.tuple([Alias, RegisterOrDevice]).parse(data)
	await env.alias(alias, dr)
}
const define: icFunction = async (env, data) => {
	const d = z.tuple([Alias, AliasOrValue]).parse(data)
	await env.alias(d[0], await env.get(d[1]))
}
const move: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], await env.get(d[1]))
}
const yield_: icFunction = async (env, data) => {}
const sleep: icFunction = async (env, data) => {
	const [time] = z.tuple([RaliasOrValueOrNaN]).parse(data)
	return new Promise<void>(async (resolve) => {
		setTimeout(
			() => {
				resolve()
			},
			(await env.get(time)) * 1000,
		)
	})
}
const hcf: icFunction = async (env, data) => {
	await env.hcf()
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
