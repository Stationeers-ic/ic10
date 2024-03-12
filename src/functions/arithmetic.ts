import type { icPartialFunction } from "./types"
import { z } from "zod"
import BitWarn from "../errors/BitWarn"
import { type ArithmeticFunctionName, Ralias, RaliasOrValue } from "../ZodTypes"

export function jsThing(value: number) {
	if (Object.is(value, -0)) return 0
	if (Object.is(value, -Infinity)) return Infinity
	return value
}

const add: icPartialFunction = async (env, data) => {
	const d = add.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) + (await env.get(d[2]))))
}
add.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sub: icPartialFunction = async (env, data) => {
	const d = sub.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) - (await env.get(d[2]))))
}
sub.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const mul: icPartialFunction = async (env, data) => {
	const d = mul.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) * (await env.get(d[2]))))
}
mul.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const div: icPartialFunction = async (env, data) => {
	const d = div.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) / (await env.get(d[2]))))
}
div.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const mod: icPartialFunction = async (env, data) => {
	const d = mod.validate.parse(data)
	let num = (await env.get(d[1])) % (await env.get(d[2]))
	if (num < 0) num += await env.get(d[2])
	await env.set(d[0], jsThing(num))
}
mod.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sqrt: icPartialFunction = async (env, data) => {
	const d = sqrt.validate.parse(data)
	await env.set(d[0], jsThing(Math.sqrt(await env.get(d[1]))))
}
sqrt.validate = z.tuple([Ralias, RaliasOrValue])
const round: icPartialFunction = async (env, data) => {
	const d = round.validate.parse(data)
	await env.set(d[0], jsThing(Math.round(await env.get(d[1]))))
}
round.validate = z.tuple([Ralias, RaliasOrValue])
const trunc: icPartialFunction = async (env, data) => {
	const d = trunc.validate.parse(data)
	await env.set(d[0], jsThing(Math.trunc(await env.get(d[1]))))
}
trunc.validate = z.tuple([Ralias, RaliasOrValue])
const ceil: icPartialFunction = async (env, data) => {
	const d = ceil.validate.parse(data)
	await env.set(d[0], jsThing(Math.ceil(await env.get(d[1]))))
}
ceil.validate = z.tuple([Ralias, RaliasOrValue])
const floor: icPartialFunction = async (env, data) => {
	const d = floor.validate.parse(data)
	await env.set(d[0], jsThing(Math.floor(await env.get(d[1]))))
}
floor.validate = z.tuple([Ralias, RaliasOrValue])
const max: icPartialFunction = async (env, data) => {
	const d = max.validate.parse(data)
	await env.set(d[0], jsThing(Math.max(await env.get(d[1]), await env.get(d[2]))))
}
max.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const min: icPartialFunction = async (env, data) => {
	const d = min.validate.parse(data)
	await env.set(d[0], jsThing(Math.min(await env.get(d[1]), await env.get(d[2]))))
}
min.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const abs: icPartialFunction = async (env, data) => {
	const d = abs.validate.parse(data)
	await env.set(d[0], jsThing(Math.abs(await env.get(d[1]))))
}
abs.validate = z.tuple([Ralias, RaliasOrValue])
const log: icPartialFunction = async (env, data) => {
	const d = log.validate.parse(data)
	await env.set(d[0], jsThing(Math.log(await env.get(d[1]))))
}
log.validate = z.tuple([Ralias, RaliasOrValue])
const exp: icPartialFunction = async (env, data) => {
	const d = exp.validate.parse(data)
	await env.set(d[0], jsThing(Math.exp(await env.get(d[1]))))
}
exp.validate = z.tuple([Ralias, RaliasOrValue])
const rand: icPartialFunction = async (env, data) => {
	const d = rand.validate.parse(data)
	await env.set(d[0], jsThing(Math.random()))
}
rand.validate = z.tuple([Ralias])
const sll: icPartialFunction = async (env, data) => {
	const d = sll.validate.parse(data)
	const l = await env.get(d[2])
	if (l < 0) {
		await env.set(d[0], 0)
	} else {
		await env.set(d[0], jsThing((await env.get(d[1])) << l))
	}
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
sll.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const srl: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	const l = await env.get(d[2])
	if (l < 0) {
		await env.set(d[0], 0)
	} else {
		await env.set(d[0], jsThing((await env.get(d[1])) >>> (await env.get(d[2]))))
	}
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
srl.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sla: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	const l = await env.get(d[2])
	if (l < 0) {
		await env.set(d[0], 0)
	} else {
		await env.set(
			d[0],
			jsThing(
				((await env.get(d[1])) << (await env.get(d[2]))) +
					Number((await env.get(d[1])) < 0) * ((2 << (await env.get(d[2]))) - 1),
			),
		)
	}
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
sla.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sra: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	const l = await env.get(d[2])
	if (l < 0) {
		await env.set(d[0], 0)
	} else {
		await env.set(d[0], jsThing((await env.get(d[1])) >> (await env.get(d[2]))))
	}
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
sra.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const sin: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.sin(await env.get(d[1]))))
}
sin.validate = z.tuple([Ralias, RaliasOrValue])
const cos: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.cos(await env.get(d[1]))))
}
cos.validate = z.tuple([Ralias, RaliasOrValue])
const tan: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.tan(await env.get(d[1]))))
}
tan.validate = z.tuple([Ralias, RaliasOrValue])
const asin: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.asin(await env.get(d[1]))))
}
asin.validate = z.tuple([Ralias, RaliasOrValue])
const acos: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.acos(await env.get(d[1]))))
}
acos.validate = z.tuple([Ralias, RaliasOrValue])
const atan: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.atan(await env.get(d[1]))))
}
atan.validate = z.tuple([Ralias, RaliasOrValue])
const atan2: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.atan2(await env.get(d[1]), await env.get(d[2]))))
}
atan2.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const and: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) & (await env.get(d[2]))))
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
and.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const or: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) | (await env.get(d[2]))))
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
or.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const xor: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) ^ (await env.get(d[2]))))
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
xor.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])
const nor: icPartialFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(~((await env.get(d[1])) | (await env.get(d[2])))))
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
nor.validate = z.tuple([Ralias, RaliasOrValue, RaliasOrValue])

export const arithmetic: Record<ArithmeticFunctionName, icPartialFunction> = {
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
