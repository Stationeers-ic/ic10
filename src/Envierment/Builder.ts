import type * as v from "valibot";
import { parse, stringify } from "yaml";
import type { Device } from "@/Core/Device";
import type { Network } from "@/Core/Network";
import type { Ic10Runner } from "@/Ic10/Ic10Runner";
import type { EnvSchema } from "@/Schemas/EnvSchema";

type EnvConfig = v.InferOutput<typeof EnvSchema>;

export class Builer {
	public readonly devices = new Map<string, Device>();
	public readonly Networks = new Map<string, Network>();
	public readonly Runners = new Map<string, Ic10Runner>();

	static from(yml: string): Builer {
		const data = parse(yml) as EnvConfig;

		console.log(data);
		return new Builer();
	}

	public toYaml(): string {
		try {
			return stringify(this);
		} catch (error) {
			throw new Error("Failed to serialize to YAML");
		}
	}
}
