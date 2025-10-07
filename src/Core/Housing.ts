import type { Chip } from "@/Core/Chip";
import { Device, type DeviceConstructor } from "@/Core/Device";
import { Ic10Error } from "@/Ic10/Errors/Errors";
import type { StackInterface } from "./Stack";

export type SocketDeviceConstructor = {
	chip?: Chip;
	pin_count?: number;
} & DeviceConstructor;

export class Housing extends Device {
	public readonly chip?: Chip;
	public readonly pin_count: number;
	public readonly connectedDevices: Map<number, Device> = new Map();
	public declare $memory: StackInterface;

	constructor({ network, hash, chip, pin_count = 6 }: SocketDeviceConstructor) {
		super({ network, hash });
		this.chip = chip;
		this.pin_count = pin_count ?? 6;
		delete this.$memory;
		this.$memory = this.chip.memory;
	}

	reset() {
		super.reset();
		this.chip?.reset();
	}

	connectDevices(pin: number, device: Device) {
		if (device.network.id !== this.network.id) {
			this.$errors.add(
				new Ic10Error({
					message: `Cannot connect device because they are not on the same network`,
				}),
			);
			return;
		}
		if (pin > this.pin_count) {
			this.$errors.add(
				new Ic10Error({
					message: `Cannot connect device because pin ${pin} is out of range`,
				}),
			);
			return;
		}
		this.connectedDevices.set(pin, device);
	}

	getConnectedDevices(pin: number): Device | undefined {
		if (pin < 0) {
			return this;
		}
		return this.connectedDevices.get(pin) ?? undefined;
	}
}
