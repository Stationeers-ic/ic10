import { icFunction } from "../functions"
import { z } from "zod"
import { StringOrNumberOrNaN } from "../ZodTypes"

export const device: Record<string, icFunction> = {
	s: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(), StringOrNumberOrNaN]).parse(data)
		env.set(`${env.getAlias(op1)}.${env.getAlias(op2)}`, env.get(op3))
	},
	l: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(), z.string()]).parse(data)
		env.set(op1, env.get(`${env.getAlias(op2)}.${env.getAlias(op3)}`))
	},

	sb: (env, data) => {
		const [hash, logic, register] = z.tuple([z.string(), z.string(), StringOrNumberOrNaN]).parse(data)
		env.getDeviceByHash(env.get(hash)).forEach((d) => {
			env.set(`${d}.${logic}`, env.get(register))
		})
	},
	lb: (env, data) => {
		const [register, hash, logic, mode] = z.tuple([z.string(), z.string(), z.string(), z.string()]).parse(data)
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
		const [register, hash, name, logic, mode] = z
			.tuple([z.string(), z.string(), z.string(), z.string(), z.string()])
			.parse(data)
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
		const [register, device, reagentMode, hash] = z
			.tuple([z.string(), z.string(), StringOrNumberOrNaN, StringOrNumberOrNaN])
			.parse(data)
		env.set(register, env.get(`${device}.reagents.${reagentMode}.${hash}`))
	},
	sbn: (env, data) => {
		const [hash, name, logic, register] = z
			.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, z.string()])
			.parse(data)
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
		const [device, slot, property, value] = z
			.tuple([z.string(), StringOrNumberOrNaN, z.string(), StringOrNumberOrNaN])
			.parse(data)
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
