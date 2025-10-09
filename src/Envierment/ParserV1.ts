import { stringify } from "yaml";
import { Chip } from "@/Core/Chip";
import type { Device } from "@/Core/Device";
import { Housing } from "@/Core/Housing";
import { Network } from "@/Core/Network";
import { Logics } from "@/Defines/data";
import { DeviceClassesByBase, DevicesByPrefabName } from "@/Devices";
import type { Builer } from "@/Envierment/Builder";
import { Ic10Runner } from "@/Ic10/Ic10Runner";
import type { DeviceSchema, EnvSchema, NetworkSchema } from "@/Schemas/EnvSchema";

export type ParserConstructorType = {
	builer: Builer;
};
export abstract class Parser {
	protected readonly builer: Builer;
	constructor({ builer }: ParserConstructorType) {
		this.builer = builer;
	}

	abstract parse(data: any): void;
	abstract stringify(): string;
}

type Constructor<T = any> = new (...args: any[]) => T;

type PrefabName = Extract<keyof typeof DevicesByPrefabName, string>;
type HousingName = Extract<keyof typeof DeviceClassesByBase.Housing, string>;

type DevicesByPrefabNameType = typeof DevicesByPrefabName;
type DeviceClass = {
	[K in PrefabName]: DevicesByPrefabNameType[K] extends Constructor ? DevicesByPrefabNameType[K] : never;
}[PrefabName];

type DeviceClassesByBaseHousingType = typeof DeviceClassesByBase.Housing;
type HousingClass = {
	[K in HousingName]: DeviceClassesByBaseHousingType[K] extends Constructor ? DeviceClassesByBaseHousingType[K] : never;
}[HousingName];

export class ParserV1 extends Parser {
	public parse(data: EnvSchema) {
		this.builer.reset();
		this.parseNetworks(data);
		this.parseDevices(data);
	}
	public stringify() {
		const networks = this.stringifyNetwork();
		const device = this.stringifyDevices();

		const data = {
			version: 1,
			devices: device,
			networks: networks,
		} satisfies EnvSchema;
		return stringify(data);
	}

	private stringifyNetwork(): NetworkSchema[] {
		return this.builer.Networks.values()
			.map((item: Network) => {
				const props = [];
				for (const [key, value] of item.chanels) {
					if (!Logics.hasValue(key)) {
						throw new Error("todo");
					}
					props.push({
						name: Logics.getByValue(key),
						value,
					});
				}
				return {
					id: item.id,
					type: item.type,
					props: props,
				};
			})
			.toArray();
	}

	private stringifyDevices(): DeviceSchema[] {
		const result = this.builer.Devices.values()
			.map((item: Device) => {
				const data: any = {};
				data.id = item.id;
				data.PrefabName = item.rawData.PrefabName;
				if (item instanceof Housing) {
					data.code = item.chip.getIc10Code();
				}
				data.ports = [];
				for (const element of item.ports) {
					data.ports.push({
						port: element.port,
						network: element.network.id,
					});
				}
				return data as DeviceSchema;
			})
			.toArray();
		return result;
	}

	private parseNetworks(data: EnvSchema) {
		data.networks.forEach((network) => {
			const net = new Network({
				id: network.id,
				networkType: network.type as any,
			});
			if (network.props) {
				for (const { name, value } of network.props) {
					if (!Logics.hasKey(name)) {
						throw new Error("todo");
					}
					net.chanels.set(Logics.getByKey(name), value);
				}
			}
			this.builer.Networks.set(network.id, net);
		});
	}

	private parseDevices(data: EnvSchema) {
		for (const device of data.devices) {
			if (this.isHousing(device.PrefabName)) {
				this.parseHousing(device);
			}
		}
	}
	private parseHousing(device: DeviceSchema) {
		const housingClass = this.findHousing(device.PrefabName);
		const code = device!.code;
		const chip = new Chip({ ic10Code: code });
		const housing = new housingClass({ chip: chip });
		if (device.ports) {
			for (const { port, network } of device.ports) {
				if (!this.builer.Networks.has(network)) {
					throw new Error(`Network ${network} not found`);
				}
				const net = this.builer.Networks.get(network);
				if (port !== "default") {
					if (!housing.ports.canConnect(net.type, port)) {
						throw new Error(`Port ${port} not found in housing ${housingClass.name}`);
					}
					net.apply(housing, port);
				} else {
					net.apply(housing);
				}
			}
		}
		this.builer.Devices.set(device.id, housing);
		this.builer.Runners.set(device.id, new Ic10Runner({ housing: housing }));
	}

	private isDevice(device: any): device is PrefabName {
		return typeof DevicesByPrefabName[device] !== "undefined";
	}
	private isHousing(device: any): device is HousingClass {
		return typeof DeviceClassesByBase.Housing[device] !== "undefined";
	}
	private findHousing(device: string): HousingClass {
		if (this.isDevice(device)) {
			return DeviceClassesByBase.Housing[device];
		}
		throw new Error("test");
	}
}
