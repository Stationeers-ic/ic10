import type { ArithmeticInstructionName } from "../ZodTypes"
import { type icPartialInstruction, tupleR, tupleR_RV, tupleR_RV_RV } from "./types"
import BitWarn from "../errors/BitWarn"

export function jsThing(value: number): number {
	if (Object.is(value, -0)) return 0
	if (Object.is(value, -Infinity)) return Infinity
	return value
}

const add: icPartialInstruction = async (env, data) => {
	const d = add.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) + (await env.get(d[2]))))
}
add.validate = tupleR_RV_RV
const sub: icPartialInstruction = async (env, data) => {
	const d = sub.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) - (await env.get(d[2]))))
}
sub.validate = tupleR_RV_RV
const mul: icPartialInstruction = async (env, data) => {
	const d = mul.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) * (await env.get(d[2]))))
}
mul.validate = tupleR_RV_RV
const div: icPartialInstruction = async (env, data) => {
	const d = div.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) / (await env.get(d[2]))))
}
div.validate = tupleR_RV_RV
const mod: icPartialInstruction = async (env, data) => {
	const d = mod.validate.parse(data)
	let num = (await env.get(d[1])) % (await env.get(d[2]))
	if (num < 0) num += await env.get(d[2])
	await env.set(d[0], jsThing(num))
}
mod.validate = tupleR_RV_RV
const sqrt: icPartialInstruction = async (env, data) => {
	const d = sqrt.validate.parse(data)
	await env.set(d[0], jsThing(Math.sqrt(await env.get(d[1]))))
}
sqrt.validate = tupleR_RV
const round: icPartialInstruction = async (env, data) => {
	const d = round.validate.parse(data)
	await env.set(d[0], jsThing(Math.round(await env.get(d[1]))))
}
round.validate = tupleR_RV
const trunc: icPartialInstruction = async (env, data) => {
	const d = trunc.validate.parse(data)
	await env.set(d[0], jsThing(Math.trunc(await env.get(d[1]))))
}
trunc.validate = tupleR_RV
const ceil: icPartialInstruction = async (env, data) => {
	const d = ceil.validate.parse(data)
	await env.set(d[0], jsThing(Math.ceil(await env.get(d[1]))))
}
ceil.validate = tupleR_RV
const floor: icPartialInstruction = async (env, data) => {
	const d = floor.validate.parse(data)
	await env.set(d[0], jsThing(Math.floor(await env.get(d[1]))))
}
floor.validate = tupleR_RV
const max: icPartialInstruction = async (env, data) => {
	const d = max.validate.parse(data)
	await env.set(d[0], jsThing(Math.max(await env.get(d[1]), await env.get(d[2]))))
}
max.validate = tupleR_RV_RV
const min: icPartialInstruction = async (env, data) => {
	const d = min.validate.parse(data)
	await env.set(d[0], jsThing(Math.min(await env.get(d[1]), await env.get(d[2]))))
}
min.validate = tupleR_RV_RV
const abs: icPartialInstruction = async (env, data) => {
	const d = abs.validate.parse(data)
	await env.set(d[0], jsThing(Math.abs(await env.get(d[1]))))
}
abs.validate = tupleR_RV
const log: icPartialInstruction = async (env, data) => {
	const d = log.validate.parse(data)
	await env.set(d[0], jsThing(Math.log(await env.get(d[1]))))
}
log.validate = tupleR_RV
const exp: icPartialInstruction = async (env, data) => {
	const d = exp.validate.parse(data)
	await env.set(d[0], jsThing(Math.exp(await env.get(d[1]))))
}
exp.validate = tupleR_RV
const rand: icPartialInstruction = async (env, data) => {
	const d = rand.validate.parse(data)
	await env.set(d[0], jsThing(Math.random()))
}
rand.validate = tupleR
const sll: icPartialInstruction = async (env, data) => {
	const d = sll.validate.parse(data)
	const l = await env.get(d[2])
	if (l < 0) {
		await env.set(d[0], 0)
	} else {
		await env.set(d[0], jsThing((await env.get(d[1])) << l))
	}
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
sll.validate = tupleR_RV_RV
const srl: icPartialInstruction = async (env, data) => {
	const d = srl.validate.parse(data)
	const l = await env.get(d[2])
	if (l < 0) {
		await env.set(d[0], 0)
	} else {
		await env.set(d[0], jsThing((await env.get(d[1])) >>> (await env.get(d[2]))))
	}
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
srl.validate = tupleR_RV_RV
const sla: icPartialInstruction = async (env, data) => {
	const d = sla.validate.parse(data)
	const l = await env.get(d[2])
	if (l < 0) {
		await env.set(d[0], 0)
	} else {
		await env.set(d[0], jsThing(((await env.get(d[1])) << (await env.get(d[2]))) + Number((await env.get(d[1])) < 0) * ((2 << (await env.get(d[2]))) - 1)))
	}
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
sla.validate = tupleR_RV_RV
const sra: icPartialInstruction = async (env, data) => {
	const d = sra.validate.parse(data)
	const l = await env.get(d[2])
	if (l < 0) {
		await env.set(d[0], 0)
	} else {
		await env.set(d[0], jsThing((await env.get(d[1])) >> (await env.get(d[2]))))
	}
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
sra.validate = tupleR_RV_RV
const sin: icPartialInstruction = async (env, data) => {
	const d = sin.validate.parse(data)
	await env.set(d[0], jsThing(Math.sin(await env.get(d[1]))))
}
sin.validate = tupleR_RV
const cos: icPartialInstruction = async (env, data) => {
	const d = cos.validate.parse(data)
	await env.set(d[0], jsThing(Math.cos(await env.get(d[1]))))
}
cos.validate = tupleR_RV
const tan: icPartialInstruction = async (env, data) => {
	const d = tan.validate.parse(data)
	await env.set(d[0], jsThing(Math.tan(await env.get(d[1]))))
}
tan.validate = tupleR_RV
const asin: icPartialInstruction = async (env, data) => {
	const d = asin.validate.parse(data)
	await env.set(d[0], jsThing(Math.asin(await env.get(d[1]))))
}
asin.validate = tupleR_RV
const acos: icPartialInstruction = async (env, data) => {
	const d = acos.validate.parse(data)
	await env.set(d[0], jsThing(Math.acos(await env.get(d[1]))))
}
acos.validate = tupleR_RV
const atan: icPartialInstruction = async (env, data) => {
	const d = atan.validate.parse(data)
	await env.set(d[0], jsThing(Math.atan(await env.get(d[1]))))
}
atan.validate = tupleR_RV
const atan2: icPartialInstruction = async (env, data) => {
	const d = atan2.validate.parse(data)
	await env.set(d[0], jsThing(Math.atan2(await env.get(d[1]), await env.get(d[2]))))
}
atan2.validate = tupleR_RV_RV
const and: icPartialInstruction = async (env, data) => {
	const d = and.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) & (await env.get(d[2]))))
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
and.validate = tupleR_RV_RV
const or: icPartialInstruction = async (env, data) => {
	const d = or.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) | (await env.get(d[2]))))
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
or.validate = tupleR_RV_RV
const xor: icPartialInstruction = async (env, data) => {
	const d = xor.validate.parse(data)
	await env.set(d[0], jsThing((await env.get(d[1])) ^ (await env.get(d[2]))))
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
xor.validate = tupleR_RV_RV
const nor: icPartialInstruction = async (env, data) => {
	const d = nor.validate.parse(data)
	await env.set(d[0], jsThing(~((await env.get(d[1])) | (await env.get(d[2])))))
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
nor.validate = tupleR_RV_RV
const not: icPartialInstruction = async (env, data) => {
	const d = not.validate.parse(data)
	await env.set(d[0], jsThing(~(await env.get(d[1]))))
	await env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"))
}
not.validate = tupleR_RV

export const arithmetic: Record<ArithmeticInstructionName, icPartialInstruction> = {
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
	not,
}
export default arithmetic
