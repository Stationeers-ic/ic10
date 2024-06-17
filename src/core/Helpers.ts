import type Environment from "../abstract/Environment"
import { dynamicDevice, dynamicDeviceGroups, dynamicRegisterGroups, dynamicRegisterReg } from "../regexps"

type PathFor = (env: Environment<any>, string: string) => string
type PathForAsync = (env: Environment<any>, string: string) => Promise<string>

const pathFor_DynamicDevicePortAsync: PathForAsync = async (env, string) => {
	if (dynamicDevice.test(string)) {
		const { rr } = dynamicDeviceGroups.parse(dynamicDevice.exec(string)?.groups)
		const r = await pathFor_DynamicRegisterAsync(env, rr)
		return `d${await env.get(r)}`
	}
	return string
}

const pathFor_DynamicRegisterAsync: PathForAsync = async (env, string) => {
	if (dynamicRegisterReg.test(string)) {
		const { first, rr } = dynamicRegisterGroups.parse(dynamicRegisterReg.exec(string)?.groups)
		let next = await env.get(first)
		for (let i = 1; i < rr.length; i++) {
			next = await env.get(`r${next}`)
		}
		return `r${next}`
	}
	return string
}

const pathFor_DynamicDevicePort: PathFor = (env, string) => {
	if (dynamicDevice.test(string)) {
		const { rr } = dynamicDeviceGroups.parse(dynamicDevice.exec(string)?.groups)
		// FIXME: wtf is this
		const r = pathFor_DynamicRegister(env, rr) as unknown as string
		return `d${env.get(r)}`
	}
	return string
}

const pathFor_DynamicRegister: PathFor = (env, string) => {
	if (dynamicRegisterReg.test(string)) {
		const { first, rr } = dynamicRegisterGroups.parse(dynamicRegisterReg.exec(string)?.groups)
		// FIXME: fix as
		let next = env.get(first) as number
		for (let i = 1; i < rr.length; i++) {
			// FIXME: fix as
			next = env.get(`r${next}`) as number
		}
		return `r${next}`
	}
	return string
}

const pathFor_PortWithConnection: PathFor = (_env, string) => {
	const p = PortWithConnection(string)
	if (p.connection) {
		string = `${p.port}.Connection.${p.connection}`
	}
	return string
}

const PortWithConnection = (port: any): { port: string; connection: null | string } => {
	let connection = null
	if (typeof port !== "string") {
		return {
			port,
			connection,
		}
	}
	if (port.includes(":")) {
		;[port, connection] = port.split(":")
	}
	return {
		port,
		connection,
	}
}

/**
 * Функция преобразующие аргумент в путь в памяти
 */
export {
	pathFor_DynamicDevicePort,
	pathFor_DynamicDevicePortAsync,
	pathFor_DynamicRegister,
	pathFor_DynamicRegisterAsync,
	pathFor_PortWithConnection,
	PortWithConnection,
}
