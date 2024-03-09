import { describe, expect, test } from "bun:test"
import { run } from "./testUtils"
// находим баг пишем сюда тест и чиним 😁
describe("bugFixes", () => {
	test.todo("Channels", async () => {
		expect(
			(
				await run(`
s d0:1 Channel1 10
l r0 d0:1 Channel1
		`)
			).get("r0"),
		).toBe(10)
	})
	test.todo("Channels rrr", async () => {
		expect(
			(
				await run(`
move r5 1
s dr5:1 Channel1 10
l r0 d1:1 Channel1
		`)
			).get("r0"),
		).toBe(10)
	})
})
