import { describe, expect, test } from "bun:test"
import { runFunc, runFuncJump } from "./testUtils"
import { jump } from "../functions/jump"

describe("jump", () => {
	test("j", () => {
		expect(runFuncJump(jump.j, [5], 10)).resolves.toBe(5)
	})
	test("jr", () => {
		expect(runFuncJump(jump.jr, [1], 10)).resolves.toBe(11)
	})
	test("jal", () => {
		expect(runFuncJump(jump.jal, [1], 10)).resolves.toBe(1)
	})
})
