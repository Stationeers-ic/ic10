import { ChipHousing } from "../abstract/ChipHousing"
import { Device } from "../abstract/Device"
import { DevStack } from "./DevStack"

export class DevDevice extends Device {
	public channel: Record<string, number> = {}
	public properties: Record<string, number> = {}
	public reagents: Record<number, number> = {}
	public slots: Record<number, Record<string, number>> = {}
	public readonly stack: DevStack

	constructor(ReferenceId: number) {
		super(ReferenceId)
		this.stack = new DevStack()
		this.properties = {}
		this.reagents = {}
		this.channel = {}
		this.slots = {}
		this.ReferenceId = ReferenceId
	}

	setChannel(channel: number, value: number) {
		this.channel[channel] = value
		return this
	}

	getChannel(channel: number) {
		return this.channel?.[channel] || 0
	}

	setProperty(property: string, value: number) {
		this.properties[property] = value
		return this
	}

	getProperty(property: string) {
		return this.properties?.[property] ?? 0
	}

	setSlotProperty(slot: number, property: string, value: number) {
		if (!this.slots[slot]) this.slots[slot] = {}
		this.slots[slot][property] = value
		return this
	}

	getSlotProperty(slot: number, property: string) {
		return this.slots?.[slot]?.[property] || 0
	}

	setReagent(reagent: number, value: number) {
		this.reagents[reagent] = value
		return this
	}

	getReagent(reagent: number) {
		return this.reagents?.[reagent] || 0
	}
}

export class DevChipHousing extends DevDevice implements ChipHousing {
	public devices: Map<number, Device> = new Map()

	constructor(ReferenceId: number) {
		super(ReferenceId); // Вызов конструктора родительского класса
	}

	attachDevice(pin: number, device: Device): this {
		this.devices.set(pin, device)
		return this
	}

	detachDevice(pin: number): this {
		this.devices.delete(pin)
		return this
	}

	getDevice(pin: number): Device {
		if (this.devices.has(pin)) {
			return this.devices.get(pin)! // Утверждение, что результат не будет undefined
		}
		throw new Error(`No device connected to pin ${pin}`)
	}

	getPin(device: Device): number | undefined {
		for (const [pin, dev] of this.devices) {
			if (dev === device) {
				return pin
			}
		}
		return undefined
	}

	isPinConnected(pin: number): boolean {
		return this.devices.has(pin)
	}
}

