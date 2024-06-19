// noinspection JSAnnotator

import { ChipHousing } from "../abstract/ChipHousing"
import { Device } from "../abstract/Device"
import { Memory } from "../abstract/Memory"
import { DevMemory } from "./DevMemory"
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
	private ConnectedDevices: Map<string, Device> = new Map()
	public memory: Memory = new DevMemory()

	constructor(ReferenceId: number) {
		super(ReferenceId) // Вызов конструктора родительского класса
	}
	setRegister(register: string, value: number): this {
		this.properties[register] = value;
		return this;
	}
	getRegister(register: string): number {
		return this.properties[register] || 0;
	}

	attachDevice(port: string, device: Device): this {
		this.ConnectedDevices.set(port, device)
		return this
	}

	detachDevice(port: string): this {
		this.ConnectedDevices.delete(port)
		return this
	}

	getDevice(port: string): Device {
		if (port === "db") {
			return this
		}
		if (this.ConnectedDevices.has(port)) {
			return this.ConnectedDevices.get(port)! // Утверждение, что результат не будет undefined
		}
		throw new Error(`No device connected to port ${port}`)
	}

	getPort(device: Device): string | undefined {
		for (const [port, dev] of this.ConnectedDevices) {
			if (dev === device) {
				return port
			}
		}
		return undefined
	}

	isPortConnected(port: string): boolean {
		return this.ConnectedDevices.has(port)
	}
}
