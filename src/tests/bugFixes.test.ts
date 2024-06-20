import { describe, expect, test } from "bun:test"
import { runCode, runWithMen } from "./testUtils"
import DevEnv from "../core/DevEnv"
import { ChipHousing } from '../abstract/ChipHousing';
import { getProperty } from '../tools/property';
// находим баг пишем сюда тест и чиним 😁
describe("bugFixes", () => {
	test("Channels", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		await runWithMen(`s d0:1 Channel1 10\nl r0 d0:1 Channel1`, mem)
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

	test("err error", () => {
		runCode(`alias r0 test`)
	})

	test("write db", async () => {
		const mem = new DevEnv()
		await runWithMen(`s db Setting 10\nl r0 db Setting`, mem)
		expect(mem.get("r0")).toBe(10)
		expect(mem.chipHousing.getProperty('Setting')).toBe(10)
	})
})
