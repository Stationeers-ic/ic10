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
// import { getProperty, setProperty } from "../tools/property"
import { NotReservedWord, NumberOrNan, Device as zodDevice } from "../ZodTypes"
import consts from "./../data/consts.json"
import { DevChipHousing, DevDevice } from "./DevDevice"
import { pathFor_DynamicDevicePort, pathFor_DynamicRegister } from "./Helpers"
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
	/**
	 * @deprecated
	 */
	public stack: number[] = new Array(512).fill(0)
	/**
	 * @deprecated
	 */
	public aliases = new Map<string, string | number>()
	/**
	 * @deprecated
	 */
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
		return this
	}

	detachDevice(id: string): this {
		const port = this.chipHousing.getPort(this.devices.get(id)!)
		if (port && this.chipHousing.isPortConnected(port)) {
			this.chipHousing.detachDevice(port)
		}
		return this
	}

	get(name: string | number): number {
		if (typeof name === "number") return name
		name = pathFor_DynamicRegister(this, name)
		return this.chipHousing.memory.get(name)
	}

	set(name: string, value: number): this {
		name = pathFor_DynamicRegister(this, name)
		this.chipHousing.memory.set("ram", name, value)
		return this
	}

	setDevice(aliasOrPortOrPortWithChanelOrId: string, logic: string, value: number): Promise<this> | this {
		if (this.devices.has(aliasOrPortOrPortWithChanelOrId)) {
			this.devices.get(aliasOrPortOrPortWithChanelOrId)?.setProperty(logic, value)
			return this
		}

		let PortOrPortWithChanel = this.chipHousing.memory.getAlias(aliasOrPortOrPortWithChanelOrId)
		if (PortOrPortWithChanel.includes(":")) {
			//chanel
			const [device, chanel] = PortOrPortWithChanel.split(":")
			this.chipHousing.getDevice(device).setChannel(~~chanel, logic, value)
		} else {
			//device
			PortOrPortWithChanel = pathFor_DynamicDevicePort(this, PortOrPortWithChanel)
			this.chipHousing.getDevice(PortOrPortWithChanel).setProperty(logic, value)
		}
		return this
	}
	getDevice(aliasOrPortOrPortWithChanelOrId: string, logic: string): Promise<number> | number {
		if (this.devices.has(aliasOrPortOrPortWithChanelOrId)) {
			return this.devices.get(aliasOrPortOrPortWithChanelOrId)?.getProperty(logic) ?? 0
		}
		let PortOrPortWithChanel = this.chipHousing.memory.getAlias(aliasOrPortOrPortWithChanelOrId)
		if (PortOrPortWithChanel.includes(":")) {
			//chanel
			const [device, chanel] = PortOrPortWithChanel.split(":")
			return this.chipHousing.getDevice(device).getChannel(~~chanel, logic)
		} else {
			//device
			PortOrPortWithChanel = pathFor_DynamicDevicePort(this, PortOrPortWithChanel)
			return this.chipHousing.getDevice(PortOrPortWithChanel).getProperty(logic)
		}
	}

	alias(name: string, value: string): this {
		let result = NotReservedWord.safeParse(name)
		if (!result.success) {
			this.throw(new SyntaxError(`Label ${name} is a reserved word`, "error", this.line))
		}
		this.chipHousing.memory.setAlias(name, value)
		return this
	}

	define(name: string, value: number): this {
		let result = NotReservedWord.safeParse(name)
		if (!result.success) {
			this.throw(new SyntaxError(`Label ${name} is a reserved word`, "error", this.line))
		}
		if (this.chipHousing.memory.getType(name) === "const" && this.get(name) !== value) {
			this.throw(new SyntaxError(`Constant ${name} already exists`, "error", this.line))
		}
		this.chipHousing.memory.set("const", name, value)
		return this
	}

	shadowDefine(name: string, value: number): this {
		this.chipHousing.memory.set("const", name, value)
		return this
	}

	label(name: string, value: number): this {
		let result = NotReservedWord.safeParse(name)
		if (!result.success) {
			this.throw(new SyntaxError(`Label ${name} is a reserved word`, "error", this.line))
		}
		if (this.chipHousing.memory.getType(name) === "label" && this.get(name) !== value) {
			this.throw(new SyntaxError(`Label ${name} already exists`, "error", this.line))
		}
		this.chipHousing.memory.set("label", name, value)
		return this
	}

	jump(line: string | number): this {
		const oldLine = this.getPosition()
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

	stackPush(value: string | number): this {
		let sp = z.number().min(0).max(512).parse(this.get("sp"))
		this.chipHousing.stack.put(sp++, this.get(value))

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
			.map(([, device]) => device.getProperty(logic))
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
			.map(([, device]) => device.getSlotProperty(slot, logic))
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
			.map(([, device]) => device.getSlotProperty(slot, logic))
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
			device.setProperty(logic, value)
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
			device.setProperty(logic, value)
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
			device.setSlotProperty(slot, logic, value)
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
}

export default DevEnv
