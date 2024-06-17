import { Device } from "../abstract/Device";
import { DevDevice } from "./DevDevice";

export class DevChipHousing extends DevDevice {
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
