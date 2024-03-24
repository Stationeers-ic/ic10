import type Line from "../core/Line"
import type { AnyInstructionName } from "../ZodTypes"
import type Err from "./Err"
import type { InstructionData } from "../instructions/types"
import EventEmitter from "eventemitter3"

// {
// error: (err: Err) => void
// warn: (err: Err) => void
// info: (err: Err) => void
// debug: (err: Err) => void
// }
type EnvironmentEvents = Record<"error" | "warn" | "info" | "debug", (err: Err) => void>

type BeforeInstruction = Record<`before_${AnyInstructionName}`, (data: InstructionData, line: Line) => void>
type AfterInstruction = Record<`after_${AnyInstructionName}`, (data: InstructionData, line: Line) => void>

type EventNames = EnvironmentEvents & BeforeInstruction & AfterInstruction

/**
 * Environment for the interpreter
 * Stores all data necessary for interpretation
 */
export abstract class Environment<E extends Record<string, Function> = {}> extends EventEmitter<
	EventNames & E,
	Environment<E>
> {
	/**
	 * is Test mode
	 */
	public isTest: boolean = false
	public InfiniteLoopLimit: number = 500

	abstract addLine(line: Line | null): Promise<this> | this

	abstract setLine(index: number, line: Line): Promise<this> | this

	/**
	 * Get Line by index
	 *
	 *  - *null* - empty line
	 *  - *undefined* - line is not existent
	 * @param {number} index
	 */
	abstract getLine(index: number): Promise<Line | null | undefined> | (Line | null | undefined)

	abstract getLines(): Promise<(Line | null)[]> | (Line | null)[]

	abstract getPosition(): Promise<number> | number

	abstract setPosition(index: number): Promise<this> | this

	abstract addPosition(modify: number): Promise<this> | this

	abstract getCurrentLine(): Promise<Line | null | undefined> | (Line | null | undefined)

	abstract jump(line: string | number): Promise<this> | this

	//Работа с памятью

	abstract get(name: string | number): Promise<number> | number

	abstract set(name: string, value: number): Promise<this> | this

	abstract push(name: string | number): Promise<this> | this

	abstract pop(): Promise<number> | number

	abstract peek(): Promise<number> | number

	/**
	 * создать alias, если alias существует, то перезаписать его
	 * @param alias
	 * @param value
	 *
	 */
	abstract alias(alias: string, value: string): Promise<this> | this

	abstract label(alias: string, value: number): Promise<this> | this
	abstract define(alias: string, value: number): Promise<this> | this

	/**
	 * получить alias если существует иначе вернуть значение
	 * @param alias
	 */
	abstract getAlias(alias: string): Promise<string> | string

	//Работа с устройствами

	/**
	 * Добавить устройство в окружение возвращает Уникальный id uuid устройства
	 */
	abstract appendDevice(hash: number, name?: number): Promise<string> | string

	/**
	 * Убрать устройство из окружения
	 */
	abstract removeDevice(id: string): Promise<this> | this

	/**
	 * Подключить устройство к порту
	 */
	abstract attachDevice(id: string, port: string): Promise<this> | this

	/**
	 * Отключить устройство от порта
	 */
	abstract detachDevice(id: string): Promise<this> | this

	/**
	 *  Проверить подключено ли устройство к порту
	 * @param port
	 */
	abstract hasDevice(port: string): Promise<boolean> | boolean

	/**
	 * lb
	 */
	abstract getDeviceByHash(hash: number, logic: string): Promise<number[]> | number[]

	/**
	 * lbn
	 */
	abstract getDeviceByHashAndName(hash: number, name: number, logic: string): Promise<number[]> | number[]

	/**
	 * lbs
	 */
	abstract getSlotDeviceByHash(hash: number, slot: number, logic: string): Promise<number[]> | number[]

	/**
	 * lbns
	 */
	abstract getSlotDeviceByHashAndName(
		hash: number,
		name: number,
		slot: number,
		logic: string,
	): Promise<number[]> | number[]

	/**
	 * sb
	 */
	abstract setDeviceByHash(hash: number, logic: string, value: number): Promise<this> | this

	/**
	 * sbs
	 */
	abstract setSlotDeviceByHash(hash: number, slot: number, logic: string, value: number): Promise<this> | this

	/**
	 * sbn
	 */
	abstract setDeviceByHashAndName(hash: number, name: number, logic: string, value: number): Promise<this> | this

	/**
	 * Самоуничтожение
	 */
	abstract hcf(): Promise<this> | this

	async beforeLineRun(line: Line) {}

	async afterLineRun(line?: Line) {}

	//Обработка ошибок
	abstract throw(err: Err): Promise<this> | this

	abstract getErrorCount(): Promise<number> | number

	abstract getErrors(): Promise<Err[]> | Err[]

	on<T extends EventEmitter.EventNames<EventNames & E>>(
		event: T,
		fn: EventEmitter.EventListener<EventNames & E, T>,
	): this {
		return super.on(event, fn, this)
	}

	addListener<T extends EventEmitter.EventNames<EventNames & E>>(
		event: T,
		fn: EventEmitter.EventListener<EventNames & E, T>,
	): this {
		return super.addListener(event, fn, this)
	}

	once<T extends EventEmitter.EventNames<EventNames & E>>(
		event: T,
		fn: EventEmitter.EventListener<EventNames & E, T>,
	): this {
		return super.once(event, fn, this)
	}

	removeListener<T extends EventEmitter.EventNames<EventNames & E>>(
		event: T,
		fn?: EventEmitter.EventListener<EventNames & E, T>,
	): this {
		return super.removeListener(event, fn, this)
	}
}

export default Environment
