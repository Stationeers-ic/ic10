import { describe, expect, test } from "bun:test"
import { runCode, runWithMen } from "./testUtils"
import DevEnv from "../core/DevEnv"
// находим баг пишем сюда тест и чиним 😁
describe("bugFixes", () => {
	test.todo("Channels", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		await runWithMen(`s d0:1 Channel1 10`, mem)
		expect(mem.get("r0")).toBe(10)
	})

	test.todo("Channels rrr", async () => {
		expect(
			runCode(`
move r5 1
s dr5:1 Channel1 10
l r0 d1:1 Channel1
		`),
		).resolves.toBe(10)
	})
})
