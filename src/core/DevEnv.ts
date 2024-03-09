// noinspection SuspiciousTypeOfGuard

import Environment from "../abstract/Environment"
import { z } from "zod"
import Line from "./Line"
import Err from "../abstract/Err"
import SyntaxError from "../errors/SyntaxError"
import { getProperty, setProperty } from "dot-prop"
import { NotReservedWord, NumberOrNan, StringOrNumberOrNaN } from "../ZodTypes"
import { v4 as uuid } from "uuid"
import {
	pathFor_DynamicDevicePort,
	pathFor_DynamicRegister,
	pathFor_PortWithConnection,
	PortWithConnection,
} from "./Helpers"

const ZodDevice = z.union([
	z.record(z.number()),
	z.record(z.record(z.number())),
	z.record(z.record(z.record(z.number()))),
])
type ZodDevice = z.infer<typeof ZodDevice>

/**
 * An environment without checks, which simply saves as it is
 */
class DevEnv extends Environment {
	/**
	 * Current line
	 */
	private line: number = 0
	/**
	 * All lines of current execution
	 */
	private lines: Array<Line | null> = []
	private errors: Err[] = []
	private errorCounter: number = 0
	private devices: Map<string, ZodDevice> = new Map<string, ZodDevice>()
	private devicesAttached: Map<string, string> = new Map<string, string>()
	private data: any = {}
	private stack: number[] = new Array(512)
	private aliases = new Map<string, string | number>()

	constructor(data: { [key: string]: number } = {}) {
		super()
		this.aliases.set("sp", "r16")
		this.aliases.set("ra", "r17")

		this.aliases.set("NaN", NaN)
		this.aliases.set("Average", 0)
		this.aliases.set("Sum", 1)
		this.aliases.set("Minimum", 2)
		this.aliases.set("Maximum", 3)
		Object.entries(data).forEach(([key, value]) => {
			this.set(key, value)
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

	appendDevice(hash: number, name?: number): string {
		const id = uuid()
		const device: ZodDevice = {
			PrefabHash: hash,
		}
		if (name) {
			device.Name = name
		}
		this.devices.set(id, device)
		return id
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
		this.devicesAttached.set(port, id)
		this.devicesAttached.set(id, port)
		return this
	}

	detachDevice(id: string): this {
		const port = this.devicesAttached.get(id)
		if (port) {
			this.devicesAttached.delete(port)
		}
		this.devicesAttached.delete(id)
		return this
	}

	get(name: string | number): number {
		if (typeof name === "number") return name
		let x = parseFloat(name)
		if (!isNaN(x)) return x
		if (this.aliases.has(name)) {
			return NumberOrNan.parse(this.get(StringOrNumberOrNaN.parse(this.aliases.get(name))))
		}
		name = pathFor_DynamicRegister(this, name)
		name = pathFor_DynamicDevicePort(this, name)
		name = pathFor_PortWithConnection(this, name)

		if (/^d\d+/.test(name)) {
			const [port, a, b, c, d] = name.split(".")
			const id = z.string().parse(this.devicesAttached.get(port))
			const device = this.devices.get(id)
			return NumberOrNan.parse(getProperty(device, [a, b, c, d].filter((i) => i !== undefined).join(".")))
		}
		return NumberOrNan.parse(getProperty(this.data, name) ?? 0)
	}

	set(name: string, value: number): this {
		if (this.aliases.has(name)) {
			name = NotReservedWord.parse(this.aliases.get(name))
		}
		name = pathFor_DynamicRegister(this, name)
		name = pathFor_DynamicDevicePort(this, name)
		name = pathFor_PortWithConnection(this, name)

		if (/^d\d+/.test(name)) {
			const [port, a, b, c, d] = name.split(".")
			const id = z.string().parse(this.devicesAttached.get(port))
			const device = this.devices.get(id)
			if (device === undefined) {
				throw new SyntaxError(`Device ${id} not found`, "error", this.line)
			}
			setProperty(device, [a, b, c, d].filter((i) => i !== undefined).join("."), value)
			return this
		}
		setProperty(this.data, name, value)
		return this
	}

	alias(name: string, value: string | number): this {
		name = NotReservedWord.parse(name)
		value = StringOrNumberOrNaN.parse(value)
		this.aliases.set(name, value)
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

	peek(): number {
		let sp = z.number().min(0).max(512).parse(this.get("sp"))
		const val = this.stack[sp - 1]
		return z.number().parse(val)
	}

	pop(): number {
		let sp = z.number().min(0).max(512).parse(this.get("sp"))
		const val = this.stack[--sp]
		this.set("sp", sp)
		return z.number().parse(val)
	}

	push(name: string | number): this {
		let sp = z.number().min(0).max(512).parse(this.get("sp"))
		this.stack[sp++] = this.get(name)
		this.set("sp", sp)

		return this
	}

	getAlias(alias: string): string {
		if (this.aliases.has(alias)) return z.string().parse(this.aliases.get(alias))
		return alias
	}

	hasDevice(port: string): boolean {
		const p = PortWithConnection(port)
		return this.devicesAttached.has(p.port)
	}

	hcf(): this {
		console.log("Died")
		this.jump(this.getLines().length)
		return this
	}

	getLines(): (Line | null)[] {
		return this.lines
	}

	getDeviceByHash(hash: number, logic: string): number[] {
		const output = Array.from(this.devices)
			.filter(([, device]) => {
				return device.PrefabHash === hash
			})
			.map(([, device]) => getProperty(device, logic))
			.filter((i) => typeof i === "number")
		return z.array(z.number()).parse(output)
	}

	getDeviceByHashAndName(hash: number, name: number, logic: string): number[] {
		const output = Array.from(this.devices)
			.filter(([, device]) => {
				return device.PrefabHash === hash && device.Name === name
			})
			.map(([, device]) => getProperty(device, logic))

			.filter((i) => typeof i === "number")
		return z.array(z.number()).parse(output)
	}

	getSlotDeviceByHash(hash: number, slot: number, logic: string): number[] {
		const output = Array.from(this.devices)
			.filter(([, device]) => {
				return device.PrefabHash === hash
			})
			.map(([, device]) => getProperty(device, "Slots." + slot + "." + logic))
			.filter((i) => typeof i === "number")
		return z.array(z.number()).parse(output)
	}

	getSlotDeviceByHashAndName(hash: number, name: number, slot: number, logic: string): number[] {
		const output = Array.from(this.devices)
			.filter(([, device]) => {
				return device.PrefabHash === hash && device.Name === name
			})
			.map(([, device]) => getProperty(device, "Slots." + slot + "." + logic))
			.filter((i) => typeof i === "number")
		return z.array(z.number()).parse(output)
	}

	setDeviceByHash(hash: number, logic: string, value: number): this {
		const devices = Array.from(this.devices).filter(([, device]) => {
			return device.PrefabHash === hash
		})
		devices.forEach(([, device]) => {
			setProperty(device, logic, value)
		})
		return this
	}

	setDeviceByHashAndName(hash: number, name: number, logic: string, value: number): this {
		const devices = Array.from(this.devices).filter(([, device]) => {
			return device.PrefabHash === hash && device.Name === name
		})
		devices.forEach(([, device]) => {
			setProperty(device, logic, value)
		})
		return this
	}

	setSlotDeviceByHash(hash: number, slot: number, logic: string, value: number): this {
		const devices = Array.from(this.devices).filter(([, device]) => {
			return device.PrefabHash === hash
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
		this.emit(err.level, err)
		return this
	}

	getErrorCount(): number {
		return this.errorCounter
	}

	getErrors(): Err[] {
		return this.errors
	}
}

export default DevEnv
