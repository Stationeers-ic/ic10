import type { icCondition, icPartialInstruction } from "./types"
import { tupleR_DA, tupleR_R, tupleR_RV, tupleR_RV_RV, tupleR_RV_RV_RV } from "./types"
import type { SelectInstructionName } from "../ZodTypes"
import type { Environment } from "../abstract/Environment"
import conditions from "./conditions"

const booleanToNumber = (x: boolean): 1 | 0 => (x ? 1 : 0)
// function to simplify
const condition = async (env: Environment, con: icCondition, set: any, ...args: any[]) => {
	await env.set(set, booleanToNumber(await con(env, args)))
}

const seq: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = seq.validate.parse(data)
	await condition(env, conditions.eq, op1, op2, op3)
}
seq.validate = tupleR_RV_RV
const sge: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = sge.validate.parse(data)
	await condition(env, conditions.ge, op1, op2, op3)
}
sge.validate = tupleR_RV_RV
const sgt: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = sgt.validate.parse(data)
	await condition(env, conditions.gt, op1, op2, op3)
}
sgt.validate = tupleR_RV_RV
const sle: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = sle.validate.parse(data)
	await condition(env, conditions.le, op1, op2, op3)
}
sle.validate = tupleR_RV_RV
const slt: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = slt.validate.parse(data)
	await condition(env, conditions.lt, op1, op2, op3)
}
slt.validate = tupleR_RV_RV
const sne: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = sne.validate.parse(data)
	await condition(env, conditions.ne, op1, op2, op3)
}
sne.validate = tupleR_RV_RV
const sap: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3, op4] = sap.validate.parse(data)
	await condition(env, conditions.ap, op1, op2, op3, op4)
}
sap.validate = tupleR_RV_RV_RV
const sna: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3, op4] = sna.validate.parse(data)
	await condition(env, conditions.na, op1, op2, op3, op4)
}
sna.validate = tupleR_RV_RV_RV
// ZZZs
const seqz: icPartialInstruction = async (env, data) => {
	const [op1, op2] = seqz.validate.parse(data)
	await condition(env, conditions.eq, op1, op2, 0)
}
seqz.validate = tupleR_RV
const sgez: icPartialInstruction = async (env, data) => {
	const [op1, op2] = sgez.validate.parse(data)
	await condition(env, conditions.ge, op1, op2, 0)
}
sgez.validate = tupleR_RV
const sgtz: icPartialInstruction = async (env, data) => {
	const [op1, op2] = sgtz.validate.parse(data)
	await condition(env, conditions.gt, op1, op2, 0)
}
sgtz.validate = tupleR_RV
const slez: icPartialInstruction = async (env, data) => {
	const [op1, op2] = slez.validate.parse(data)
	await condition(env, conditions.le, op1, op2, 0)
}
slez.validate = tupleR_RV
const sltz: icPartialInstruction = async (env, data) => {
	const [op1, op2] = sltz.validate.parse(data)
	await condition(env, conditions.lt, op1, op2, 0)
}
sltz.validate = tupleR_RV
const snez: icPartialInstruction = async (env, data) => {
	const [op1, op2] = snez.validate.parse(data)
	await condition(env, conditions.ne, op1, op2, 0)
}
snez.validate = tupleR_RV
const sapz: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = sapz.validate.parse(data)
	await condition(env, conditions.ap, op1, op2, op3, 0)
}
sapz.validate = tupleR_RV_RV
const snaz: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = snaz.validate.parse(data)
	await condition(env, conditions.na, op1, op2, op3, 0)
}
snaz.validate = tupleR_RV_RV
// set
const sdse: icPartialInstruction = async (env, data) => {
	const [op1, op2] = sdse.validate.parse(data)
	await condition(env, conditions.dse, op1, op2)
}
sdse.validate = tupleR_DA
const sdns: icPartialInstruction = async (env, data) => {
	const [op1, op2] = sdns.validate.parse(data)
	await condition(env, conditions.dns, op1, op2)
}
sdns.validate = tupleR_DA
const snan: icPartialInstruction = async (env, data) => {
	const [op1, op2] = snan.validate.parse(data)
	await condition(env, conditions.nan, op1, op2)
}
snan.validate = tupleR_R
const snanz: icPartialInstruction = async (env, data) => {
	const [op1, op2] = snanz.validate.parse(data)
	await condition(env, conditions.nanz, op1, op2)
}
snanz.validate = tupleR_R
const sel: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3, op4] = sel.validate.parse(data)
	await env.set(op1, (await env.get(op2)) ? await env.get(op3) : await env.get(op4))
}
sel.validate = tupleR_RV_RV_RV

export const select: Record<SelectInstructionName, icPartialInstruction> = {
	seq,
	sge,
	sgt,
	sle,
	slt,
	sne,
	sap,
	sna,
	seqz,
	sgez,
	sgtz,
	slez,
	sltz,
	snez,
	sapz,
	snaz,
	sdse,
	sdns,
	snan,
	snanz,
	select: sel,
}
export default select
