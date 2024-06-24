import type { icCondition } from "./types"
import { z } from "zod"
import { type ConditionName, StringOrNumberOrNaN } from "../ZodTypes"
import { Memory } from '../abstract/Memory';

export const epsilon = 1.1210387714598537e-44

const eq: icCondition = async (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return (await env.get(x)) == (await env.get(y))
}
const ge: icCondition = async (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return (await env.get(x)) >= (await env.get(y))
}
const gt: icCondition = async (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return (await env.get(x)) > (await env.get(y))
}
const le: icCondition = async (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return (await env.get(x)) <= (await env.get(y))
}
const lt: icCondition = async (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return (await env.get(x)) < (await env.get(y))
}
const ne: icCondition = async (env, data) => !(await conditions.eq(env, data))
const na: icCondition = async (env, data) => {
	const [x, y, c] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return (
		Math.abs((await env.get(x)) - (await env.get(y))) >
		Math.max((await env.get(c)) * Math.max(Math.abs(await env.get(x)), Math.abs(await env.get(y))), epsilon)
	)
}
const ap: icCondition = async (env, data) => {
	const [x, y, c] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return (
		Math.abs((await env.get(x)) - (await env.get(y))) <=
		Math.max((await env.get(c)) * Math.max(Math.abs(await env.get(x)), Math.abs(await env.get(y))), epsilon)
	)
}
const dse: icCondition = async (env, data) => {
	const [d] = z.tuple([z.string()]).parse(data)
	return env.chipHousing.isPortConnected(env.chipHousing.memory.getAlias(d))
}
const dns: icCondition = async (env, data) => !(await conditions.dse(env, data))
const nan: icCondition = async (env, data) => {
	const [v] = z.tuple([StringOrNumberOrNaN]).parse(data)
	return isNaN(await env.get(v))
}
const nanz: icCondition = async (env, data) => !(await conditions.nan(env, data))

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
