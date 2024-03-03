import {icFunction} from "../functions"
import conditions from "./conditions"
import {z} from "zod"
import {DeviceOrAlias, Ralias, RaliasOrValue, SelectFunctionName} from "../ZodTypes"

const booleanToNumber = (x: boolean): 1 | 0 => (x ? 1 : 0)

const seq: icFunction = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.eq(env, [op2, op3])))
}
const sge: icFunction = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.ge(env, [op2, op3])))
}
const sgt: icFunction = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.gt(env, [op2, op3])))
}
const sle: icFunction = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.le(env, [op2, op3])))
}
const slt: icFunction = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.lt(env, [op2, op3])))
}
const sne: icFunction = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.ne(env, [op2, op3])))
}
const sap: icFunction = (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.ap(env, [op2, op3, op4])))
}
const sna: icFunction = (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.na(env, [op2, op3, op4])))
}
// ZZZs
const seqz: icFunction = (env, data) => seq(env, [...data, 0])
const sgez: icFunction = (env, data) => sge(env, [...data, 0])
const sgtz: icFunction = (env, data) => sgt(env, [...data, 0])
const slez: icFunction = (env, data) => sle(env, [...data, 0])
const sltz: icFunction = (env, data) => slt(env, [...data, 0])
const snez: icFunction = (env, data) => sne(env, [...data, 0])
const sapz: icFunction = (env, [op1, op2, op3]) => sap(env, [op1, op2, 0, op3])
const snaz: icFunction = (env, [op1, op2, op3]) => sna(env, [op1, op2, 0, op3])
// set
const sdse: icFunction = (env, data) => {
	const [op1, op2] = z.tuple([Ralias, DeviceOrAlias]).parse(data)
	env.set(op1, booleanToNumber(conditions.dse(env, [op2])))
}
const sdns: icFunction = (env, data) => {
	const [op1, op2] = z.tuple([Ralias, DeviceOrAlias]).parse(data)
	env.set(op1, booleanToNumber(conditions.dns(env, [op2])))
}
const snan: icFunction = (env, data) => {
	const [op1, op2] = z.tuple([Ralias, Ralias]).parse(data)
	env.set(op1, booleanToNumber(conditions.nan(env, [op2])))
}
const snanz: icFunction = (env, data) => {
	const [op1, op2] = z.tuple([Ralias, Ralias]).parse(data)
	env.set(op1, booleanToNumber(conditions.nanz(env, [op2])))
}
const sel: icFunction = (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, env.get(op2) ? env.get(op3) : env.get(op4))
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
