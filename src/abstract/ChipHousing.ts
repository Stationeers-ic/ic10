import { Device } from "./Device"

export interface ChipHousing extends Device{
	attachDevice(pin: number, device: Device): this
	detachDevice(pin: number): this
	getDevice(pin: number): Device
	getPin(Device: Device): number | undefined
	isPinConnected(pin: number): true | false
}

export function isChipHousing(obj: any): obj is ChipHousing {
	return (
		obj.attachDevice !== undefined &&
		obj.detachDevice !== undefined &&
		obj.getDevice !== undefined &&
		obj.isPinConnected !== undefined &&
		Device.is(obj)
	)
}
