import { Device } from "./Device"

export abstract class ChipHousing extends Device {
	abstract attachDevice(pin:number, device: Device): Promise<this> | this
	abstract detachDevice(pin:number, device: Device): Promise<this> | this
	abstract getDevice(pin:number): Promise<Device> | Device
	abstract isPinConnected(pin:number): true | false

	public static is(obj: any): obj is ChipHousing {
		return obj.attachDevice !== undefined
			&& obj.detachDevice !== undefined
			&& obj.getDevice !== undefined
			&& obj.isPinConnected !== undefined
	}
}

export interface IChipHousing extends ChipHousing{

}
