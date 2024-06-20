// noinspection SuspiciousTypeOfGuard

import { v4 as uuid } from "uuid"
import { z } from "zod"
import { ChipHousing, isChipHousing } from "../abstract/ChipHousing"
import { Device, Name, PrefabHash } from "../abstract/Device"
import Environment from "../abstract/Environment"
import type Err from "../abstract/Err"
import EnvError from "../errors/EnvError"
import SyntaxError from "../errors/SyntaxError"
import { hash as Hash } from "../index"
import { getProperty, setProperty } from "../tools/property"
import { CoerceValue, NotReservedWord, NumberOrNan, StringOrNumberOrNaN, Device as zodDevice } from "../ZodTypes"
import consts from "./../data/consts.json"
import { DevChipHousing, DevDevice } from "./DevDevice"
import {
	pathFor_DynamicDevicePort,
	pathFor_DynamicRegister,
	pathFor_PortWithConnection,
	PortWithConnection,
} from "./Helpers"
import type Line from "./Line"

const ZodDevice = z.union([
	z.record(z.number()),
	z.record(z.record(z.number())),
	z.record(z.record(z.record(z.number()))),
])
type ZodDevice = z.infer<typeof ZodDevice>

/**
 * An environment without checks, which simply saves as it is
 */
export class DevEnv<E extends Record<string, Function> = {}> extends Environment<E> {
	/**
	 * Current line
	 */
	public line: number = 0
	/**
	 * All lines of current execution
	 */
	public lines: Array<Line | null> = []
	public errors: Err[] = []
	public errorCounter: number = 0
	public devices: Map<string, Device> = new Map()
	/**
	 * @deprecated
	 */
	public devicesAttached: Map<string, string> = new Map()
	public data: Record<string, any> = {}
	public stack: number[] = new Array(512).fill(0)
	public aliases = new Map<string, string | number>()
	public constants = new Map<string, number>()
	public chipHousing!: ChipHousing

	constructor(data: { [key: string]: number } | ChipHousing = {}) {
		super()
		if (isChipHousing(data)) {
			this.chipHousing = data
		} else {
			this.chipHousing = new DevChipHousing(data.ReferenceId ?? Hash(uuid()))
			Object.entries(data).forEach(([key, value]) => {
				this.set(key, value)
			})
		}
		this.setDefault()
		const id = this.appendDevice(this.chipHousing)
		this.attachDevice(id, "db")
	}

	setDefault() {
		this.alias("sp", "r16")
		this.alias("ra", "r17")

		this.shadowDefine("Average", 0)
		this.shadowDefine("Sum", 1)
		this.shadowDefine("Minimum", 2)

		this.shadowDefine("rad2deg", 57.295780181884766)
		this.shadowDefine("deg2rad", 0.01745329238474369)
		this.shadowDefine("ninf", -Infinity)
		this.shadowDefine("pinf", Infinity)
		this.shadowDefine("pi", 3.1415926535897931)
		this.shadowDefine("epsilon", 4.94065645841247e-324)
		this.shadowDefine("nan", NaN)
		Object.entries(consts).forEach(([key, value]) => {
			if (typeof value === "number") {
				this.shadowDefine(key, value)
			}
		})
	}

	getDevices() {
		return this.devices
	}

	getCurrentLine(): Line | null | undefined {
		return this.getLine(this.getPosition())
	}

	addLine(line: Line | null): this {
		this.lines.push(line)
		return this
	}

	setLine(index: number, line: Line): this {
		this.lines[index] = line
		return this
	}

	getLine(index: number): Line | null | undefined {
		return this.lines[index]
	}

	getPosition(): number {
		return this.line
	}

	addPosition(modify: number): this {
		this.line += modify
		return this
	}

	setPosition(index: number): this {
		this.line = index
		return this
	}

	appendDevice(hash: number | Device, name?: number, id?: number): string {
		let device: Device
		if (Device.is(hash)) {
			device = hash
		} else {
			device = new DevDevice(id ?? Hash(uuid()))
			device.PrefabHash = PrefabHash.fromNumber(hash)
			if (name) device.Name = Name.fromNumber(name)
		}
		if (!device.ReferenceId) {
			id = id ?? Hash(uuid())
			device.ReferenceId = id
		} else {
			id = device.ReferenceId
		}
		const stringId = id.toString()
		if (this.devices.has(stringId)) {
			this.throw(new EnvError(`Device ${stringId} already exists`, "error"))
			return stringId
		}
		this.devices.set(stringId, device)
		return stringId
	}

	removeDevice(id: string): this {
		const d = this.devices.get(id)
		this.detachDevice(id)
		if (d) {
			this.devices.delete(id)
		}
		return this
	}

	attachDevice(id: string, port: string): this {
		if (this.chipHousing.isPortConnected(port)) {
			this.chipHousing.detachDevice(port)
		}
		this.chipHousing.attachDevice(port, this.devices.get(id)!)
		this.devicesAttached.set(port, id)
		return this
	}

	detachDevice(id: string): this {
		const port = this.chipHousing.getPort(this.devices.get(id)!)
		if (port && this.chipHousing.isPortConnected(port)) {
			this.chipHousing.detachDevice(port)
			this.devicesAttached.delete(`d${port}`)
		}
		return this
	}
	/**
	 * @deprecated
	 */
	get(name: string | number): number {
		if (typeof name === "number") return name
		if (this.constants.has(name)) return NumberOrNan.parse(this.constants.get(name))
		const x = CoerceValue.safeParse(name)
		if (x.success) return x.data
		if (this.aliases.has(name)) {
			return NumberOrNan.parse(this.get(StringOrNumberOrNaN.parse(this.aliases.get(name))))
		}
		name = pathFor_DynamicRegister(this, name)
		name = pathFor_DynamicDevicePort(this, name)
		name = pathFor_PortWithConnection(this, name)

		if (zodDevice.safeParse(name.split(".")[0]).success) {
			let [port, a, b, c, d] = name.split(".")
			port = pathFor_DynamicDevicePort(this, port)
			const id = z.string().parse(this.devicesAttached.get(port))
			const path = [a, b, c, d].filter((i) => i !== undefined).join(".")
			console.log(path)
			return this.getDeviceProp(id, path)
		}
		return NumberOrNan.parse(getProperty(this.data, name) ?? 0)
	}
	/**
	 * @deprecated
	 */
	set(name: string, value: number): this {
		if (this.aliases.has(name)) {
			name = NotReservedWord.parse(this.aliases.get(name))
		}
		name = pathFor_DynamicRegister(this, name)
		name = pathFor_DynamicDevicePort(this, name)
		name = pathFor_PortWithConnection(this, name)

		if (zodDevice.safeParse(name.split(".")[0]).success) {
			let [port, a, b, c, d] = name.split(".")
			port = pathFor_DynamicDevicePort(this, port)
			const id = z.string().parse(this.devicesAttached.get(port))
			const path = [a, b, c, d].filter((i) => i !== undefined).join(".")
			this.setDeviceProp(id, path, value)
			return this
		}
		setProperty(this.data, name, value)
		return this
	}

	alias(name: string, value: string): this {
		let result = NotReservedWord.safeParse(name)
		if (result.success) {
			this.aliases.set(name, value)
		} else if (!this.aliases.has(name)) {
			this.aliases.set(name, value)
		} else {
			this.throw(new SyntaxError(`Alias ${name} already exists`, "error", this.line))
		}
		this.chipHousing.memory.setAlias(name, value)
		return this
	}

	define(name: string, value: number): this {
		let result = NotReservedWord.safeParse(name)
		if (result.success) {
			this.aliases.set(name, value)
		} else if (!this.aliases.has(name)) {
			this.aliases.set(name, value)
		} else {
			this.throw(new SyntaxError(`Constant ${name} already exists`, "error", this.line))
		}
		this.chipHousing.memory.set("const", name, value)
		return this
	}

	shadowDefine(name: string, value: number): this {
		if (!this.constants.has(name)) {
			this.constants.set(name, value)
		}
		return this
	}

	label(name: string, value: number): this {
		let result = NotReservedWord.safeParse(name)
		if (result.success) {
			this.aliases.set(name, value)
		} else if (!this.aliases.has(name)) {
			this.aliases.set(name, value)
		} else {
			this.throw(new SyntaxError(`Label ${name} already exists`, "error", this.line))
		}
		this.chipHousing.memory.set("label", name, value)
		return this
	}

	jump(line: string | number): this {
		const oldLine = this.line
		if (typeof line === "number") {
			this.setPosition(line)
		} else {
			this.setPosition(this.get(line))
		}
		if (oldLine === this.line) {
			this.throw(new SyntaxError(`Jump to the same line ${this.line} is not allowed`, "error", this.line))
		}
		return this
	}

	stackPeek(): number {
		let sp = z.number().min(0).max(512).parse(this.get("sp"))
		const val = this.chipHousing.stack.get(sp - 1)
		return z.number().parse(val)
	}

	stackPop(): number {
		let sp = z.number().min(0).max(512).parse(this.get("sp"))
		const val = this.chipHousing.stack.get(--sp)
		this.set("sp", sp)
		return z.number().parse(val)
	}

	stackPush(name: string | number): this {
		let sp = z.number().min(0).max(512).parse(this.get("sp"))
		this.chipHousing.stack.put(sp++, this.get(name))

		this.set("sp", sp)
		return this
	}

	stackDevicePut(id: string, index: number, value: number): this {
		if (index < 0 || index >= 512) {
			this.throw(new SyntaxError(`Index ${index} out of bounds`, "error", this.line))
			return this
		}
		this.devices.get(id)?.stack.put(index, value)
		return this
	}

	stackPut(port: string, index: number, value: number): this {
		port = zodDevice.parse(port)
		if (index < 0 || index >= 512) {
			this.throw(new SyntaxError(`Index ${index} out of bounds`, "error", this.line))
			return this
		}
		this.chipHousing.getDevice(port).stack.put(index, value) ?? 0
		return this
	}

	stackDeviceGet(id: string, index: number): number {
		if (index < 0 || index >= 512) {
			this.throw(new SyntaxError(`Index ${index} out of bounds`, "error", this.line))
			return 0
		}
		return this.devices.get(id)?.stack.get(index) ?? 0
	}

	stackGet(port: zodDevice, index: number): number {
		port = zodDevice.parse(port)
		if (index < 0 || index >= 512) {
			this.throw(new SyntaxError(`Index ${index} out of bounds`, "error", this.line))
			return 0
		}
		return this.chipHousing.getDevice(port).stack.get(index) ?? 0
	}
	/**
	 * @deprecated
	 */
	getAlias(alias: string): string {
		if (this.aliases.has(alias)) {
			const val = this.aliases.get(alias)
			if (z.string().safeParse(val).success) {
				return val as string
			}
		}
		return alias
	}
	/**
	 * @deprecated
	 */
	isPortConnected(port: string): boolean {
		const p = PortWithConnection(port)
		const p2 = pathFor_DynamicDevicePort(this, p.port)
		return this.devicesAttached.has(p2)
	}

	hcf(): this {
		console.log("Died")
		this.jump(this.getLines().length)
		return this
	}

	getLines(): (Line | null)[] {
		return this.lines
	}
	/**
	 * @deprecated
	 */
	getDeviceByHash(hash: number, logic: string): number[] {
		const output = Array.from(this.devices)
			.filter(([, device]) => {
				return device.PrefabHash?.number === hash
			})
			.map(([, device]) => getProperty(device, logic))
			.filter((i) => typeof i === "number")
		return z.array(z.number()).parse(output)
	}
	/**
	 * @deprecated
	 */
	getDeviceByHashAndName(hash: number, name: number, logic: string): number[] {
		const output = Array.from(this.devices)
			.filter(([, device]) => {
				return device.PrefabHash?.number === hash && device.Name?.number === name
			})
			.map(([, device]) => device.getProperty(logic))

			.filter((i) => typeof i === "number")
		return z.array(z.number()).parse(output)
	}
	/**
	 * @deprecated
	 */
	getSlotDeviceByHash(hash: number, slot: number, logic: string): number[] {
		const output = Array.from(this.devices)
			.filter(([, device]) => {
				return device.PrefabHash?.number === hash
			})
			.map(([, device]) => getProperty(device, "Slots." + slot + "." + logic))
			.filter((i) => typeof i === "number")
		return z.array(z.number()).parse(output)
	}
	/**
	 * @deprecated
	 */
	getSlotDeviceByHashAndName(hash: number, name: number, slot: number, logic: string): number[] {
		const output = Array.from(this.devices)
			.filter(([, device]) => {
				return device.PrefabHash?.number === hash && device.Name?.number === name
			})
			.map(([, device]) => getProperty(device, "Slots." + slot + "." + logic))
			.filter((i) => typeof i === "number")
		return z.array(z.number()).parse(output)
	}
	/**
	 * @deprecated
	 */
	setDeviceByHash(hash: number, logic: string, value: number): this {
		const devices = Array.from(this.devices).filter(([, device]) => {
			return device.PrefabHash?.number === hash
		})
		devices.forEach(([, device]) => {
			setProperty(device, logic, value)
		})
		return this
	}
	/**
	 * @deprecated
	 */
	setDeviceByHashAndName(hash: number, name: number, logic: string, value: number): this {
		const devices = Array.from(this.devices).filter(([, device]) => {
			return device.PrefabHash?.number === hash && device.Name?.number === name
		})
		devices.forEach(([, device]) => {
			setProperty(device, logic, value)
		})
		return this
	}
	/**
	 * @deprecated
	 */
	setSlotDeviceByHash(hash: number, slot: number, logic: string, value: number): this {
		const devices = Array.from(this.devices).filter(([, device]) => {
			return device.PrefabHash?.number === hash
		})
		devices.forEach(([, device]) => {
			setProperty(device, "Slots." + slot + "." + logic, value)
		})
		return this
	}

	throw(err: Err): this {
		err.lineStart = err.lineStart ?? this.getPosition()
		this.errors.push(err)
		if (err.level === "error") this.errorCounter++
		// @ts-ignore Type 'string' is not assignable to type...
		this.emit(err.level, err)
		return this
	}

	getErrorCount(): number {
		return this.errorCounter
	}

	getErrors(): Err[] {
		return this.errors
	}
	/**
	 * @deprecated
	 */
	hasDevice(id: string): boolean {
		return this.devices.has(id)
	}
	/**
	 * @deprecated
	 */
	getDeviceProp(id: string, path: string): number {
		const device = this.devices.get(id)
		if (device === undefined) {
			this.throw(new SyntaxError(`Device with id "${id}" not found`, "error", this.line))
			return 0
		}
		return NumberOrNan.parse(getProperty(device, path) ?? 0)
	}
	/**
	 * @deprecated
	 */
	setDeviceProp(id: string, path: string, value: number): this {
		const device = this.devices.get(id)
		if (device === undefined) {
			this.throw(new SyntaxError(`Device with id "${id}" not found`, "error", this.line))
			return this
		}
		setProperty(device, path, value)
		return this
	}

	setDevice(aliasOrPortOrPortWithChanel: string, logic: string, value: number): Promise<this> | this {
		let PortOrPortWithChanel = aliasOrPortOrPortWithChanel
		if (this.chipHousing.memory.hasAlias(aliasOrPortOrPortWithChanel)) {
			PortOrPortWithChanel = this.chipHousing.memory.getAlias(aliasOrPortOrPortWithChanel)
		}
		if (PortOrPortWithChanel.includes(":")) {
			//chanel
			const [device, chanel] = PortOrPortWithChanel.split(":")
			this.chipHousing.getDevice(device).setChannel(~~chanel, logic, value)
		} else {
			//device
			this.chipHousing.getDevice(PortOrPortWithChanel).setProperty(logic, value)
		}
		return this
	}
	getDevice(aliasOrPortOrPortWithChanel: string, logic: string): Promise<number> | number {
		let PortOrPortWithChanel = aliasOrPortOrPortWithChanel
		if (this.chipHousing.memory.hasAlias(aliasOrPortOrPortWithChanel)) {
			PortOrPortWithChanel = this.chipHousing.memory.getAlias(aliasOrPortOrPortWithChanel)
		}
		if (PortOrPortWithChanel.includes(":")) {
			//chanel
			const [device, chanel] = PortOrPortWithChanel.split(":")
			return this.chipHousing.getDevice(device).getChannel(~~chanel, logic)
		} else {
			//device
			return this.chipHousing.getDevice(PortOrPortWithChanel).getProperty(logic)
		}
	}
}

export default DevEnv
