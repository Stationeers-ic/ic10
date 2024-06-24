import { type icPartialInstruction, tupleA_AV, tupleA_RD, tupleEmpty, tupleR_RV } from "./types"
import { z } from "zod"
import { Alias, type MiscInstructionName, RaliasOrValueOrNaN, RegisterOrDevice } from "../ZodTypes"

const alias: icPartialInstruction = async (env, data) => {
	const [a, dr] = alias.validate.parse(data)
	await env.alias(a, dr)
}
alias.validate = tupleA_RD
const label: icPartialInstruction = async (env, data) => {
	const [dr, a] = label.validate.parse(data)
	await env.alias(a, dr)
}
label.validate = z.tuple([RegisterOrDevice, Alias])
const define: icPartialInstruction = async (env, data) => {
	const d = define.validate.parse(data)
	await env.define(d[0], await env.get(d[1]))
}
define.validate = tupleA_AV
const move: icPartialInstruction = async (env, data) => {
	const [target, value] = move.validate.parse(data)
	await env.set(target, await env.get(value))
}
move.validate = tupleR_RV
const yield_: icPartialInstruction = async (env, data) => {}
yield_.validate = tupleEmpty
const sleep: icPartialInstruction = async (env, data) => {
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
const hcf: icPartialInstruction = async (env, data) => {
	await env.hcf()
}
hcf.validate = tupleEmpty

export const misc: Record<MiscInstructionName, icPartialInstruction> = {
	alias,
	label,
	define,
	move,
	yield: yield_,
	sleep,
	hcf,
}
export default misc
