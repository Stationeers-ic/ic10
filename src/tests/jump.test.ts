import { describe, expect, test } from "bun:test"
import { runFuncJump, runJal } from "./testUtils"
import { jump } from "../instructions/jump"

describe("jump", () => {
	test("j", () => {
		expect(runFuncJump(jump.j, [5], 10)).resolves.toBe(5)
		expect(runFuncJump(jump.j, ["r0"], 10, { r0: 1 })).resolves.toBe(1)
		expect(runFuncJump(jump.j, [-1], 10, { r0: 1 })).rejects.toThrow()
	})
	test("jr", () => {
		expect(runFuncJump(jump.jr, [1], 10)).resolves.toBe(11)
		expect(runFuncJump(jump.jr, [-5], 10)).resolves.toBe(5)
		expect(runFuncJump(jump.jr, [-5], 0)).rejects.toThrow()
	})
	test("jal", () => {
		expect(runJal(jump.jal, [5], 10)).resolves.toEqual({
			line: 5,
			r17: 11,
		})
		expect(runJal(jump.jal, ["r0"], 10, { r0: 1 })).resolves.toEqual({
			line: 1,
			r17: 11,
		})
		expect(runJal(jump.jal, [-1], 10, { r0: 1 })).rejects.toThrow()
	})
	// TODO
})
