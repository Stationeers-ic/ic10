import { tupleA_AV, tupleA_RD, tupleEmpty, tupleR_RV, type icPartialInstruction } from "./types"
import { z } from "zod"
import { type MiscInstructionName, RaliasOrValueOrNaN } from "../ZodTypes"

const alias: icPartialInstruction = async (env, data) => {
	const [a, dr] = alias.validate.parse(data)
	await env.alias(a, dr)
}
alias.validate = tupleA_RD
const define: icPartialInstruction = async (env, data) => {
	const d = define.validate.parse(data)
	await env.alias(d[0], await env.get(d[1]))
}
define.validate = tupleA_AV
const move: icPartialInstruction = async (env, data) => {
	const d = move.validate.parse(data)
	await env.set(d[0], await env.get(d[1]))
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
	define,
	move,
	yield: yield_,
	sleep,
	hcf,
}
export default misc
