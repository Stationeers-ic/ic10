import { icFunction } from "../functions"
import conditions from "./conditions"
import { z } from "zod"
import { DeviceOrAlias, Ralias, RaliasOrValue } from "../ZodTypes"

const booleanToNumber = (x: boolean): 1 | 0 => (x ? 1 : 0)

export const select: Record<string, icFunction> = {}

select.seq = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.eq(env, [op2, op3])))
}
select.sge = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.ge(env, [op2, op3])))
}
select.sgt = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.gt(env, [op2, op3])))
}
select.sle = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.le(env, [op2, op3])))
}
select.slt = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.lt(env, [op2, op3])))
}
select.sne = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.ne(env, [op2, op3])))
}
select.sap = (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.ap(env, [op2, op3, op4])))
}
select.sna = (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.na(env, [op2, op3, op4])))
}
// ZZZs
select.seqz = (env, data) => select.seq(env, [...data, 0])
select.sgez = (env, data) => select.sge(env, [...data, 0])
select.sgtz = (env, data) => select.sgt(env, [...data, 0])
select.slez = (env, data) => select.sle(env, [...data, 0])
select.sltz = (env, data) => select.slt(env, [...data, 0])
select.snez = (env, data) => select.sne(env, [...data, 0])

// TODO: not working as intended
select.sapz = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.ap(env, [op2, 0, op3])))
}
// TODO: not working as intended
select.snaz = (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, booleanToNumber(conditions.na(env, [op2, 0, op3])))
}

// set
select.sdse = (env, data) => {
	const [op1, op2] = z.tuple([Ralias, DeviceOrAlias]).parse(data)
	env.set(op1, booleanToNumber(conditions.dse(env, [op2])))
}
select.sdns = (env, data) => {
	const [op1, op2] = z.tuple([Ralias, DeviceOrAlias]).parse(data)
	env.set(op1, booleanToNumber(conditions.dns(env, [op2])))
}
select.snan = (env, data) => {
	const [op1, op2] = z.tuple([Ralias, Ralias]).parse(data)
	env.set(op1, booleanToNumber(conditions.nan(env, [op2])))
}
select.snanz = (env, data) => {
	const [op1, op2] = z.tuple([Ralias, Ralias]).parse(data)
	env.set(op1, booleanToNumber(conditions.nanz(env, [op2])))
}
select.select = (env, data) => {
	const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(op1, env.get(op2) ? env.get(op3) : env.get(op4))
}
