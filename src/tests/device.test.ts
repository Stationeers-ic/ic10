import { describe, expect, test } from "bun:test"
import { runFuncJump } from "./testUtils"
import { jump } from "../functions/jump"

describe("device", () => {
	test("j", () => {
		expect(runFuncJump(jump.j, [5], 10)).resolves.toBe(5)
	})
})
