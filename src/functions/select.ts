import { icFunction } from "../functions"
import conditions from "./conditions"
import { z } from "zod"
import { DeviceOrAlias, Ralias, RaliasOrValue, SelectFunctionName } from "../ZodTypes"

const booleanToNumber = (x: boolean): 1 | 0 => (x ? 1 : 0)

const seq: icFunction = async (env, data) => {
	const [op1, op2, op3] = seq.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.eq(env, [op2, op3])))
}
seq.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sge: icFunction = async (env, data) => {
	const [op1, op2, op3] = sge.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.ge(env, [op2, op3])))
}
sge.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sgt: icFunction = async (env, data) => {
	const [op1, op2, op3] = sgt.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.gt(env, [op2, op3])))
}
sgt.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sle: icFunction = async (env, data) => {
	const [op1, op2, op3] = sle.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.le(env, [op2, op3])))
}
sle.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const slt: icFunction = async (env, data) => {
	const [op1, op2, op3] = slt.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.lt(env, [op2, op3])))
}
slt.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sne: icFunction = async (env, data) => {
	const [op1, op2, op3] = sne.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.ne(env, [op2, op3])))
}
sne.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sap: icFunction = async (env, data) => {
	const [op1, op2, op3, op4] = sap.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.ap(env, [op2, op3, op4])))
}
sap.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue])
const sna: icFunction = async (env, data) => {
	const [op1, op2, op3, op4] = sna.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.na(env, [op2, op3, op4])))
}
sna.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue])
// ZZZs
const seqz: icFunction = async (env, data) => seq(env, [...data, 0])
const sgez: icFunction = async (env, data) => sge(env, [...data, 0])
const sgtz: icFunction = async (env, data) => sgt(env, [...data, 0])
const slez: icFunction = async (env, data) => sle(env, [...data, 0])
const sltz: icFunction = async (env, data) => slt(env, [...data, 0])
const snez: icFunction = async (env, data) => sne(env, [...data, 0])
const sapz: icFunction = async (env, [op1, op2, op3]) => sap(env, [op1, op2, 0, op3])
const snaz: icFunction = async (env, [op1, op2, op3]) => sna(env, [op1, op2, 0, op3])
seqz.validate = z.tuple([Ralias, RaliasOrValue])
sgez.validate = z.tuple([Ralias, RaliasOrValue])
sgtz.validate = z.tuple([Ralias, RaliasOrValue])
slez.validate = z.tuple([Ralias, RaliasOrValue])
sltz.validate = z.tuple([Ralias, RaliasOrValue])
snez.validate = z.tuple([Ralias, RaliasOrValue])
sapz.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
snaz.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
// set
const sdse: icFunction = async (env, data) => {
	const [op1, op2] = sdse.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.dse(env, [op2])))
}
sdse.validate = z.tuple([Ralias, DeviceOrAlias])
const sdns: icFunction = async (env, data) => {
	const [op1, op2] = sdns.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.dns(env, [op2])))
}
sdns.validate = z.tuple([Ralias, DeviceOrAlias])
const snan: icFunction = async (env, data) => {
	const [op1, op2] = snan.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.nan(env, [op2])))
}
snan.validate = z.tuple([Ralias, Ralias])
const snanz: icFunction = async (env, data) => {
	const [op1, op2] = snanz.validate.parse(data)
	await env.set(op1, booleanToNumber(await conditions.nanz(env, [op2])))
}
snanz.validate = z.tuple([Ralias, Ralias])
const sel: icFunction = async (env, data) => {
	const [op1, op2, op3, op4] = sel.validate.parse(data)
	await env.set(op1, (await env.get(op2)) ? await env.get(op3) : await env.get(op4))
}
sel.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue])

export const select: Record<SelectFunctionName, icFunction> = {
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
