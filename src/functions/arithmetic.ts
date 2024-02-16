import { z } from "zod"
import { icFunction } from "../functions"
import { BitWarn } from "../errors/BitWarn"
import { RegisterOrAlias, StringOrNumber } from "../ZodTypes"

function jsThing(value: number) {
	if (Object.is(value, -0)) return 0
	if (Object.is(value, -Infinity)) return Infinity
	return value
}

export const arithmetic: { [key: string]: icFunction } = {
	add: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(env.get(d[1]) + env.get(d[2])))
	},
	sub: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(env.get(d[1]) - env.get(d[2])))
	},
	mul: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(env.get(d[1]) * env.get(d[2])))
	},
	div: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(env.get(d[1]) / env.get(d[2])))
	},
	mod: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(env.get(d[1]) % env.get(d[2])))
	},
	sqrt: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.sqrt(env.get(d[1]))))
	},
	round: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.round(env.get(d[1]))))
	},
	trunc: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.trunc(env.get(d[1]))))
	},
	ceil: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.ceil(env.get(d[1]))))
	},
	floor: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.floor(env.get(d[1]))))
	},
	max: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.max(env.get(d[1]), env.get(d[2]))))
	},
	min: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.min(env.get(d[1]), env.get(d[2]))))
	},
	abs: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.abs(env.get(d[1]))))
	},
	log: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.log(env.get(d[1]))))
	},
	exp: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.exp(env.get(d[1]))))
	},
	rand: (env, data) => {
		const d = z.tuple([RegisterOrAlias]).parse(data)
		env.set(d[0], jsThing(Math.random()))
	},
	sll: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		const l = env.get(d[2])
		if (l < 0) {
			env.set(d[0], 0)
		} else {
			env.set(d[0], jsThing(env.get(d[1]) << l))
		}
		return [
			new BitWarn(
				"JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers",
				"warning",
			),
		]
	},
	srl: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		const l = env.get(d[2])
		if (l < 0) {
			env.set(d[0], 0)
		} else {
			env.set(d[0], jsThing(env.get(d[1]) >>> env.get(d[2])))
		}
		return [
			new BitWarn(
				"JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers",
				"warning",
			),
		]
	},
	sla: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		const l = env.get(d[2])
		if (l < 0) {
			env.set(d[0], 0)
		} else {
			env.set(
				d[0],
				jsThing((env.get(d[1]) << env.get(d[2])) + Number(env.get(d[1]) < 0) * ((2 << env.get(d[2])) - 1)),
			)
		}
		return [
			new BitWarn(
				"JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers",
				"warning",
			),
		]
	},
	sra: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		const l = env.get(d[2])
		if (l < 0) {
			env.set(d[0], 0)
		} else {
			env.set(d[0], jsThing(env.get(d[1]) >> env.get(d[2])))
		}
		return [
			new BitWarn(
				"JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers",
				"warning",
			),
		]
	},
	sin: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.sin(env.get(d[1]))))
	},
	cos: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.cos(env.get(d[1]))))
	},
	tan: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.tan(env.get(d[1]))))
	},
	asin: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.asin(env.get(d[1]))))
	},
	acos: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.acos(env.get(d[1]))))
	},
	atan: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.atan(env.get(d[1]))))
	},
	atan2: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(Math.atan2(env.get(d[1]), env.get(d[2]))))
	},
	and: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(env.get(d[1]) & env.get(d[2])))
		return [
			new BitWarn(
				"JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers",
				"warning",
			),
		]
	},
	or: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(env.get(d[1]) | env.get(d[2])))
		return [
			new BitWarn(
				"JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers",
				"warning",
			),
		]
	},
	xor: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(env.get(d[1]) ^ env.get(d[2])))
		return [
			new BitWarn(
				"JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers",
				"warning",
			),
		]
	},
	nor: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumber, StringOrNumber]).parse(data)
		env.set(d[0], jsThing(~(env.get(d[1]) | env.get(d[2]))))
		return [
			new BitWarn(
				"JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers",
				"warning",
			),
		]
	},
}
