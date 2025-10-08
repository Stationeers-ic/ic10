import { parse } from "yaml";
import type { Device } from "@/Core/Device";
import type { Network } from "@/Core/Network";
import { type Parser, ParserV1 } from "@/Envierment/ParserV1";
import type { Ic10Runner } from "@/Ic10/Ic10Runner";
import type { EnvSchema } from "@/Schemas/EnvSchema";

export class Builer {
	private readonly lattestParser = ParserV1;

	public readonly Devices = new Map<string, Device>();
	public readonly Networks = new Map<string, Network>();
	public readonly Runners = new Map<string, Ic10Runner>();

	public reset(): void {
		this.Devices.clear();
		this.Networks.clear();
		this.Runners.clear();
	}

	static from(yml: string): Builer {
		const BUILDER = new Builer();
		const data = parse(yml) as EnvSchema;
		let Parser: Parser;
		switch (data.version) {
			case 1:
				Parser = new ParserV1({ builer: BUILDER });
				break;

			default:
				break;
		}
		console.log(data);
		Parser.parse(data);
		return BUILDER;
	}

	public toYaml(): string {
		try {
			return new this.lattestParser({ builer: this }).stringify();
		} catch (error) {
			throw new Error("Failed to serialize to YAML");
		}
	}
}
