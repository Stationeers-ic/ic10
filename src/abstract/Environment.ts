import { Line } from "../core/Line"
import EventEmitter from "eventemitter3"
import { AnyFunctionName, Register } from "../ZodTypes"
import { Err } from "./Err"
import { FunctionData } from "../functions"

type EnvironmentEvents = {
	error: (err: Err) => void
	warn: (err: Err) => void
	info: (err: Err) => void
	debug: (err: Err) => void
}
type BeforeFunction = Record<`before_${AnyFunctionName}`, (data: FunctionData, line: Line) => void>
type AfterFunction = Record<`after_${AnyFunctionName}`, (data: FunctionData, line: Line) => void>

type EventNames = EnvironmentEvents & BeforeFunction & AfterFunction

/*
 * Окружение для интерпретатора
 * Хранит все данные необходимые для интерпретации
 */
export abstract class Environment extends EventEmitter<EventNames, Environment> {
	/*
	 * Тестовый режим
	 */
	public isTest: boolean = false

	public InfiniteLoopLimit: number = 500
	public errors: Err[] = []
	public errorCounter: number = 0

	abstract addLine(line: Line | null): void

	abstract setLine(index: number, line: Line): void

	/**
	 * Получить строку по индексу
	 *
	 *  - *null* - пустая строка
	 *  - *undefined* - строка не существует
	 * @param index
	 */
	abstract getLine(index: number): Line | null | undefined

	abstract getLines(): (Line | null)[]

	abstract getPosition(): number

	abstract setPosition(index: number): void

	abstract addPosition(modify: number): void

	/**
	 * Добавить устройство в окружение возвращает Уникальный id uuid устройства
	 */
	abstract appendDevice(hash: number, name?: number): string

	/**
	 * Убрать устройство из окружения
	 */
	abstract removeDevice(id: string): void

	/**
	 * Подключить устройство к порту
	 */
	abstract attachDevice(id: string, port: string): string

	/**
	 * Отключить устройство от порта
	 */
	abstract detachDevice(id: string): void

	public getCurrentLine(): Line | null | undefined {
		return this.getLine(this.getPosition())
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
		err.lineStart = err.lineStart ?? this.getPosition()
		this.errors.push(err)
		if (err.level === "error") this.errorCounter++
		this.emit(err.level, err)
	}

	// Самоуничтожение
	abstract hcf(): void

	async beforeLineRun(line: Line) {}

	async afterLineRun(line: Line) {}

	dynamicDevicePort(string: string): string {
		if (string.startsWith("dr") && string.length <= 4) {
			const register = Register.parse(string.slice(1))
			return `d${this.get(register)}`
		}
		return string
	}

	on<T extends EventEmitter.EventNames<EventNames>>(event: T, fn: EventEmitter.EventListener<EventNames, T>): this {
		return super.on(event, fn, this)
	}

	addListener<T extends EventEmitter.EventNames<EventNames>>(
		event: T,
		fn: EventEmitter.EventListener<EventNames, T>,
	): this {
		return super.addListener(event, fn, this)
	}

	once<T extends EventEmitter.EventNames<EventNames>>(event: T, fn: EventEmitter.EventListener<EventNames, T>): this {
		return super.once(event, fn, this)
	}

	removeListener<T extends EventEmitter.EventNames<EventNames>>(
		event: T,
		fn?: EventEmitter.EventListener<EventNames, T>,
	): this {
		return super.removeListener(event, fn, this)
	}
}

export default Environment
