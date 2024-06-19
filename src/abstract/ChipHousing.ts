import { Device } from "./Device"

export interface ChipHousing extends Device{
	attachDevice(port: string, device: Device): this
	detachDevice(port: string): this
	getDevice(port: string): Device
	getPort(Device: Device): string | undefined
	isPortConnected(port: string): true | false
}

export function isChipHousing(obj: any): obj is ChipHousing {
	return (
		obj.attachDevice !== undefined &&
		obj.detachDevice !== undefined &&
		obj.getDevice !== undefined &&
		obj.isPortConnected !== undefined &&
		Device.is(obj)
	)
}
