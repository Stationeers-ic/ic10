import { Line } from "../core/Line"
import EventEmitter from "eventemitter3"
import { Register } from "../ZodTypes"
import { Err } from "./Err"

declare interface EnvironmentEvents {
	error: (err: Err) => void
	warn: (err: Err) => void
	info: (err: Err) => void
	debug: (err: Err) => void
}

/*
 * Окружение для интерпретатора
 * Хранит все данные необходимые для интерпретации
 */
export abstract class Environment extends EventEmitter<EnvironmentEvents> {
	/*
	 * Текущая строка
	 */
	public line: number = 0
	/*
	 * Все строки текущего выполнения
	 */
	public lines: Map<number, Line> = new Map<number, Line>()
	public InfiniteLoopLimit: number = 500
	public errors: Err[] = []

	public getLine(index: number) {
		return this.lines.get(index)
	}

	public getCurrentLine() {
		return this.lines.get(this.line)
	}

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

	throw(err: Err) {
		err.lineStart = err.lineStart ?? this.line
		this.errors.push(err)
		this.emit(err.level, err)
	}

	// Самоуничтожение
	abstract hcf(): void

	async afterLineRun(line: Line) {}

	dynamicDevicePort(string: string): string {
		if (string.startsWith("dr") && string.length <= 4) {
			const register = Register.parse(string.slice(1))
			return `d${this.get(register)}`
		}
		return string
	}

	on<T extends EventEmitter.EventNames<EnvironmentEvents>>(
		event: T,
		fn: EventEmitter.EventListener<EnvironmentEvents, T>,
	): this {
		return super.on(event, fn, this)
	}

	addListener<T extends EventEmitter.EventNames<EnvironmentEvents>>(
		event: T,
		fn: EventEmitter.EventListener<EnvironmentEvents, T>,
	): this {
		return super.addListener(event, fn, this)
	}

	once<T extends EventEmitter.EventNames<EnvironmentEvents>>(
		event: T,
		fn: EventEmitter.EventListener<EnvironmentEvents, T>,
	): this {
		return super.once(event, fn, this)
	}

	removeListener<T extends EventEmitter.EventNames<EnvironmentEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<EnvironmentEvents, T>,
	): this {
		return super.removeListener(event, fn, this)
	}
}


