import { v4 as uuidv4 } from "uuid";
import type { Device } from "@/Core/Device";
import type { PortType } from "./Device/DevicePorts";

export type NetworkType = "data" | "power" | "chute" | "pipe" | "wireless" | "landing";

export type NetworkConstructor = {
	networkType: NetworkType;
	id?: string;
};

export class Network {
	public devices: Set<Device> = new Set();
	public chanels = new Map<number, number>();
	public $id: string;
	public type: NetworkConstructor["networkType"];

	constructor(
		{ networkType, id }: NetworkConstructor = {
			networkType: "data",
		},
	) {
		this.type = networkType;
		this.$id = id ?? uuidv4();
	}

	get id() {
		return this.$id;
	}

	public apply(device: Device, port: PortType | undefined = undefined) {
		this.devices.add(device);
		let portIndex: number = -1;
		if (typeof port === "undefined") {
			portIndex = device.ports.getDefaultPortIndex();
		} else {
			portIndex = device.ports.getPortIndex(port);
		}
		if (portIndex >= 0) {
			device.ports.setNetwork(portIndex, this);
		}
	}

	deviceById(id: number): Device | undefined {
		for (const device of this.devices) {
			if (device.id === id) {
				return device;
			}
		}
	}

	devicesByHash(hash: number): Device[] {
		try {
			return [...this.devices].filter((device) => device.hash === hash);
		} catch (e) {
			return [];
		}
	}
}
