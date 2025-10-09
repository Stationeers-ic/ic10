import { stringify } from "yaml";
import { Network } from "@/Core/Network";
import { Logics } from "@/Defines/data";
import { DevicesByPrefabName } from "@/Devices";
import type { Builer } from "@/Envierment/Builder";
import type { EnvSchema } from "@/Schemas/EnvSchema";

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

export class ParserV1 extends Parser {
	public parse(data: EnvSchema) {
		this.builer.reset();
		this.parseNetworks(data);
		this.parseDevices(data);
		console.log(data);
	}
	public stringify() {
		const networks = this.builer.Networks.values()
			.map((item: Network) => {
				const props = [];
				console.table(props);
				for (const [key, value] of item.chanels) {
					if (!Logics.hasValue(key)) {
						throw new Error("todo");
					}
					props.push({
						name: Logics.getByValue(key),
						value,
					});
				}
				console.table(props);
				return {
					id: item.id,
					type: item.type,
					props: props,
				};
			})
			.toArray();

		const data = {
			version: 1,
			devices: [],
			networks: networks,
		} satisfies EnvSchema;
		return stringify(data);
	}

	parseNetworks(data: EnvSchema) {
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

	parseDevices(data: EnvSchema) {
		for (const device of data.devices) {
			if (typeof DevicesByPrefabName[device.PrefabName] === "undefined") {
				throw new Error("test");
			}
		}
	}
}
