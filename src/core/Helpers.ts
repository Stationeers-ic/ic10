import type Environment from "../abstract/Environment"
import { dynamicDevice, dynamicDeviceGroups, dynamicRegisterGroups, dynamicRegisterReg } from "../regexps"

type PathFor = (env: Environment, string: string) => string
type PathForAsync = (env: Environment, string: string) => Promise<string>

const pathFor_DynamicDevicePortAsync: PathForAsync = async (env: Environment, string: string) => {
	if (dynamicDevice.test(string)) {
		const { rr } = dynamicDeviceGroups.parse(dynamicDevice.exec(string)?.groups)
		const r = await pathFor_DynamicRegisterAsync(env, rr)
		return `d${await env.get(r)}`
	}
	return string
}

const pathFor_DynamicRegisterAsync: PathForAsync = async (env: Environment, string: string) => {
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

const pathFor_DynamicDevicePort: PathFor = (env: Environment, string: string) => {
	if (dynamicDevice.test(string)) {
		const { rr } = dynamicDeviceGroups.parse(dynamicDevice.exec(string)?.groups)
		const r = pathFor_DynamicRegisterAsync(env, rr) as unknown as string
		return `d${env.get(r)}`
	}
	return string
}

const pathFor_DynamicRegister: PathFor = (env: Environment, string: string) => {
	if (dynamicRegisterReg.test(string)) {
		const { first, rr } = dynamicRegisterGroups.parse(dynamicRegisterReg.exec(string)?.groups)
		let next = env.get(first) as number
		for (let i = 1; i < rr.length; i++) {
			next = env.get(`r${next}`) as number
		}
		return `r${next}`
	}
	return string
}

const pathFor_PortWithConnection: PathFor = (_env: Environment, string: string) => {
	const p = PortWithConnection(string)
	if (p.connection) {
		string = `${p.port}.Connection.${p.connection}`
	}
	return string
}

const PortWithConnection = (
	port: string,
): {
	port: string
	connection: null | string
} => {
	let connection = null
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
	pathFor_DynamicRegister,
	pathFor_DynamicDevicePortAsync,
	pathFor_DynamicRegisterAsync,
	PortWithConnection,
	pathFor_PortWithConnection,
}
