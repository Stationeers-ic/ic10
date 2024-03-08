import { icFunction } from "../functions"
import conditions from "./conditions"
import { z } from "zod"
import { DeviceOrAlias, Ralias, RaliasOrValue, SelectFunctionName } from "../ZodTypes"

const booleanToNumber = (x: boolean): 1 | 0 => (x ? 1 : 0)

const seq: icFunction = async (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.eq(env, [op2, op3])))
}
const sge: icFunction = async (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.ge(env, [op2, op3])))
}
const sgt: icFunction = async (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.gt(env, [op2, op3])))
}
const sle: icFunction = async (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.le(env, [op2, op3])))
}
const slt: icFunction = async (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.lt(env, [op2, op3])))
}
const sne: icFunction = async (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.ne(env, [op2, op3])))
}
const sap: icFunction = async (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.ap(env, [op2, op3, op4])))
}
const sna: icFunction = async (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.na(env, [op2, op3, op4])))
}
// ZZZs
const seqz: icFunction = async (env, data) => seq(env, [...data, 0])
const sgez: icFunction = async (env, data) => sge(env, [...data, 0])
const sgtz: icFunction = async (env, data) => sgt(env, [...data, 0])
const slez: icFunction = async (env, data) => sle(env, [...data, 0])
const sltz: icFunction = async (env, data) => slt(env, [...data, 0])
const snez: icFunction = async (env, data) => sne(env, [...data, 0])
const sapz: icFunction = async (env, [op1, op2, op3]) => sap(env, [op1, op2, 0, op3])
const snaz: icFunction = async (env, [op1, op2, op3]) => sna(env, [op1, op2, 0, op3])
// set
const sdse: icFunction = async (env, data) => {
	const [op1, op2] = z.tuple([Ralias, DeviceOrAlias]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.dse(env, [op2])))
}
const sdns: icFunction = async (env, data) => {
	const [op1, op2] = z.tuple([Ralias, DeviceOrAlias]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.dns(env, [op2])))
}
const snan: icFunction = async (env, data) => {
	const [op1, op2] = z.tuple([Ralias, Ralias]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.nan(env, [op2])))
}
const snanz: icFunction = async (env, data) => {
	const [op1, op2] = z.tuple([Ralias, Ralias]).parse(data)
	await env.set(op1, booleanToNumber(await conditions.nanz(env, [op2])))
}
const sel: icFunction = async (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(op1, (await env.get(op2)) ? await env.get(op3) : await env.get(op4))
}

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
