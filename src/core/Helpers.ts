import { dynamicDevice, dynamicDeviceGroups, dynamicRegisterGroups, dynamicRegisterReg } from "../regexps"
import Environment from "../abstract/Environment"

async function dynamicDevicePortAsync(env: Environment, string: string) {
	if (dynamicDevice.test(string)) {
		const { rr } = dynamicDeviceGroups.parse(dynamicDevice.exec(string)?.groups)
		const r = await dynamicRegisterAsync(env, rr)
		return `d${await env.get(r)}`
	}
	return string
}

async function dynamicRegisterAsync(env: Environment, string: string) {
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

function dynamicDevicePort(env: Environment, string: string) {
	if (dynamicDevice.test(string)) {
		const { rr } = dynamicDeviceGroups.parse(dynamicDevice.exec(string)?.groups)
		const r = dynamicRegisterAsync(env, rr) as unknown as string
		return `d${env.get(r)}`
	}
	return string
}

function dynamicRegister(env: Environment, string: string) {
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

export { dynamicDevicePort, dynamicRegister, dynamicDevicePortAsync, dynamicRegisterAsync }
