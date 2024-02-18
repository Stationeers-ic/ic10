import { z } from "zod"
import { icCondition } from "../functions"
import { ConditionName, StringOrNumberOrNaN } from "../ZodTypes"

export const epsilon = 2 ** -23


const eq:icCondition = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) == env.get(y)
}
const ge:icCondition = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) >= env.get(y)
}
const gt:icCondition = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) > env.get(y)
}
const le:icCondition = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) <= env.get(y)
}
const lt:icCondition = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) < env.get(y)
}
const ne:icCondition = (env, data) => !conditions.eq(env, data)

const na:icCondition = (env, data) => {
	const [x, y, c] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return (
		Math.abs(env.get(x) - env.get(y)) >
		Math.max(env.get(c) * Math.max(Math.abs(env.get(x)), Math.abs(env.get(y))), epsilon)
		)
	}
	const ap:icCondition = (env, data) => {
		const [x, y, c] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		return (
			Math.abs(env.get(x) - env.get(y)) <=
			Math.max(env.get(c) * Math.max(Math.abs(env.get(x)), Math.abs(env.get(y))), epsilon)
	)
}
const dse:icCondition = (env, data) => {
	const [d] = z.tuple([z.string()]).parse(data)
	return env.hasDevice(env.getAlias(d))
}
const dns:icCondition = (env, data) => !conditions.dse(env, data)

const nan:icCondition = (env, data) => {
	const [v] = z.tuple([StringOrNumberOrNaN]).parse(data)
	return isNaN(env.get(v))
}
const nanz:icCondition = (env, data) => !conditions.nan(env, data)

export const conditions: Record<ConditionName, icCondition> = {
	eq,
	ge,
	gt,
	le,
	lt,
	ne,
	na,
	ap,
	dse,
	dns,
	nan,
	nanz,
}
export default conditions
