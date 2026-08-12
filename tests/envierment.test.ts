import { describe, expect, test } from "bun:test";
import { Chip } from "@/Core/Chip";
import type { Housing } from "@/Core/Housing";
import { Network } from "@/Core/Network";
import { Builer } from "@/Envierment/Builder";
import { ParserV1 } from "@/Envierment/ParserV1";
import type { EnvSchema } from "@/Schemas/EnvSchema";

describe("Builer", () => {
	test("creates empty builder", () => {
		const builder = new Builer();
		expect(builder.Chips.size).toBe(0);
		expect(builder.Devices.size).toBe(0);
		expect(builder.Networks.size).toBe(0);
		expect(builder.Runners.size).toBe(0);
	});

	test("reset clears all maps", () => {
		const builder = new Builer();
		builder.Networks.set("net1", new Network({ id: "net1", networkType: "data" }));
		builder.Chips.set(1, new Chip({ id: 1 }));
		builder.reset();

		expect(builder.Chips.size).toBe(0);
		expect(builder.Devices.size).toBe(0);
		expect(builder.Networks.size).toBe(0);
		expect(builder.Runners.size).toBe(0);
		expect(builder.FinishedRunners.size).toBe(0);
	});
});

describe("ParserV1 - Network connections", () => {
	test("parses data network correctly", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			devices: [],
			networks: [{ id: "data-net-1", type: "data" }],
		};

		parser.parse(envData);

		expect(builder.Networks.size).toBe(1);
		expect(builder.Networks.has("data-net-1")).toBe(true);
		expect(builder.Networks.get("data-net-1")!.type).toBe("data");
	});

	test("parses power network correctly", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			devices: [],
			networks: [{ id: "power-net-1", type: "power" }],
		};

		parser.parse(envData);

		expect(builder.Networks.size).toBe(1);
		expect(builder.Networks.get("power-net-1")!.type).toBe("power");
	});

	test("parses multiple network types", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			devices: [],
			networks: [
				{ id: "data-net", type: "data" },
				{ id: "power-net", type: "power" },
				{ id: "pipe-net", type: "pipe" },
				{ id: "chute-net", type: "chute" },
			],
		};

		parser.parse(envData);

		expect(builder.Networks.size).toBe(4);
		expect(builder.Networks.get("data-net")!.type).toBe("data");
		expect(builder.Networks.get("power-net")!.type).toBe("power");
		expect(builder.Networks.get("pipe-net")!.type).toBe("pipe");
		expect(builder.Networks.get("chute-net")!.type).toBe("chute");
	});

	test("parses network with channel props", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			devices: [],
			networks: [
				{
					id: "data-net",
					type: "data",
					props: [{ name: "Channel0", value: 42 }],
				},
			],
		};

		parser.parse(envData);

		const network = builder.Networks.get("data-net")!;
		expect(network.chanels.size).toBe(1);
	});
});

describe("ParserV1 - Device connections", () => {
	test("parses device with data port connection", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [{ id: "data-net", type: "data" }],
			devices: [
				{
					id: 100,
					PrefabName: "StructureConsole",
					ports: [{ port: "Connection", network: "data-net" }],
				},
			],
		};

		parser.parse(envData);

		expect(builder.Devices.size).toBe(1);
		const device = builder.Devices.get(100)!;
		expect(device).toBeDefined();
		expect(device.ports.hasPort("Data Input")).toBe(true);
	});

	test("parses device with power port connection", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [{ id: "power-net", type: "power" }],
			devices: [
				{
					id: 200,
					PrefabName: "StructurePowerUmbilicalFemale",
					ports: [{ port: "Power Output", network: "power-net" }],
				},
			],
		};

		parser.parse(envData);

		expect(builder.Devices.size).toBe(1);
		const device = builder.Devices.get(200)!;
		expect(device).toBeDefined();
		expect(device.ports.hasPort("Power Output")).toBe(true);
	});

	test("parses device with default port", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [{ id: "data-net", type: "data" }],
			devices: [
				{
					id: 300,
					PrefabName: "StructureConsole",
					ports: [{ port: "default", network: "data-net" }],
				},
			],
		};

		parser.parse(envData);

		expect(builder.Devices.size).toBe(1);
		const device = builder.Devices.get(300)!;
		expect(device).toBeDefined();
	});

	test("parses device with multiple ports", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [
				{ id: "data-net", type: "data" },
				{ id: "power-net", type: "power" },
			],
			devices: [
				{
					id: 400,
					PrefabName: "StructureAreaPowerControl",
					ports: [
						{ port: "Data Input", network: "data-net" },
						{ port: "Power Output", network: "power-net" },
					],
				},
			],
		};

		parser.parse(envData);

		expect(builder.Devices.size).toBe(1);
		const device = builder.Devices.get(400)!;
		expect(device).toBeDefined();
	});
});

describe("ParserV1 - Housing with chip", () => {
	test("parses housing with chip", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [
				{
					id: 1,
					code: "move r0 42",
				},
			],
			networks: [{ id: "data-net", type: "data" }],
			devices: [
				{
					id: 100,
					PrefabName: "StructureCircuitHousing",
					chip: 1,
					ports: [{ port: "default", network: "data-net" }],
				},
			],
		};

		parser.parse(envData);

		expect(builder.Chips.size).toBe(1);
		expect(builder.Devices.size).toBe(1);
		expect(builder.Runners.size).toBe(1);

		const chip = builder.Chips.get(1)!;
		expect(chip).toBeDefined();

		const housing = builder.Devices.get(100) as Housing;
		expect(housing).toBeDefined();
		expect(housing.chip).toBeDefined();
		expect(housing.chip!.id).toBe(1);
	});

	test("parses housing with connected pins", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [
				{
					id: 1,
					code: "move r0 0",
				},
			],
			networks: [{ id: "data-net", type: "data" }],
			devices: [
				{
					id: 100,
					PrefabName: "StructureCircuitHousing",
					chip: 1,
					ports: [{ port: "default", network: "data-net" }],
					pins: [{ pin: "d0", device: 200 }],
				},
				{
					id: 200,
					PrefabName: "StructureConsole",
					ports: [{ port: "default", network: "data-net" }],
				},
			],
		};

		parser.parse(envData);

		const housing = builder.Devices.get(100) as Housing;
		expect(housing).toBeDefined();
		expect(housing.connectedDevices.size).toBe(1);
		expect(housing.connectedDevices.has(0)).toBe(true);
	});
});

describe("ParserV1 - Error handling", () => {
	test("throws error for unknown network", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [],
			devices: [
				{
					id: 100,
					PrefabName: "StructureConsole",
					ports: [{ port: "Connection", network: "nonexistent-net" }],
				},
			],
		};

		expect(() => parser.parse(envData)).toThrow();
	});

	test("throws error for incompatible port and network type", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [{ id: "power-net", type: "power" }],
			devices: [
				{
					id: 100,
					PrefabName: "StructureConsole",
					ports: [{ port: "Data Input", network: "power-net" }],
				},
			],
		};

		expect(() => parser.parse(envData)).toThrow();
	});

	test("throws error for unknown prefab", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [],
			devices: [
				{
					id: 100,
					PrefabName: "UnknownPrefab" as any,
				},
			],
		};

		expect(() => parser.parse(envData)).toThrow();
	});

	test("throws error for chip not found", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [{ id: "data-net", type: "data" }],
			devices: [
				{
					id: 100,
					PrefabName: "StructureCircuitHousing",
					chip: 999,
					ports: [{ port: "default", network: "data-net" }],
				},
			],
		};

		expect(() => parser.parse(envData)).toThrow();
	});
});

describe("ParserV1 - Roundtrip serialization", () => {
	test("serializes and deserializes network", () => {
		const builder1 = new Builer();
		const parser1 = new ParserV1({ builer: builder1 });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			devices: [],
			networks: [{ id: "data-net", type: "data" }],
		};

		parser1.parse(envData);
		const serialized = parser1.toData();

		expect(serialized.networks).toHaveLength(1);
		expect(serialized.networks[0].id).toBe("data-net");
		expect(serialized.networks[0].type).toBe("data");
	});

	test("serializes and deserializes device with ports", () => {
		const builder1 = new Builer();
		const parser1 = new ParserV1({ builer: builder1 });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [{ id: "data-net", type: "data" }],
			devices: [
				{
					id: 100,
					PrefabName: "StructureConsole",
					ports: [{ port: "Connection", network: "data-net" }],
				},
			],
		};

		parser1.parse(envData);

		// Check that the device was created and has ports
		const device = builder1.Devices.get(100)!;
		expect(device).toBeDefined();
		expect(device.ports.hasPort("Data Input")).toBe(true);
	});

	test("roundtrip preserves data", () => {
		const builder1 = new Builer();
		const parser1 = new ParserV1({ builer: builder1 });

		const envData: EnvSchema = {
			version: 1,
			chips: [{ id: 1, code: "move r0 42" }],
			networks: [
				{ id: "data-net", type: "data" },
				{ id: "power-net", type: "power" },
			],
			devices: [
				{
					id: 100,
					PrefabName: "StructureCircuitHousing",
					chip: 1,
					ports: [{ port: "default", network: "data-net" }],
				},
				{
					id: 200,
					PrefabName: "StructureConsole",
					ports: [{ port: "Connection", network: "data-net" }],
				},
			],
		};

		parser1.parse(envData);
		const serialized = parser1.toData();

		// Parse again with new builder
		const builder2 = new Builer();
		const parser2 = new ParserV1({ builer: builder2 });
		parser2.parse(serialized);

		expect(builder2.Chips.size).toBe(1);
		expect(builder2.Devices.size).toBe(2);
		expect(builder2.Networks.size).toBe(2);
	});
});

describe("Builer.from()", () => {
	test("creates builder from JSON string", () => {
		const json = JSON.stringify({
			version: 1,
			chips: [],
			devices: [],
			networks: [{ id: "data-net", type: "data" }],
		});

		const builder = Builer.from(json);

		expect(builder.Networks.size).toBe(1);
		expect(builder.Networks.has("data-net")).toBe(true);
	});

	test("throws for unsupported version", () => {
		const json = JSON.stringify({
			version: 999,
			chips: [],
			devices: [],
			networks: [],
		});

		expect(() => Builer.from(json)).toThrow();
	});
});

describe("ParserV1 - Device properties", () => {
	test("parses device with props", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [{ id: "data-net", type: "data" }],
			devices: [
				{
					id: 100,
					PrefabName: "StructureConsole",
					ports: [{ port: "default", network: "data-net" }],
					props: [{ name: "Setting", value: 1 }],
				},
			],
		};

		parser.parse(envData);

		expect(builder.Devices.size).toBe(1);
		const device = builder.Devices.get(100)!;
		expect(device).toBeDefined();
	});
});

describe("ParserV1 - Composite port expansion", () => {
	test("Connection port expands to Data Input and Power Input", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [
				{ id: "data-net", type: "data" },
				{ id: "power-net", type: "power" },
			],
			devices: [
				{
					id: 100,
					PrefabName: "StructureConsole",
					ports: [{ port: "Connection", network: "data-net" }],
				},
			],
		};

		parser.parse(envData);

		expect(builder.Devices.size).toBe(1);
		const device = builder.Devices.get(100)!;
		expect(device).toBeDefined();
	});

	test("Data Input port accepts data network", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			networks: [{ id: "data-net", type: "data" }],
			devices: [
				{
					id: 100,
					PrefabName: "StructureLogicRocketUplink",
					ports: [{ port: "Data Input", network: "data-net" }],
				},
			],
		};

		parser.parse(envData);

		expect(builder.Devices.size).toBe(1);
		const device = builder.Devices.get(100)!;
		expect(device).toBeDefined();
	});
});

describe("ParserV1 - Network channel serialization", () => {
	test("serializes network channels", () => {
		const builder = new Builer();
		const parser = new ParserV1({ builer: builder });

		const envData: EnvSchema = {
			version: 1,
			chips: [],
			devices: [],
			networks: [
				{
					id: "data-net",
					type: "data",
					props: [{ name: "Channel0", value: 100 }],
				},
			],
		};

		parser.parse(envData);
		const serialized = parser.toData();

		expect(serialized.networks[0].props).toBeDefined();
		expect(serialized.networks[0].props).toHaveLength(1);
		expect(serialized.networks[0].props![0].name).toBe("Channel0");
		expect(serialized.networks[0].props![0].value).toBe(100);
	});
});
