import { z } from "zod"
import { icFunction } from "../functions"
import BitWarn from "../errors/BitWarn"
import { ArithmeticFunctionName, Ralias, RaliasOrValue } from "../ZodTypes"

function jsThing(value: number) {
	if (Object.is(value, -0)) return 0
	if (Object.is(value, -Infinity)) return Infinity
	return value
}

const add: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) + (await env.get(d[2]))))
}
const sub: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) - (await env.get(d[2]))))
}
const mul: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) * (await env.get(d[2]))))
}
const div: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) / (await env.get(d[2]))))
}
const mod: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	let num = (await env.get(d[1])) % (await env.get(d[2]))
	if (num < 0) num += await env.get(d[2])
	await env.set(d[0], jsThing(num))
}
const sqrt: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.sqrt(await env.get(d[1]))))
}
const round: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.round(await env.get(d[1]))))
}
const trunc: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.trunc(await env.get(d[1]))))
}
const ceil: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.ceil(await env.get(d[1]))))
}
const floor: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.floor(await env.get(d[1]))))
}
const max: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.max(await env.get(d[1]), await env.get(d[2]))))
}
const min: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.min(await env.get(d[1]), await env.get(d[2]))))
}
const abs: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.abs(await env.get(d[1]))))
}
const log: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.log(await env.get(d[1]))))
}
const exp: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.exp(await env.get(d[1]))))
}
const rand: icFunction = async (env, data) => {
	const d = z.tuple([Ralias]).parse(data)
	await env.set(d[0], jsThing(Math.random()))
}
const sll: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
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
const srl: icFunction = async (env, data) => {
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
const sla: icFunction = async (env, data) => {
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
const sra: icFunction = async (env, data) => {
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
const sin: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.sin(await env.get(d[1]))))
}
const cos: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.cos(await env.get(d[1]))))
}
const tan: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.tan(await env.get(d[1]))))
}
const asin: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.asin(await env.get(d[1]))))
}
const acos: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.acos(await env.get(d[1]))))
}
const atan: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.atan(await env.get(d[1]))))
}
const atan2: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(Math.atan2(await env.get(d[1]), await env.get(d[2]))))
}
const and: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) & (await env.get(d[2]))))
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const or: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) | (await env.get(d[2]))))
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const xor: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) ^ (await env.get(d[2]))))
	await env.throw(
		new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"),
	)
}
const nor: icFunction = async (env, data) => {
	const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data)
	await env.set(d[0], jsThing(~((await env.get(d[1])) | (await env.get(d[2])))))
	await env.throw(
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
