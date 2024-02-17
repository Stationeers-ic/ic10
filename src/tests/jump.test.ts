import { describe, expect, test } from "bun:test"
import { runFunc, runFuncJump } from "./testUtils"
import { jump } from "../functions/jump"

describe("jump", () => {
	test("add", () => {
		expect(runFuncJump(jump., ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
	})
})
