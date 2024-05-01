import { describe, expect, test } from "bun:test"
import DevEnv from "../../core/DevEnv"
import { runWithMen } from "../testUtils"

describe("stack in housing", () => {
	test("put", async () => {
		const mem = new DevEnv()
		await runWithMen(`move r1 3`, mem)
		await runWithMen(`push r1`, mem)
		expect(mem.stack[0]).toBe(3)
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
})

describe("stack in external devices", () => {
	test("putd", async () => {
		const mem = new DevEnv()
		mem.appendDevice(123, 123, 123)
		await runWithMen(`move r2 0`, mem)
		await runWithMen(`move r1 3`, mem)
		await runWithMen(`putd 123 r2 r1`, mem)
		expect(mem.devicesStack.get("123")?.[0]).toBe(3)
	})
	test("getd", async () => {
		const mem = new DevEnv()
		mem.appendDevice(123, 123, 123)
		await runWithMen(`putd 123 0 3`, mem)
		await runWithMen(`getd r0 123 0`, mem)
		expect(mem.get("r0")).toBe(3)
	})
})
