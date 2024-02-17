import { describe, expect, test } from "bun:test"
import { run } from "./testUtils"


describe("throw", () => {
	test("move", async () => {
		let mem = await run(`move`)
		expect(mem.errors.length).toBe(1)
		mem = await run(`move 1 1`)
		expect(mem.errors.length).toBe(1)
	})
})
