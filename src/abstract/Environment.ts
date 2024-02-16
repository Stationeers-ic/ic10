import { Line } from "../core/Line"
import EventEmitter from "eventemitter3"
import { Register } from "../ZodTypes"

export abstract class Environment extends EventEmitter {
	public line: number = 0
	public InfiniteLoopLimit: number = 500

	abstract jump(line: string | number): void

	abstract get(name: string | number): number

	abstract set(name: string, value: number): void

	abstract push(name: string | number): void

	abstract pop(): number

	abstract peek(): number

	//Проверить подключено ли устройство к порту
	abstract hasDevice(name: string): boolean

	// получить устройство по имени
	abstract getDeviceByHash(hash: number): string[]

	// получить устройство по хэшу и имени
	abstract getDeviceByHashAndName(hash: number, name: number): string[]

	// создать alias, если alias существует, то перезаписать его
	abstract alias(alias: string, value: string | number): void

	// получить alias если существует иначе вернуть значение
	abstract getAlias(alias: string): string

	// Самоуничтожение
	abstract hcf(): void

	afterLineRun(line: Line) {
	}

	dynamicDevicePort(string: string): string {
		if (string.startsWith("dr") && string.length <= 4) {
			const register = Register.parse(string.slice(1))
			return `d${this.get(register)}`
		}
		return string
	}
}
