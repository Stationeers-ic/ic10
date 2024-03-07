import { describe, expect, spyOn, test } from "bun:test"
import { runThrow, runWithMen } from "./testUtils"
import DevEnv from "../DevEnv"

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
		expect(mem.devices.get(t)?.["On"]).toBe(1)
		await runWithMen(`lb r0 123 On Sum`, mem)
		expect(mem.get("r0")).toBe(3)
	})
})
