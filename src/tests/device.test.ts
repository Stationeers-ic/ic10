import { describe, expect, test } from "bun:test"
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
})
