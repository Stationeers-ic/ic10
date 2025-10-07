import _ from "lodash";
import DEVICES from "@/Defines/devices";

interface Logic {
	name: string;
	permissions: string[];
}

interface Slot {
	SlotName: string;
	SlotType: string;
	SlotIndex: number;
	logic: string[];
}

interface Device {
	id: number;
	Title: string;
	Key: string;
	PrefabName: string;
	PrefabHash: number;
	hasChip: boolean;
	deviceConnectCount: number;
	image: string;
	mods: any[];
	connections: string[];
	hasMemory: boolean;
	memoryAccess: any;
	memorySize: any;
	logicInstructions: any[];
	slots: Slot[];
	tags: string[];
	logics: Logic[];
}

interface Devices {
	[key: string]: Device;
}

function getUniqueValuesByPath(devices: Devices, path: string): any[] {
	const pathSegments = path.split(".");

	function isPrimitive(value: any): boolean {
		return (
			value === null ||
			typeof value === "string" ||
			typeof value === "number" ||
			typeof value === "boolean" ||
			typeof value === "undefined"
		);
	}

	function collectValues(obj: any, segments: string[], currentIndex: number): any[] {
		if (currentIndex >= segments.length) {
			return [];
		}

		const currentSegment = segments[currentIndex];
		const isLastSegment = currentIndex === segments.length - 1;

		if (currentSegment === "*") {
			const results: any[] = [];

			if (Array.isArray(obj)) {
				for (const item of obj) {
					if (isLastSegment) {
						if (isPrimitive(item)) {
							results.push(item);
						}
					} else {
						results.push(...collectValues(item, segments, currentIndex + 1));
					}
				}
			} else if (typeof obj === "object" && obj !== null) {
				for (const key in obj) {
					if (isLastSegment) {
						const value = obj[key];
						if (isPrimitive(value)) {
							results.push(value);
						}
					} else {
						results.push(...collectValues(obj[key], segments, currentIndex + 1));
					}
				}
			}
			return results;
		} else {
			const value = obj[currentSegment];
			if (value === undefined || value === null) {
				return [];
			}

			if (isLastSegment) {
				if (isPrimitive(value)) {
					return [value];
				} else {
					throw new Error(`Path leads to non-primitive type: ${typeof value}`);
				}
			} else {
				return collectValues(value, segments, currentIndex + 1);
			}
		}
	}

	const allValues: any[] = [];

	Object.values(devices).forEach((device) => {
		const values = collectValues(device, pathSegments, 0);
		allValues.push(...values);
	});

	return _.uniq(allValues);
}

function testPath(path: string) {
	try {
		console.log(`\nTesting path: "${path}"`);
		const result = getUniqueValuesByPath(DEVICES, path);
		console.table(result);
	} catch (error) {
		console.error(`Error: ${(error as Error).message}`);
	}
}

// Примеры использования
testPath("slots.*.SlotIndex");
testPath("slots.*.SlotType");
// testPath("slots.*.logic.*");
// testPath("tags.*");
// testPath("logics.*.name");
// testPath("slots.*"); // Должен выдать ошибку
// testPath("*"); // Должен выдать ошибку
