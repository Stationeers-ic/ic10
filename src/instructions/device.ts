import type { Environment } from "../abstract/Environment"
import type { icPartialInstruction } from "./types"
import { z } from "zod"
import {
	CoerceValue,
	type DeviceInstructionName,
	DeviceOrAlias,
	Hash,
	Logic,
	Mode,
	Ralias,
	RaliasOrCoerceValue,
	RaliasOrValue,
	SlotIndex,
} from "../ZodTypes"
import SyntaxError from "../errors/SyntaxError"

async function action(env: Environment, register: string, mode: string, values: number[]): Promise<Environment | void> {
	const m = env.get(mode)
	if (m === 0) return env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
	if (m === 1)
		return env.set(
			register,
			values.reduce((partial_sum, a) => partial_sum + a, 0),
		)
	if (m === 2) return env.set(register, Math.min(...values))
	if (m === 3) return env.set(register, Math.max(...values))
}

const s: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = s.validate.parse(data)
	if (!(await env.isPortConnected(await env.getAlias(op1)))) {
		throw new SyntaxError(`Device ${await env.getAlias(op1)} not found`, "error", await env.getPosition())
	}
	await env.set(`${await env.getAlias(op1)}.${await env.getAlias(op2)}`, await env.get(op3))
}
s.validate = z.tuple([DeviceOrAlias, Logic, RaliasOrValue])
const l: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = l.validate.parse(data)
	if (!(await env.isPortConnected(await env.getAlias(op2)))) {
		throw new SyntaxError(`Device ${await env.getAlias(op2)} not found`, "error", await env.getPosition())
	}
	await env.set(op1, await env.get(`${await env.getAlias(op2)}.${await env.getAlias(op3)}`))
}
l.validate = z.tuple([Ralias, DeviceOrAlias, Logic])
const ls: icPartialInstruction = async (env, data) => {
	const [register, device, slot, property] = ls.validate.parse(data)
	await env.set(register, await env.get(`${device}.Slots.${slot}.${property}`))
}
ls.validate = z.tuple([Ralias, DeviceOrAlias, SlotIndex, Logic])
const sb: icPartialInstruction = async (env, data) => {
	const [hash, logic, register] = sb.validate.parse(data)
	env.setDeviceByHash(await env.get(hash), logic, await env.get(register))
}
sb.validate = z.tuple([Hash, Logic, RaliasOrValue])
const sbn: icPartialInstruction = async (env, data) => {
	const [hash, name, logic, register] = sbn.validate.parse(data)
	env.setDeviceByHashAndName(await env.get(hash), await env.get(name), logic, await env.get(register))
}
sbn.validate = z.tuple([Hash, Hash, Logic, RaliasOrValue])
const sbs: icPartialInstruction = async (env, data) => {
	const [hash, slot, logic, value] = sbs.validate.parse(data)
	env.setSlotDeviceByHash(await env.get(hash), await env.get(slot), logic, await env.get(value))
}
sbs.validate = z.tuple([Hash, RaliasOrValue, Logic, RaliasOrValue])
const lb: icPartialInstruction = async (env, data) => {
	const [register, hash, logic, mode] = lb.validate.parse(data)
	const values: number[] = await env.getDeviceByHash(await env.get(hash), logic)
	await action(env, register, mode, values)
}
lb.validate = z.tuple([Ralias, Hash, Logic, Mode])
const lbn: icPartialInstruction = async (env, data) => {
	const [register, hash, name, logic, mode] = lbn.validate.parse(data)
	const values: number[] = await env.getDeviceByHashAndName(await env.get(hash), await env.get(name), logic)
	await action(env, register, mode, values)
}
lbn.validate = z.tuple([Ralias, Hash, Hash, Logic, Mode])
const lbs: icPartialInstruction = async (env, data) => {
	const [register, hash, slot, logic, mode] = lbs.validate.parse(data)
	const values: number[] = await env.getSlotDeviceByHash(await env.get(hash), await env.get(slot), logic)
	await action(env, register, mode, values)
}
lbs.validate = z.tuple([Ralias, Hash, RaliasOrValue, Logic, Mode])
const lbns: icPartialInstruction = async (env, data) => {
	const [register, hash, name, slot, logic, mode] = lbns.validate.parse(data)
	const values: number[] = await env.getSlotDeviceByHashAndName(
		await env.get(hash),
		await env.get(name),
		await env.get(slot),
		logic,
	)
	await action(env, register, mode, values)
}
lbns.validate = z.tuple([Ralias, Hash, RaliasOrValue, RaliasOrValue, Logic, Mode])
const lr: icPartialInstruction = async (env, data) => {
	const [register, device, reagentMode, hash] = lr.validate.parse(data)
	await env.set(register, await env.get(`${device}.Reagents.${reagentMode}.${hash}`))
}
lr.validate = z.tuple([Ralias, DeviceOrAlias, RaliasOrValue, Hash])
const ss: icPartialInstruction = async (env, data) => {
	const [device, slot, property, value] = ss.validate.parse(data)
	await env.set(`${device}.Slots.${slot}.${property}`, await env.get(value))
}
ss.validate = z.tuple([DeviceOrAlias, SlotIndex, Logic, RaliasOrValue])

const get: icPartialInstruction = async (env, data) => {
	const [reg, device, index] = get.validate.parse(data)
	if (!(await env.isPortConnected(await env.getAlias(device)))) {
		throw new SyntaxError(`Device ${await env.getAlias(device)} not found`, "error", await env.getPosition())
	}
	await env.set(await env.getAlias(reg), await env.ic_get(device, await env.get(index)))
}
get.validate = z.tuple([Ralias, DeviceOrAlias, RaliasOrValue])

const put: icPartialInstruction = async (env, data) => {
	const [device, index, value] = put.validate.parse(data)
	if (!(await env.isPortConnected(await env.getAlias(device)))) {
		throw new SyntaxError(`Device ${await env.getAlias(device)} not found`, "error", await env.getPosition())
	}
	await env.ic_put(device, await env.get(index), await env.get(value))
}
put.validate = z.tuple([DeviceOrAlias, RaliasOrValue, RaliasOrValue])

const getd: icPartialInstruction = async (env, data) => {
	const [reg, deviceId, index] = getd.validate.parse(data)
	await env.set(await env.getAlias(reg), await env.ic_getd(env.get(deviceId).toString(), await env.get(index)))
}
getd.validate = z.tuple([Ralias, RaliasOrCoerceValue, RaliasOrValue])

const putd: icPartialInstruction = async (env, data) => {
	const [deviceId, index, value] = putd.validate.parse(data)
	await env.ic_putd((await env.get(deviceId)).toString(), await env.get(index), await env.get(value))
}
putd.validate = z.tuple([RaliasOrCoerceValue, RaliasOrValue, RaliasOrValue])

const poke: icPartialInstruction = async (env, data) => {
	const [index, value] = poke.validate.parse(data)
	await env.ic_put("db", await env.get(index), await env.get(value))
}
poke.validate = z.tuple([RaliasOrValue, RaliasOrValue])

const ld: icPartialInstruction = async (env, data) => {
	const [reg, deviceId, Logic] = ld.validate.parse(data)
	await env.set(reg, await env.getDeviceProp(env.get(deviceId).toString(), Logic))
}
ld.validate = z.tuple([Ralias, RaliasOrCoerceValue, Logic])

const sd: icPartialInstruction = async (env, data) => {
	const [deviceId, Logic, value] = sd.validate.parse(data)
	await env.setDeviceProp(env.get(deviceId).toString(), Logic, value)
}
sd.validate = z.tuple([RaliasOrCoerceValue, Logic, RaliasOrValue])

const device: Record<DeviceInstructionName, icPartialInstruction> = {
	l,
	lb,
	lbn,
	lbns,
	lbs,
	lr,
	ls,
	s,
	sb,
	sbn,
	sbs,
	ss,
	put,
	get,
	getd,
	putd,
	poke,
	ld,
	sd,
}

export default device
