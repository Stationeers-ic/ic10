/**
 * Represents an abstract class for memory operations.
 */
export interface Memory {

	/**
	 * Retrieves the value associated with the specified key or alias.
	 * @param keyOrAlias - The key or alias to retrieve the value for.
	 * @returns The value associated with the key or alias.
	 */
	get(keyOrAlias: string): number

	/**
	 * Sets the value for the specified key or alias.
	 * @param keyOrAlias - The key or alias to set the value for.
	 * @param value - The value to set.
	 */
	set(keyOrAlias: string, value: number): void

	/**
	 * Checks if the specified key or alias exists in the memory.
	 * @param keyOrAlias - The key or alias to check.
	 * @returns True if the key or alias exists, false otherwise.
	 */
	has(keyOrAlias: string): boolean

	/**
	 * Deletes the value associated with the specified key or alias.
	 * set 0
	 * @param keyOrAlias - The key or alias to delete.
	 */
	delete(keyOrAlias: string): void

	/**
	 * Clears all the values in the memory.
	 */
	clear(): void

	/**
	 * Sets an alias for the specified key.
	 * @param alias - The alias to set.
	 * @param key - The key to set the alias for.
	 */
	setAlias(alias: string, key: string): void

	/**
	 * Retrieves the key associated with the specified alias.
	 * @param alias - The alias to retrieve the key for.
	 * @returns The key associated with the alias.
	 */
	getAlias(alias: string): string

	/**
	 * Retrieves all aliases associated with the specified key.
	 * @param key - The key to retrieve the aliases for.
	 * @returns An array of aliases associated with the key.
	 */
	getAliasesByKey(key: string): string[]

	/**
	 * Checks if the specified alias exists in the memory.
	 * @param alias - The alias to check.
	 * @returns True if the alias exists, false otherwise.
	 */
	hasAlias(alias: string): boolean

	/**
	 * Counts the number of aliases associated with the specified key.
	 * @param key - The key to count the aliases for.
	 * @returns The number of aliases associated with the key.
	 */
	countAliasesByKey(key: string): number

	/**
	 * Deletes the alias associated with the specified key.
	 * @param alias - The alias to delete.
	 */
	deleteAlias(alias: string): void

	/**
	 * Retrieves a map of all aliases and their corresponding keys.
	 * @returns A map of aliases and their corresponding keys.
	 */
	getAliases(): Map<string, string>

	/**
	 * Sets a constant value for the specified key.
	 * @param key - The key to set the constant value for.
	 * @param value - The constant value to set.
	 * @param pre - Whether the constant is a pre-constant.
	 */
	setConstant(key: string, value: number, pre: boolean): void

	/**
	 * Retrieves the constant value associated with the specified key.
	 * @param key - The key to retrieve the constant value for.
	 * @returns The constant value associated with the key.
	 */
	getConstant(key: string): number

	/**
	 * Checks if the specified key has a constant value.
	 * @param key - The key to check.
	 * @returns True if the key has a constant value, false otherwise.
	 */
	hasConstant(key: string): boolean

	/**
	 * Deletes the constant value associated with the specified key.
	 * @param key - The key to delete the constant value for.
	 */
	deleteConstant(key: string): void

	/**
	 * Retrieves a map of all constants and their corresponding values.
	 * @param all - Whether to include all constants, including pre-constants.
	 * @returns A map of constants and their corresponding values.
	 */
	getConstants(all: boolean): Map<string, { value: number; pre: boolean }>
}

export function isMemory(obj: any): obj is Memory {
	return (
		obj.get !== undefined &&
		obj.set !== undefined &&
		obj.has !== undefined &&
		obj.delete !== undefined &&
		obj.clear !== undefined &&
		obj.setAlias !== undefined &&
		obj.getAlias !== undefined &&
		obj.getAliasesByKey !== undefined &&
		obj.hasAlias !== undefined &&
		obj.countAliasesByKey !== undefined &&
		obj.deleteAlias !== undefined &&
		obj.getAliases !== undefined &&
		obj.setConstant !== undefined &&
		obj.getConstant !== undefined &&
		obj.hasConstant !== undefined &&
		obj.deleteConstant !== undefined &&
		obj.getConstants !== undefined

	)
}
