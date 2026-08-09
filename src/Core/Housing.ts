import type { Chip } from "@/Core/Chip";
import { Device, type DeviceConstructor } from "@/Core/Device";
import { Ic10Error } from "@/Ic10/Errors/Errors";
import type { Ic10Runner } from "@/Ic10/Ic10Runner";
import i18n from "@/Languages/lang";
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
	#runer?: Ic10Runner;

	constructor(args: SocketDeviceConstructor) {
		super(args);
		this.chip = args?.chip;
		this.pin_count = args?.pin_count ?? 6;
		if (typeof this.chip !== "undefined") {
			this.$memory = this.chip.memory;
			this.chip.count = 1;
			this.chip?.applyHousing(this);
			//TODO: сделать разные индексы слотов для разных устройств
			this?.slots?.getSlot(0)?.putItem(this.chip);
		}
	}

	applyRunner(runner: Ic10Runner) {
		this.#runer = runner;
	}

	get runner(): Ic10Runner | undefined {
		return this.#runer;
	}

	reset() {
		super.reset();
		this.chip?.reset();
	}

	connectDevices(pin: number, device: Device) {
		if (device.network.id !== this.network.id) {
			this.$errors.add(
				new Ic10Error({
					message: i18n.t("error.cannot_connect_different_networks"),
				}),
			);
			return;
		}
		if (pin > this.pin_count) {
			this.$errors.add(
				new Ic10Error({
					message: i18n.t("error.pin_out_of_range", { pin }),
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
