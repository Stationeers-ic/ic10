import { Device } from "./Device"
import { Memory, isMemory } from "./Memory"

export interface ChipHousing extends Device {
	// device
	attachDevice(port: string, device: Device): this
	detachDevice(port: string): this
	getDevice(port: string): Device
	getPort(Device: Device): string | undefined
	isPortConnected(port: string): true | false
	// registers
	setRegister(register: string, value: number): this
	getRegister(register: string): number
	memory: Memory
}

export function isChipHousing(obj: any): obj is ChipHousing {
	return (
		obj.isPortConnected !== undefined &&
		obj.attachDevice !== undefined &&
		obj.detachDevice !== undefined &&
		obj.getRegister !== undefined &&
		obj.setRegister !== undefined &&
		obj.getDevice !== undefined &&
		obj.getPort !== undefined &&
		isMemory(obj.memory) &&
		Device.is(obj)
	)
}
