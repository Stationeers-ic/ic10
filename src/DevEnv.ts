import {Environment} from "./abstract/Environment"
import {getProperty, hasProperty, setProperty} from "dot-prop"
import {z} from "zod"
import {NotReservedWord, NumberOrNan, StringOrNumberOrNaN} from "./ZodTypes"
import SyntaxError from "./errors/SyntaxError"
import Line from "./core/Line"

//Окружение без проверок которое просто сохраняет все как есть
export class DevEnv extends Environment {

	/*
	 * Текущая строка
	 */
	public line: number = 0
	/*
	 * Все строки текущего выполнения
	 */
	public lines: Array<Line | null> = []
	public data: any = {}
	public stack: number[] = new Array(512)
	public aliases = new Map<string, string | number>()

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


	addLine(line: Line | null): void {
		this.lines.push(line)
	}

	setLine(index: number, line: Line): void {
		this.lines[index] = line
	}

	getLine(index: number): Line | null {
		return this.lines[index] ?? null
	}

	getPosition(): number {
		return this.line
	}

	addPosition(modify: number): void {
		this.line += modify
	}

	setPosition(index: number): void {
		this.line = index
	}

	appendDevice(name: string, hash: number): string {
		throw new Error("Method not implemented.")
	}

	removeDevice(id: string): void {
		throw new Error("Method not implemented.")
	}

	attachDevice(id: string, port: string): string {
		throw new Error("Method not implemented.")
	}

	detachDevice(id: string): void {
		throw new Error("Method not implemented.")
	}

	get(name: string | number): number {
		if (typeof name === "number") return name
		let x = parseFloat(name)
		if (!isNaN(x)) return x
		let y = this.dynamicDevicePort(name)
		if (y !== name) {
			return this.get(y)
		}
		if (this.aliases.has(name)) {
			return NumberOrNan.parse(this.get(StringOrNumberOrNaN.parse(this.aliases.get(name))))
		}
		return NumberOrNan.parse(getProperty(this.data, name) ?? 0)
	}

	set(name: string, value: number): void {
		let y = this.dynamicDevicePort(name)
		if (y !== name) {
			return setProperty(this.data, y, value)
		}
		if (this.aliases.has(name)) {
			name = NotReservedWord.parse(this.aliases.get(name))
		}
		setProperty(this.data, name, value)
	}

	alias(name: string, value: string | number): void {
		name = NotReservedWord.parse(name)
		value = StringOrNumberOrNaN.parse(value)
		this.aliases.set(name, value)
	}

	jump(line: string | number): void {
		const oldLine = this.line
		if (typeof line === "number") {
			this.line = line
		} else {
			this.line = this.get(line)
		}
		if (oldLine === this.line) {
			this.throw(new SyntaxError(`Jump to the same line ${this.line} is not allowed`, "error", this.line))
		}
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

	push(name: string | number): void {
		let sp = z.number().min(0).max(512).parse(this.get("sp"))
		this.stack[sp++] = this.get(name)
		this.set("sp", sp)
	}

	getAlias(alias: string): string {
		if (this.aliases.has(alias)) return z.string().parse(this.aliases.get(alias))
		return alias
	}

	hasDevice(name: string): boolean {
		return hasProperty(this.data, this.getAlias(name))
	}

	getDeviceByHash(hash: number): string[] {
		return []
	}

	getDeviceByHashAndName(hash: number, name: number): string[] {
		return []
	}

	hcf(): void {
		console.log("Died")
		this.jump(this.lines.length)
	}

	getLines(): (Line|null)[] {
		return this.lines
	}


}

export default DevEnv
