import { Memory } from "../abstract/Memory";

export class DevMemory implements Memory {
	private readonly memory!: Map<string, number>

	private readonly aliases!: Map<string, string>

	private readonly constants!: Map<string, { value: number; pre: boolean }>

	constructor() {
		this.memory = new Map()
		this.aliases = new Map()
		this.constants = new Map()
		this.init()
	}

	public init() {
		this.setAlias("sp", "r16")
		this.setAlias("ra", "r17")
	}

	clear(): void {
		this.memory.clear()
		this.aliases.clear()
		this.constants.clear()
	}

	public get(keyOrAlias: string): number {
		if (this.memory.has(keyOrAlias)) {
			return this.memory.get(keyOrAlias)!
		}
		if (this.aliases.has(keyOrAlias)) {
			keyOrAlias = this.aliases.get(keyOrAlias)!
			if (this.memory.has(keyOrAlias)) {
				return this.memory.get(keyOrAlias)!
			}
		}
		throw new Error(`Key or alias not found: ${keyOrAlias}`)
	}

	public set(keyOrAlias: string, value: number): void {
		if (this.memory.has(keyOrAlias)) {
			this.memory.set(keyOrAlias, value)
		}
		if (this.aliases.has(keyOrAlias)) {
			this.memory.set(this.aliases.get(keyOrAlias)!, value)
		}
		throw new Error(`Key or alias not found: ${keyOrAlias}`)
	}

	public has(keyOrAlias: string): boolean {
		return (
			this.memory.has(keyOrAlias) ||
			(this.aliases.has(keyOrAlias) && this.memory.has(this.aliases.get(keyOrAlias)!))
		)
	}

	public delete(keyOrAlias: string): void {
		if (this.memory.has(keyOrAlias)) {
			this.memory.delete(keyOrAlias)
		}
		if (this.aliases.has(keyOrAlias)) {
			this.memory.delete(this.aliases.get(keyOrAlias)!)
		}
		throw new Error(`Key or alias not found: ${keyOrAlias}`)
	}

	public setAlias(alias: string, key: string): void {
		this.aliases.set(alias, key)
	}

	public getAlias(alias: string): string {
		return this.aliases.get(alias)!
	}

	public getAliasesByKey(key: string): string[] {
		return Array.from(this.aliases)
			.filter(([_, v]) => v === key)
			.map(([k, _]) => k)
	}

	public hasAlias(alias: string): boolean {
		return this.aliases.has(alias)
	}

	public countAliasesByKey(key: string): number {
		return this.getAliasesByKey(key).length
	}

	public deleteAlias(alias: string): void {
		this.aliases.delete(alias)
	}

	public getAliases(): Map<string, string> {
		return this.aliases
	}

	public setConstant(key: string, value: number, pre: boolean): void {
		this.constants.set(key, { value, pre })
	}

	public getConstant(key: string): number {
		if (!this.hasConstant(key)) {
			throw new Error(`Constant not found: ${key}`)
		}
		return this.constants.get(key)!.value
	}

	public hasConstant(key: string): boolean {
		return this.constants.has(key)
	}

	public deleteConstant(key: string): void {
		this.constants.delete(key)
	}

	public getConstants(all: boolean): Map<string, { value: number; pre: boolean }> {
		return this.constants
	}
}
