import type { Environment } from "../abstract/Environment"
import type { icPartialInstruction } from "./types"
import { z } from "zod"
import {
	type DeviceInstructionName,
	DeviceOrAlias,
	Hash,
	Logic,
	Mode,
	Ralias,
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
	if (!env.hasDevice(await env.getAlias(op1))) {
		throw new SyntaxError(`Device ${await env.getAlias(op1)} not found`, "error", await env.getPosition())
	}
	await env.set(`${await env.getAlias(op1)}.${await env.getAlias(op2)}`, await env.get(op3))
}
s.validate = z.tuple([DeviceOrAlias, Logic, RaliasOrValue])
const l: icPartialInstruction = async (env, data) => {
	const [op1, op2, op3] = l.validate.parse(data)
	if (!env.hasDevice(await env.getAlias(op2))) {
		throw new SyntaxError(`Device ${await env.getAlias(op2)} not found`, "error", await env.getPosition())
	}
	await env.set(op1, await env.get(`${env.getAlias(op2)}.${env.getAlias(op3)}`))
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
lb.validate = z.tuple([Ralias, Hash, Logic, Ralias])
const lbn: icPartialInstruction = async (env, data) => {
	const [register, hash, name, logic, mode] = lbn.validate.parse(data)
	const values: number[] = await env.getDeviceByHashAndName(await env.get(hash), await env.get(name), logic)
	await action(env, register, mode, values)
}
lbn.validate = z.tuple([Ralias, Hash, Hash, Logic, Ralias])
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
}

export default device