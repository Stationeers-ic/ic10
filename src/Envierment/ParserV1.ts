import { stringify } from "yaml";
import { Network } from "@/Core/Network";
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
				return {
					id: item.id,
					type: item.type,
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
			this.builer.Networks.set(
				network.id,
				new Network({
					id: network.id,
					networkType: network.type,
				}),
			);
		});
	}
	parseDevices(data: EnvSchema) {
		for (const device of data.devices) {
		}
	}
}
