import { describe, expect, test } from "bun:test"
import { runThrow } from "./testUtils"

describe("throw", () => {
	test("move", () => {
		expect(runThrow(`move`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`move 1 1`)).resolves.toBeArrayOfSize(1)
	})
	test("alias", () => {
		expect(runThrow(`alias`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias 1 1`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias d0 1`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias test d0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`alias d0 test`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias r0 test`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias test r0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`alias r0 NaN`)).resolves.toBeArrayOfSize(1)
	})
	test("jump", () => {
		expect(runThrow(`j`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`j 1`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`j test`)).resolves.toBeArrayOfSize(0)
	})
	test("stack", () => {
		expect(runThrow(`push 1`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`push 1\npeek r0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`peek r0`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`push 1\npop r0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`pop r0`)).resolves.toBeArrayOfSize(1)
	})
})
