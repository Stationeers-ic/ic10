import type { Device } from "@/Core/Device";

export type DeviceScopeConstructor = {
	device: Device;
};

export abstract class DeviceScope {
	protected scope: Device;

	constructor({ device }: DeviceScopeConstructor) {
		this.scope = device;
	}
}
