export abstract class Device {
	constructor(public ReferenceId: number) {
		this.setProperty("ReferenceId", ReferenceId)
	}

	abstract stack(): Promise<Stack> | Stack

	abstract setChannel(channel: number, value: number): Promise<this> | this
	abstract getChannel(channel: number): Promise<number> | number

	abstract setProperty(property: string, value: number): Promise<this> | this
	abstract getProperty(property: string): Promise<number> | number

	abstract setSlotProperty(slot: number, property: string, value: number): Promise<this> | this
	abstract getSlotProperty(slot: number, property: string): Promise<number> | number

	abstract setReagent(reagent: number, value: number): Promise<this> | this
	abstract getReagent(reagent: number): Promise<number> | number
}

export abstract class Stack {
	abstract push(value: number): Promise<this> | this
	abstract pop(): Promise<number> | number
	abstract peek(): Promise<number> | number

	public static is(obj: any): obj is Stack {
		return obj.push !== undefined
			&& obj.pop !== undefined
			&& obj.peek !== undefined
	}
}
