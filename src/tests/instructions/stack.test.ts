import { describe, expect, test } from "bun:test";
import { DevChipHousing, DevDevice } from "../../core/DevDevice";
import DevEnv from "../../core/DevEnv";
import instructions from "../../instructions";
import { runFuncWithMem, runWithMen } from "../testUtils";

describe("stack in housing", () => {
	test("put", async () => {
		const chipHousing = new DevChipHousing(123)
		const mem = new DevEnv(chipHousing)
		await runWithMen(`move r1 3`, mem)
		await runWithMen(`push r1`, mem)
		expect(chipHousing.stack.get(0)).toBe(3)
	})
	test("pop", async () => {
		const mem = new DevEnv()
		await runWithMen(`move r1 3`, mem)
		await runWithMen(`push r1`, mem)
		await runWithMen(`pop r0`, mem)
		expect(mem.get("r0")).toBe(3)
		expect(mem.get("sp")).toBe(0)
	})
	test("peek", async () => {
		const mem = new DevEnv()
		await runWithMen(`move r1 3`, mem)
		await runWithMen(`push r1`, mem)
		await runWithMen(`peek r0`, mem)
		expect(mem.get("r0")).toBe(3)
		expect(mem.get("sp")).toBe(1)
	})

	test("get db", async () => {
		const chipHousing = new DevChipHousing(123)
		const mem = new DevEnv(chipHousing)
		await runWithMen(`move r1 8`, mem)
		await runWithMen(`poke r1 3`, mem)
		await runFuncWithMem(instructions.get, ["r0", "db", "r1"], mem)
		await runFuncWithMem(instructions.get, ["r2", "db", 8], mem)
		expect(mem.get("r0")).toBe(3)
		expect(mem.get("r2")).toBe(3)
	})
})

describe("stack in external devices", () => {
	test("putd", async () => {
		const device = new DevDevice(123)
		const mem = new DevEnv()
		mem.appendDevice(device)
		await runWithMen(`move r2 0`, mem)
		await runWithMen(`move r1 3`, mem)
		await runWithMen(`putd 123 r2 r1`, mem)
		expect(device.stack.get(0)).toBe(3)
	})
	test("getd", async () => {
		const mem = new DevEnv()
		mem.appendDevice(123, 123, 123)
		await runWithMen(`putd 123 0 3`, mem)
		await runWithMen(`getd r0 123 0`, mem)
		expect(mem.get("r0")).toBe(3)
	})
})
