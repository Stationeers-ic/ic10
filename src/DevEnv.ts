import { Environment } from "./abstract/Environment"
import { getProperty, setProperty } from "dot-prop"
import { z } from "zod"
import { NotReservedWord, NumberOrNan, StringOrNumberOrNaN } from "./ZodTypes"
import SyntaxError from "./errors/SyntaxError"
import Line from "./core/Line"
import { v4 as uuid } from "uuid"

const device = z.union([z.record(z.number()), z.record(z.record(z.number())), z.record(z.record(z.record(z.number())))])
type device = z.infer<typeof device>

//Окружение без проверок которое просто сохраняет все как есть
export class DevEnv extends Environment {
	/*
	 * Текущая строка
	 */
	private line: number = 0
	/*
	 * Все строки текущего выполнения
	 */
	private lines: Array<Line | null> = []
	public devices: Map<string, device> = new Map<string, device>()
	public devicesIndex: Map<number, string> = new Map<number, string>()
	public devicesAttached: Map<string, string> = new Map<string, string>()
	public data: any = {}
	public stack: number[] = new Array(512)
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
		const device: device = {
			PrefabHash: hash,
		}
		if (name) {
			device.Name = name
			this.devicesIndex.set(name, id)
		}
		this.devicesIndex.set(hash, id)
		this.devices.set(id, device)
		return id
	}

	removeDevice(id: string): this {
		const d = this.devices.get(id)
		if (d) {
			if (typeof d.Name === "number") {
				this.devicesIndex.delete(d.Name)
			}
			if (typeof d.PrefabHash === "number") {
				this.devicesIndex.delete(d.PrefabHash)
			}
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
		if (/^d\d+/.test(name)) {
			const [port, a, b, c, d] = name.split(".")
			const id = z.string().parse(this.devicesAttached.get(port))
			const device = this.devices.get(id)
			return NumberOrNan.parse(getProperty(device, [a, b, c, d].filter((i) => i !== undefined).join(".")))
		}
		// только регистры илл рррррегистры :)
		name = this.dynamicRegister(name)
		name = this.dynamicDevicePort(name)

		return NumberOrNan.parse(getProperty(this.data, name) ?? 0)
	}

	set(name: string, value: number): this {
		if (this.aliases.has(name)) {
			name = NotReservedWord.parse(this.aliases.get(name))
		}
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
		// только регистры илл рррррегистры :)
		name = this.dynamicRegister(name)
		name = this.dynamicDevicePort(name)

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
		return this.devicesAttached.has(port)
	}

	getDeviceByHash(hash: number): string[] {
		return []
	}

	getDeviceByHashAndName(hash: number, name: number): string[] {
		return []
	}

	hcf(): this {
		console.log("Died")
		this.jump(this.getLines().length)
		return this
	}

	getLines(): (Line | null)[] {
		return this.lines
	}
}

export default DevEnv
