import { crc32 } from "@/Ic10/Helpers/functions";

export class BiMap<K extends string | number, V extends string | number> {
	private keyToValue = new Map<K, V>();
	private valueToKey = new Map<V, K>();

	set(key: K, value: V): this {
		if (this.keyToValue.has(key)) {
			const oldValue = this.keyToValue.get(key)!;
			this.valueToKey.delete(oldValue);
		}
		if (this.valueToKey.has(value)) {
			const oldKey = this.valueToKey.get(value)!;
			this.keyToValue.delete(oldKey);
		}

		this.keyToValue.set(key, value);
		this.valueToKey.set(value, key);
		return this;
	}

	getByKey(key: K): V | undefined {
		return this.keyToValue.get(key);
	}

	getByValue(value: V): K | undefined {
		return this.valueToKey.get(value);
	}

	deleteByKey(key: K): boolean {
		const value = this.keyToValue.get(key);
		if (value === undefined) return false;

		this.keyToValue.delete(key);
		this.valueToKey.delete(value);
		return true;
	}

	deleteByValue(value: V): boolean {
		const key = this.valueToKey.get(value);
		if (key === undefined) return false;

		this.valueToKey.delete(value);
		this.keyToValue.delete(key);
		return true;
	}

	hasKey(key: any): key is K {
		return this.keyToValue.has(key);
	}

	hasValue(value: any): value is V {
		return this.valueToKey.has(value);
	}

	clear(): void {
		this.keyToValue.clear();
		this.valueToKey.clear();
	}

	get size(): number {
		return this.keyToValue.size;
	}

	keys(): IterableIterator<K> {
		return this.keyToValue.keys();
	}

	values(): IterableIterator<V> {
		return this.keyToValue.values();
	}

	entries(): IterableIterator<[K, V]> {
		return this.keyToValue.entries();
	}

	forEach(callback: (value: V, key: K) => void): void {
		this.keyToValue.forEach(callback);
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.keyToValue.entries();
	}
}

export class HashString {
	public readonly value: string;
	public readonly hash: number;
	constructor(name: string) {
		this.value = name;
		this.hash = crc32(name);
	}

	[Symbol.toPrimitive](hint: string) {
		if (hint === "number") return this.hash;
		if (hint === "string") return this.value;
	}

	public toString() {
		return this.value;
	}

	public valueOf() {
		return this.hash;
	}
}
