export type MemType = 'ram'| 'const' | 'label'


interface Alias {
	setAlias(alias: string, key: string): void

	getAlias(alias: string): string

	getAliasesByKey(key: string): string[]

	hasAlias(alias: string): boolean

	countAliasesByKey(key: string): number

	deleteAlias(alias: string): void

	getAliases(): Map<string, string>
}

export interface Memory extends Alias{

	get(keyOrAlias: string): number

	set(type: MemType, keyOrAlias: string, value: number): void

	delete(keyOrAlias: string): void

	has(keyOrAlias: string): boolean

	getType(keyOrAlias: string): MemType|null

	all(): Map<string, {type:MemType, value:number}>
}


export function isMemory(obj: any): obj is Memory {
	return (
		obj.get !== undefined &&
		obj.set !== undefined &&
		obj.delete !== undefined &&
		obj.has !== undefined &&
		obj.getType !== undefined &&
		obj.all !== undefined &&
		obj.setAlias !== undefined &&
		obj.getAlias !== undefined &&
		obj.getAliasesByKey !== undefined &&
		obj.hasAlias !== undefined &&
		obj.countAliasesByKey !== undefined &&
		obj.deleteAlias !== undefined &&
		obj.getAliases !== undefined
	)
}
