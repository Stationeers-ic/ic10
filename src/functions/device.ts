import { icFunction } from "../functions"
import { z } from "zod"
import {
	DeviceOrAlias,
	Hash,
	Logic,
	Ralias,
	RaliasOrValue,
	RaliasOrValuePositive,
	SlotIndex,
	StringOrNumberOrNaN,
} from "../ZodTypes"
//    /*
//     * @ls@
//     * [en] Read value op4 from slot op3 of port op2
//     * [ru] Чтение из устройства op2, слота op3, параметра op4 в регистр op1
//     */
//     const ls = (register: string, device: string, slot: string, property: string) => {
//         const r = scope.memory.getRegister(register)
//         const d = scope.memory.getDevice(device)
//         r.value = d.getSlot(scope.memory.getValue(slot), property) as number
//     }
export const device: Record<string, icFunction> = {
	s: (env, data) => {
		const [op1, op2, op3] = z.tuple([DeviceOrAlias, Logic, Ralias]).parse(data)
		env.set(`${env.getAlias(op1)}.${env.getAlias(op2)}`, env.get(op3))
	},
	l: (env, data) => {
		const [op1, op2, op3] = z.tuple([Ralias, DeviceOrAlias, Logic]).parse(data)
		env.set(op1, env.get(`${env.getAlias(op2)}.${env.getAlias(op3)}`))
	},
	ls: (env, data) => {
		const [register, device, slot, property] = z.tuple([Ralias, DeviceOrAlias, SlotIndex, Logic]).parse(data)
		env.set(register, env.get(`${device}.slots.${slot}.${property}`))
	},

	sb: (env, data) => {
		const [hash, logic, register] = z.tuple([Hash, Logic, Ralias]).parse(data)
		env.getDeviceByHash(env.get(hash)).forEach((d) => {
			env.set(`${d}.${logic}`, env.get(register))
		})
	},
	lb: (env, data) => {
		const [register, hash, logic, mode] = z.tuple([Ralias, Hash, Logic, Ralias]).parse(data)
		const values: number[] = []
		env.getDeviceByHash(env.get(hash)).forEach((d) => {
			values.push(env.get(`${d}.${logic}`))
		})
		switch (env.get(mode)) {
			case 0:
				env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
				break
			case 1:
				env.set(
					register,
					values.reduce((partial_sum, a) => partial_sum + a, 0),
				)
				break
			case 2:
				env.set(register, Math.min(...values))
				break
			case 3:
				env.set(register, Math.max(...values))
				break
		}
	},
	lbn: (env, data) => {
		const [register, hash, name, logic, mode] = z.tuple([Ralias, Hash, Hash, Logic, Ralias]).parse(data)
		const values: number[] = []
		env.getDeviceByHashAndName(env.get(hash), env.get(name)).forEach((d) => {
			values.push(env.get(`${d}.${logic}`))
		})
		switch (env.get(mode)) {
			case 0:
				env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
				break
			case 1:
				env.set(
					register,
					values.reduce((partial_sum, a) => partial_sum + a, 0),
				)
				break
			case 2:
				env.set(register, Math.min(...values))
				break
			case 3:
				env.set(register, Math.max(...values))
				break
		}
	},
	lr: (env, data) => {
		const [register, device, reagentMode, hash] = z.tuple([Ralias, DeviceOrAlias, RaliasOrValue, Hash]).parse(data)
		env.set(register, env.get(`${device}.reagents.${reagentMode}.${hash}`))
	},
	sbn: (env, data) => {
		const [hash, name, logic, register] = z.tuple([Hash, Hash, Logic, RaliasOrValue]).parse(data)
		env.getDeviceByHashAndName(env.get(hash), env.get(name)).forEach((d) => {
			env.set(`${d}.${logic}`, env.get(register))
		})
	},
	lbs: (env, data) => {
		const [register, hash, slot, logic, mode] = z
			.tuple([z.string(), StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
			.parse(data)
		const values: number[] = []
		env.getDeviceByHash(env.get(hash)).forEach((d) => {
			values.push(env.get(`${d}.slots.${slot}.${logic}`))
		})
		switch (env.get(mode)) {
			case 0:
				env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
				break
			case 1:
				env.set(
					register,
					values.reduce((partial_sum, a) => partial_sum + a, 0),
				)
				break
			case 2:
				env.set(register, Math.min(...values))
				break
			case 3:
				env.set(register, Math.max(...values))
				break
		}
	},
	lbns: (env, data) => {
		const [register, hash, name, slot, logic, mode] = z
			.tuple([
				z.string(),
				StringOrNumberOrNaN,
				StringOrNumberOrNaN,
				StringOrNumberOrNaN,
				StringOrNumberOrNaN,
				StringOrNumberOrNaN,
			])
			.parse(data)
		const values: number[] = []
		env.getDeviceByHashAndName(env.get(hash), env.get(name)).forEach((d) => {
			values.push(env.get(`${d}.slots.${slot}.${logic}`))
		})
		switch (env.get(mode)) {
			case 0:
				env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
				break
			case 1:
				env.set(
					register,
					values.reduce((partial_sum, a) => partial_sum + a, 0),
				)
				break
			case 2:
				env.set(register, Math.min(...values))
				break
			case 3:
				env.set(register, Math.max(...values))
				break
		}
	},
	ss: (env, data) => {
		const [device, slot, property, value] = z.tuple([DeviceOrAlias, SlotIndex, Logic, RaliasOrValue]).parse(data)
		env.set(`${device}.slots.${slot}.${property}`, env.get(value))
	},
	sbs: (env, data) => {
		const [hash, slot, property, value] = z
			.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, z.string(), StringOrNumberOrNaN])
			.parse(data)
		env.getDeviceByHash(env.get(hash)).forEach((d) => {
			env.set(`${d}.slots.${slot}.${property}`, env.get(value))
		})
	},
}
