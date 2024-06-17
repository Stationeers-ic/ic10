import { Device, Stack } from "../abstract/Device"
import { DevStack } from "./DevStack"

export class DevDevice extends Device {
	public channel!: Record<string, number>
	public properties!: Record<string, number>
	public reagents!: Record<number, number>
	public slots!: Record<number, Record<string, number>>
	#stack: Stack

	constructor(ReferenceId: number) {
		super(ReferenceId)
		this.#stack = new DevStack()
	}

	public static is(obj: any): obj is DevDevice {
		return (
			obj.channel !== undefined &&
			obj.properties !== undefined &&
			obj.reagents !== undefined &&
			obj.slots !== undefined &&
			Stack.is(obj.#stack)
		)
	}

	stack() {
		return this.#stack
	}

	setChannel(channel: number, value: number) {
		if (this.channel === undefined) this.channel = {}
		this.channel[channel] = value
		return this
	}

	getChannel(channel: number) {
		return this.channel[channel] || 0
	}

	setProperty(property: string, value: number) {
		if (this.properties === undefined) this.properties = {}
		this.properties[property] = value
		return this
	}

	getProperty(property: string) {
		return this.properties[property] || 0
	}

	setSlotProperty(slot: number, property: string, value: number) {
		if (!this.slots) this.slots = {}
		if (!this.slots[slot]) this.slots[slot] = {}
		this.slots[slot][property] = value
		return this
	}

	getSlotProperty(slot: number, property: string) {
		return this.slots[slot]?.[property] || 0
	}

	setReagent(reagent: number, value: number) {
		if (!this.reagents) this.reagents = {}
		this.reagents[reagent] = value
		return this
	}

	getReagent(reagent: number) {
		return this.reagents[reagent] || 0
	}
}

export interface DevDeviceI extends DevDevice {}
