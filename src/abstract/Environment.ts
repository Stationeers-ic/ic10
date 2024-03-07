import { Line } from "../core/Line"
import EventEmitter from "eventemitter3"
import { AnyFunctionName } from "../ZodTypes"
import { Err } from "./Err"
import { FunctionData } from "../functions"
import { dynamicDevice, dynamicDeviceGroups, dynamicRegister, dynamicRegisterGroups } from "../regexps"

type EnvironmentEvents = {
	error: (err: Err) => void
	warn: (err: Err) => void
	info: (err: Err) => void
	debug: (err: Err) => void
}
type BeforeFunction = Record<`before_${AnyFunctionName}`, (data: FunctionData, line: Line) => void>
type AfterFunction = Record<`after_${AnyFunctionName}`, (data: FunctionData, line: Line) => void>

type EventNames = EnvironmentEvents & BeforeFunction & AfterFunction

/**
 * Окружение для интерпретатора
 * Хранит все данные необходимые для интерпретации
 */
export abstract class Environment extends EventEmitter<EventNames, Environment> {
	/**
	 * Тестовый режим
	 */
	public isTest: boolean = false

	public InfiniteLoopLimit: number = 500
	public errors: Err[] = []
	public errorCounter: number = 0

	abstract addLine(line: Line | null): this

	abstract setLine(index: number, line: Line): this

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

	abstract setPosition(index: number): this

	abstract addPosition(modify: number): this

	/**
	 * Добавить устройство в окружение возвращает Уникальный id uuid устройства
	 */
	abstract appendDevice(hash: number, name?: number): string

	/**
	 * Убрать устройство из окружения
	 */
	abstract removeDevice(id: string): this

	/**
	 * Подключить устройство к порту
	 */
	abstract attachDevice(id: string, port: string): this

	/**
	 * Отключить устройство от порта
	 */
	abstract detachDevice(id: string): this

	public getCurrentLine(): Line | null | undefined {
		return this.getLine(this.getPosition())
	}

	abstract jump(line: string | number): this

	abstract get(name: string | number): number

	abstract set(name: string, value: number): this

	abstract push(name: string | number): this

	abstract pop(): number

	abstract peek(): number

	/**
	 *  Проверить подключено ли устройство к порту
	 * @param port
	 */
	abstract hasDevice(port: string): boolean

	/**
	 * lb
	 */
	abstract getDeviceByHash(hash: number, logic: string): number[]

	/**
	 * lbn
	 */
	abstract getDeviceByHashAndName(hash: number, name: number, logic: string): number[]

	/**
	 * lbs
	 */
	abstract getSlotDeviceByHash(hash: number, slot: number, logic: string): number[]
	/**
	 * lbns
	 */
	abstract getSlotDeviceByHashAndName(hash: number, name: number, slot: number, logic: string): number[]

	/**
	 * lsb
	 */
	abstract setDeviceByHash(hash: number, logic: string, value: number): this

	abstract setSlotDeviceByHash(hash: number, slot: number, logic: string, value: number): this

	/**
	 * sbn
	 */
	abstract setDeviceByHashAndName(hash: number, name: number, logic: string, value: number): this

	/**
	 * создать alias, если alias существует, то перезаписать его
	 * @param alias
	 * @param value
	 *
	 */
	abstract alias(alias: string, value: string | number): this

	/**
	 * получить alias если существует иначе вернуть значение
	 * @param alias
	 */
	abstract getAlias(alias: string): string

	throw(err: Err) {
		err.lineStart = err.lineStart ?? this.getPosition()
		this.errors.push(err)
		if (err.level === "error") this.errorCounter++
		this.emit(err.level, err)
	}

	/**
	 * Самоуничтожение
	 */
	abstract hcf(): this

	async beforeLineRun(line: Line) {}

	async afterLineRun(line: Line) {}

	/**
	 * Парсинг динамических устройств
	 * - на входе строка drrrrr1
	 * - на выходе строка d1
	 * @param string
	 */
	dynamicDevicePort(string: string): string {
		if (dynamicDevice.test(string)) {
			const { rr } = dynamicDeviceGroups.parse(dynamicDevice.exec(string)?.groups)
			const r = this.dynamicRegister(rr)
			return `d${this.get(r)}`
		}
		return string
	}

	/**
	 * Парсинг динамических регистров
	 *  - на входе строка rrrrrr1
	 *  - на выходе строка r1
	 * @param string
	 */
	dynamicRegister(string: string): string {
		if (dynamicRegister.test(string)) {
			const { first, rr } = dynamicRegisterGroups.parse(dynamicRegister.exec(string)?.groups)
			let next = this.get(first)
			// console.log('-*******************', first)
			for (let i = 1; i < rr.length; i++) {
				next = this.get(`r${next}`)
				// console.log(i+'*******************', `r${next}`)
			}
			// console.log('++++*************', `r${next}`)
			return `r${next}`
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
