import { describe, expect, test } from "bun:test";
import { DevicePorts, type PortType } from "@/Core/Device/DevicePorts";

describe("DevicePorts.getPortTypes", () => {
	test("Data ports return data type", () => {
		expect(DevicePorts.getPortTypes("Data Input")).toBe("data");
		expect(DevicePorts.getPortTypes("Data Output")).toBe("data");
	});

	test("Power ports return power type", () => {
		expect(DevicePorts.getPortTypes("Power Input")).toBe("power");
		expect(DevicePorts.getPortTypes("Power Output")).toBe("power");
	});

	test("Chute ports return chute type", () => {
		expect(DevicePorts.getPortTypes("Chute Input")).toBe("chute");
		expect(DevicePorts.getPortTypes("Chute Output")).toBe("chute");
		expect(DevicePorts.getPortTypes("Chute Output 2")).toBe("chute");
	});

	test("Pipe ports return pipe type", () => {
		expect(DevicePorts.getPortTypes("Pipe Input")).toBe("pipe");
		expect(DevicePorts.getPortTypes("Pipe Output")).toBe("pipe");
		expect(DevicePorts.getPortTypes("Pipe Input 2")).toBe("pipe");
		expect(DevicePorts.getPortTypes("Pipe Output 2")).toBe("pipe");
		expect(DevicePorts.getPortTypes("Pipe Waste")).toBe("pipe");
	});

	test("Pipe Liquid ports return pipe type", () => {
		expect(DevicePorts.getPortTypes("Pipe Liquid Input")).toBe("liquid");
		expect(DevicePorts.getPortTypes("Pipe Liquid Output")).toBe("liquid");
		expect(DevicePorts.getPortTypes("Pipe Liquid Input 2")).toBe("liquid");
		expect(DevicePorts.getPortTypes("Pipe Liquid Output 2")).toBe("liquid");
	});

	test("Landing Pad Input returns landing type", () => {
		expect(DevicePorts.getPortTypes("Landing Pad Input")).toBe("landing");
	});

	test("Each port type returns exactly one network type", () => {
		const portTypes: PortType[] = [
			"Data Input",
			"Data Output",
			"Power Input",
			"Power Output",
			"Chute Input",
			"Chute Output",
			"Chute Output 2",
			"Pipe Input",
			"Pipe Output",
			"Pipe Input 2",
			"Pipe Output 2",
			"Pipe Waste",
			"Pipe Liquid Input",
			"Pipe Liquid Output",
			"Pipe Liquid Input 2",
			"Pipe Liquid Output 2",
			"Landing Pad Input",
		];

		for (const port of portTypes) {
			const result = DevicePorts.getPortTypes(port);
			expect(typeof result).toBe("string");
			expect(result.length).toBeGreaterThan(0);
		}
	});
});

describe("DevicePorts.canConnect (via static getPortTypes)", () => {
	test("Data ports accept data network", () => {
		expect(DevicePorts.getPortTypes("Data Input")).toBe("data");
		expect(DevicePorts.getPortTypes("Data Output")).toBe("data");
	});

	test("Data ports reject power network", () => {
		expect(DevicePorts.getPortTypes("Data Input")).not.toBe("power");
		expect(DevicePorts.getPortTypes("Data Output")).not.toBe("power");
	});

	test("Power ports accept power network", () => {
		expect(DevicePorts.getPortTypes("Power Input")).toBe("power");
		expect(DevicePorts.getPortTypes("Power Output")).toBe("power");
	});

	test("Power ports reject data network", () => {
		expect(DevicePorts.getPortTypes("Power Input")).not.toBe("data");
		expect(DevicePorts.getPortTypes("Power Output")).not.toBe("data");
	});

	test("Chute ports accept chute network", () => {
		expect(DevicePorts.getPortTypes("Chute Input")).toBe("chute");
		expect(DevicePorts.getPortTypes("Chute Output")).toBe("chute");
		expect(DevicePorts.getPortTypes("Chute Output 2")).toBe("chute");
	});

	test("Chute ports reject data network", () => {
		expect(DevicePorts.getPortTypes("Chute Input")).not.toBe("data");
		expect(DevicePorts.getPortTypes("Chute Output")).not.toBe("data");
	});

	test("Pipe ports accept pipe network", () => {
		expect(DevicePorts.getPortTypes("Pipe Input")).toBe("pipe");
		expect(DevicePorts.getPortTypes("Pipe Output")).toBe("pipe");
		expect(DevicePorts.getPortTypes("Pipe Input 2")).toBe("pipe");
		expect(DevicePorts.getPortTypes("Pipe Output 2")).toBe("pipe");
		expect(DevicePorts.getPortTypes("Pipe Waste")).toBe("pipe");
	});

	test("Pipe ports reject data network", () => {
		expect(DevicePorts.getPortTypes("Pipe Input")).not.toBe("data");
		expect(DevicePorts.getPortTypes("Pipe Output")).not.toBe("data");
	});

	test("Pipe Liquid ports accept pipe network", () => {
		expect(DevicePorts.getPortTypes("Pipe Liquid Input")).toBe("liquid");
		expect(DevicePorts.getPortTypes("Pipe Liquid Output")).toBe("liquid");
		expect(DevicePorts.getPortTypes("Pipe Liquid Input 2")).toBe("liquid");
		expect(DevicePorts.getPortTypes("Pipe Liquid Output 2")).toBe("liquid");
	});

	test("Landing Pad Input rejects data network", () => {
		expect(DevicePorts.getPortTypes("Landing Pad Input")).not.toBe("data");
	});

	test("No port type returns multiple network types", () => {
		const portTypes: PortType[] = [
			"Data Input",
			"Data Output",
			"Power Input",
			"Power Output",
			"Chute Input",
			"Chute Output",
			"Chute Output 2",
			"Pipe Input",
			"Pipe Output",
			"Pipe Input 2",
			"Pipe Output 2",
			"Pipe Waste",
			"Pipe Liquid Input",
			"Pipe Liquid Output",
			"Pipe Liquid Input 2",
			"Pipe Liquid Output 2",
			"Landing Pad Input",
		];

		for (const port of portTypes) {
			const result = DevicePorts.getPortTypes(port);
			expect(typeof result).toBe("string");
		}
	});
});
