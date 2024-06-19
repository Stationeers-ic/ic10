import {hash} from ".."

export abstract class Device {
	public static is(obj: any): obj is Device {
		return (
			obj.getChannel !== undefined &&
			obj.getProperty !== undefined &&
			obj.getSlotProperty !== undefined &&
			obj.getReagent !== undefined &&
			Stack.is(obj.stack)
		)
	}

	private prefabHash?: PrefabHash
	private name?: Name


	protected constructor(ReferenceId: number) {

	}

	public get id() {
		return this.ReferenceId
	}

	public get ReferenceId() {
		return this.getProperty("ReferenceId")
	}

	public set ReferenceId(value: number) {
		this.setProperty("ReferenceId", value)
	}

	public get PrefabHash(): PrefabHash | undefined {
		return this.prefabHash
	}

	public set PrefabHash(value: PrefabHash) {
		this.prefabHash = value
		this.setProperty("PrefabHash", value.number)
	}

	public get Name(): Name | undefined {
		return this.name
	}

	public set Name(value: Name) {
		this.name = value
		this.setProperty("PrefabName", value.number)
	}

	abstract get stack(): Stack

	abstract setChannel(channel: number, value: number): this

	abstract getChannel(channel: number): number

	abstract setProperty(property: string, value: number): this

	abstract getProperty(property: string): number

	abstract setSlotProperty(slot: number, property: string, value: number): this

	abstract getSlotProperty(slot: number, property: string): number

	abstract setReagent(reagent: number, value: number | Reagent): this

	abstract getReagent(reagent: number): number
}

export abstract class Stack {
	abstract push(value: number): this

	abstract pop(): number

	abstract peek(): number

	abstract put(index: number, value: number): this

	abstract get(index: number): number

	public static is(obj: any): obj is Stack {
		return obj.push !== undefined && obj.pop !== undefined && obj.peek !== undefined
	}
}

export abstract class HashString {
	constructor(
		public number: number,
		public name?: string,
	) {
	}
}

export class Name extends HashString {
	public static fromString(str: string): HashString {
		return new Name(hash(str), str)
	}

	public static fromNumber(num: number): HashString {
		return new Name(num)
	}
}

export class PrefabHash extends HashString {
	public static fromString(str: string): HashString {
		return new PrefabHash(hash(str), str)
	}

	public static fromNumber(num: number): HashString {
		return new PrefabHash(num)
	}
}

export class Reagent extends HashString {
	public static fromString(str: string): HashString {
		return new Reagent(hash(str), str)
	}

	public static fromNumber(num: number): HashString {
		return new Reagent(num)
	}
}
