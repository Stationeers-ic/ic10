import { icFunction } from "../functions"
import { z } from "zod"
import { DeviceFunctionName, DeviceOrAlias, Hash, Logic, Mode, Ralias, RaliasOrValue, SlotIndex } from "../ZodTypes"
import SyntaxError from "../errors/SyntaxError"
import { Environment } from ".."

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

const s: icFunction = async (env, data) => {
	const [op1, op2, op3] = z.tuple([DeviceOrAlias, Logic, RaliasOrValue]).parse(data)
	if (!env.hasDevice(await env.getAlias(op1))) {
		throw new SyntaxError(`Device ${await env.getAlias(op1)} not found`, "error", await env.getPosition())
	}
	await env.set(`${await env.getAlias(op1)}.${await env.getAlias(op2)}`, await env.get(op3))
}
const l: icFunction = async (env, data) => {
	const [op1, op2, op3] = z.tuple([Ralias, DeviceOrAlias, Logic]).parse(data)
	if (!env.hasDevice(await env.getAlias(op2))) {
		throw new SyntaxError(`Device ${await env.getAlias(op2)} not found`, "error", await env.getPosition())
	}
	await env.set(op1, await env.get(`${env.getAlias(op2)}.${env.getAlias(op3)}`))
}
const ls: icFunction = async (env, data) => {
	const [register, device, slot, property] = z.tuple([Ralias, DeviceOrAlias, SlotIndex, Logic]).parse(data)
	await env.set(register, await env.get(`${device}.Slots.${slot}.${property}`))
}
const sb: icFunction = async (env, data) => {
	const [hash, logic, register] = z.tuple([Hash, Logic, RaliasOrValue]).parse(data)
	env.setDeviceByHash(await env.get(hash), logic, await env.get(register))
}
const sbn: icFunction = async (env, data) => {
	const [hash, name, logic, register] = z.tuple([Hash, Hash, Logic, RaliasOrValue]).parse(data)
	env.setDeviceByHashAndName(await env.get(hash), await env.get(name), logic, await env.get(register))
}
const sbs: icFunction = async (env, data) => {
	const [hash, slot, logic, value] = z.tuple([Hash, RaliasOrValue, Logic, RaliasOrValue]).parse(data)
	env.setSlotDeviceByHash(await env.get(hash), await env.get(slot), logic, await env.get(value))
}
const lb: icFunction = async (env, data) => {
	const [register, hash, logic, mode] = z.tuple([Ralias, Hash, Logic, Ralias]).parse(data)
	const values: number[] = await env.getDeviceByHash(await env.get(hash), logic)
	await action(env, register, mode, values)
}
const lbn: icFunction = async (env, data) => {
	const [register, hash, name, logic, mode] = z.tuple([Ralias, Hash, Hash, Logic, Ralias]).parse(data)
	const values: number[] = await env.getDeviceByHashAndName(await env.get(hash), await env.get(name), logic)
	await action(env, register, mode, values)
}
const lbs: icFunction = async (env, data) => {
	const [register, hash, slot, logic, mode] = z.tuple([Ralias, Hash, RaliasOrValue, Logic, Mode]).parse(data)
	const values: number[] = await env.getSlotDeviceByHash(await env.get(hash), await env.get(slot), logic)
	await action(env, register, mode, values)
}
const lbns: icFunction = async (env, data) => {
	const [register, hash, name, slot, logic, mode] = z
		.tuple([Ralias, Hash, RaliasOrValue, RaliasOrValue, Logic, Mode])
		.parse(data)
	const values: number[] = await env.getSlotDeviceByHashAndName(
		await env.get(hash),
		await env.get(name),
		await env.get(slot),
		logic,
	)
	await action(env, register, mode, values)
}
const lr: icFunction = async (env, data) => {
	const [register, device, reagentMode, hash] = z.tuple([Ralias, DeviceOrAlias, RaliasOrValue, Hash]).parse(data)
	await env.set(register, await env.get(`${device}.Reagents.${reagentMode}.${hash}`))
}
const ss: icFunction = async (env, data) => {
	const [device, slot, property, value] = z.tuple([DeviceOrAlias, SlotIndex, Logic, RaliasOrValue]).parse(data)
	await env.set(`${device}.Slots.${slot}.${property}`, await env.get(value))
}

const device: Record<DeviceFunctionName, icFunction> = {
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
