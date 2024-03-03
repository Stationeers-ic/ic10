import {z} from "zod"
import {icFunction} from "../functions"
import {BitWarn} from "../errors/BitWarn"
import {ArithmeticFunctionName, Ralias, RaliasOrValue} from "../ZodTypes"

function jsThing(value: number) {
	if (Object.is(value, -0)) return 0
	if (Object.is(value, -Infinity)) return Infinity
	return value
}

const add: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(env.get(d[1]) + env.get(d[2])))
}
const sub: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(env.get(d[1]) - env.get(d[2])))
}
const mul: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(env.get(d[1]) * env.get(d[2])))
}
const div: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(env.get(d[1]) / env.get(d[2])))
}
const mod: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	let num = env.get(d[1]) % env.get(d[2])
	if (num < 0) num += env.get(d[2])
	env.set(d[0], jsThing(num))
}
const sqrt: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.sqrt(env.get(d[1]))))
}
const round: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.round(env.get(d[1]))))
}
const trunc: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.trunc(env.get(d[1]))))
}
const ceil: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.ceil(env.get(d[1]))))
}
const floor: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.floor(env.get(d[1]))))
}
const max: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.max(env.get(d[1]), env.get(d[2]))))
}
const min: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.min(env.get(d[1]), env.get(d[2]))))
}
const abs: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.abs(env.get(d[1]))))
}
const log: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.log(env.get(d[1]))))
}
const exp: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.exp(env.get(d[1]))))
}
const rand: icFunction = (env, data) => {
	const d = z.tuple([Ralias]).parse(data)
	env.set(d[0], jsThing(Math.random()))
}
const sll: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	const l = env.get(d[2])
	if (l < 0) {
		env.set(d[0], 0)
	} else {
		env.set(d[0], jsThing(env.get(d[1]) << l))
	}
	env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const srl: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	const l = env.get(d[2])
	if (l < 0) {
		env.set(d[0], 0)
	} else {
		env.set(d[0], jsThing(env.get(d[1]) >>> env.get(d[2])))
	}
	env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const sla: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	const l = env.get(d[2])
	if (l < 0) {
		env.set(d[0], 0)
	} else {
		env.set(
			d[0],
			jsThing((env.get(d[1]) << env.get(d[2])) + Number(env.get(d[1]) < 0) * ((2 << env.get(d[2])) - 1)),
		)
	}
	env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const sra: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	const l = env.get(d[2])
	if (l < 0) {
		env.set(d[0], 0)
	} else {
		env.set(d[0], jsThing(env.get(d[1]) >> env.get(d[2])))
	}
	env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const sin: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.sin(env.get(d[1]))))
}
const cos: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.cos(env.get(d[1]))))
}
const tan: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.tan(env.get(d[1]))))
}
const asin: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.asin(env.get(d[1]))))
}
const acos: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.acos(env.get(d[1]))))
}
const atan: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.atan(env.get(d[1]))))
}
const atan2: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(Math.atan2(env.get(d[1]), env.get(d[2]))))
}
const and: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(env.get(d[1]) & env.get(d[2])))
	env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const or: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(env.get(d[1]) | env.get(d[2])))
	env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const xor: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(env.get(d[1]) ^ env.get(d[2])))
	env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const nor: icFunction = (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	env.set(d[0], jsThing(~(env.get(d[1]) | env.get(d[2]))))
	env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}

export const arithmetic: Record<ArithmeticFunctionName, icFunction> = {
	add,
	sub,
	mul,
	div,
	mod,
	sqrt,
	round,
	trunc,
	ceil,
	floor,
	max,
	min,
	abs,
	log,
	exp,
	rand,
	sll,
	srl,
	sla,
	sra,
	sin,
	cos,
	tan,
	asin,
	acos,
	atan,
	atan2,
	and,
	or,
	xor,
	nor,
}
export default arithmetic
