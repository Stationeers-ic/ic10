import { Memory, MemType } from "../abstract/Memory"

export class DevMemory implements Memory {
	readonly aliases: Map<string, string> = new Map()
	readonly memory: Map<string, { type: MemType; value: number }> = new Map()

	get(keyOrAlias: string): number {
		throw new Error("Method not implemented.")
	}
	set(type: MemType, keyOrAlias: string, value: number): void {
		if (this.aliases.has(keyOrAlias)) {
			const key = this.aliases.get(keyOrAlias)!
			this.memory.set(key, { type, value })
		} else {
			this.memory.set(keyOrAlias, { type, value })
		}
	}
	delete(keyOrAlias: string): void {
		if (this.aliases.has(keyOrAlias)) {
			const key = this.aliases.get(keyOrAlias)!
			this.memory.delete(key)
		} else {
			this.memory.delete(keyOrAlias)
		}
	}
	has(keyOrAlias: string): boolean {
		return (
			this.memory.has(keyOrAlias) ||
			(this.aliases.has(keyOrAlias) && this.memory.has(this.aliases.get(keyOrAlias)!))
		)
	}
	getType(keyOrAlias: string): MemType {
		if (this.aliases.has(keyOrAlias)) {
			const key = this.aliases.get(keyOrAlias)!
			return this.memory.get(key)!.type
		}
		if (!this.memory.has(keyOrAlias)) {
			return this.memory.get(keyOrAlias)!.type
		}
		throw new Error("Key not found")
	}
	all(): Map<string, { type: MemType; value: number }> {
		return this.memory
	}

	setAlias(alias: string, key: string): void {
		this.aliases.set(alias, key)
	}
	getAlias(alias: string): string {
		if (this.aliases.has(alias)) {
			return this.aliases.get(alias)!
		}
		throw new Error("Alias not found")
	}
	getAliasesByKey(key: string): string[] {
		const aliases: string[] = []
		this.aliases.forEach((value, alias) => {
			if (value === key) {
				aliases.push(alias)
			}
		})
		return aliases
	}
	hasAlias(alias: string): boolean {
		return this.aliases.has(alias)
	}
	countAliasesByKey(key: string): number {
		return this.getAliasesByKey(key).length
	}
	deleteAlias(alias: string): void {
		this.aliases.delete(alias)
	}
	getAliases(): Map<string, string> {
		return this.aliases
	}
}
