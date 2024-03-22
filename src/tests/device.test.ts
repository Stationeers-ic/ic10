import { describe, expect, test } from "bun:test"
import { runFuncWithMem, runThrow, runWithMen } from "./testUtils"
import DevEnv from "../core/DevEnv"
import { instructions } from "../instructions"

describe("device", () => {
	test("s", async () => {
		expect(runThrow(`s d0 On 1`)).resolves.toMatchSnapshot()
		const mem = new DevEnv()
		const a = mem.appendDevice(123)

		mem.attachDevice(a, "d0")
		await runWithMen(`s d0 On 1`, mem)
		expect(mem.get("d0.On")).toBe(1)

		await runWithMen(`alias test d0\ns test On 2`, mem)
		expect(mem.get("d0.On")).toBe(2)
	})

	test("s&l", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		await runWithMen(`s d0 On 99`, mem)
		expect(mem.get("d0.On")).toBe(99)
		await runWithMen(`l r0 d0 On`, mem)
		expect(mem.get("r0")).toBe(99)
	})

	test("sb&lb", async () => {
		const mem = new DevEnv()
		mem.appendDevice(123)
		mem.appendDevice(123)
		const t = mem.appendDevice(123)
		await runWithMen(`sb 123 On 1`, mem)
		expect(mem.getDevices().get(t)?.["On"]).toBe(1)
		await runWithMen(`lb r0 123 On Sum`, mem)
		expect(mem.get("r0")).toBe(3)
	})

	test("sdse&sdns", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		mem.set("r0", 5)
		expect(runFuncWithMem(instructions.sdse, ["r0", "d0"], mem)).resolves.toBe(1)
		mem.set("r0", 5)
		expect(runFuncWithMem(instructions.sdse, ["r0", "d1"], mem)).resolves.toBe(0)
		mem.set("r0", 5)
		expect(runFuncWithMem(instructions.sdns, ["r0", "d0"], mem)).resolves.toBe(0)
		mem.set("r0", 5)
		expect(runFuncWithMem(instructions.sdns, ["r0", "d1"], mem)).resolves.toBe(1)
	})

	test("ss", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		await runWithMen(`ss d0 0 On 1`, mem)
		expect(mem.get("d0.Slots.0.On")).toBe(1)
	})

	test("lr", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		mem.set("d0.Reagents.1.123", 2)
		expect(runFuncWithMem(instructions.lr, ["r0", "d0", 1, 123], mem)).resolves.toBe(2)
	})
})
