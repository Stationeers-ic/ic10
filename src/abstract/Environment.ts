import type Line from "../core/Line"
import type { AnyInstructionName } from "../ZodTypes"
import type Err from "./Err"
import type { InstructionData } from "../instructions/types"
import EventEmitter from "eventemitter3"
import Interpreter from "./Interpreter" // {

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

	abstract addLine(line: Line<Interpreter<Environment>> | null): Promise<this> | this

	abstract setLine(index: number, line: Line<Interpreter<Environment>>): Promise<this> | this

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

	/**
	 * @deprecated //TODO: make description
	 */
	abstract get(name: string | number): Promise<number> | number
	/**
	 * @deprecated //TODO: make description
	 */
	abstract set(name: string, value: number): Promise<this> | this

	abstract ic_push(name: string | number): Promise<this> | this

	abstract ic_pop(): Promise<number> | number

	abstract ic_peek(): Promise<number> | number

	abstract ic_putd(id: string, index: number, value: number): Promise<this> | this

	abstract ic_put(port: string, index: number, value: number): Promise<this> | this

	abstract ic_getd(id: string, index: number): Promise<number> | number

	abstract ic_get(port: string, index: number): Promise<number> | number

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
	 * @param hash PrefabHash
	 * @param name NameHash
	 * @param id unique id for all env
	 */
	abstract appendDevice(hash: number, name?: number, id?: number): Promise<string> | string

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
	abstract isPortConnected(port: string): Promise<boolean> | boolean

	abstract hasDevice(id: string): Promise<boolean> | boolean

	abstract setDeviceProp(id: string, path: string, value: number): Promise<this> | this

	abstract getDeviceProp(id: string, path: string): Promise<number> | number

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
