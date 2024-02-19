import { describe, expect, test } from "bun:test"
import { runThrow } from "./testUtils"

describe("throw", () => {
	test("move", () => {
		expect(runThrow(`move`)).resolves.toMatchSnapshot()
		expect(runThrow(`move 1 1`)).resolves.toMatchSnapshot()
	})
	test("alias", () => {
		expect(runThrow(`alias`)).resolves.toMatchSnapshot()
		expect(runThrow(`alias 1 1`)).resolves.toMatchSnapshot()
		expect(runThrow(`alias d0 1`)).resolves.toMatchSnapshot()
		expect(runThrow(`alias test d0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`alias d0 test`)).resolves.toMatchSnapshot()
		expect(runThrow(`alias r0 test`)).resolves.toMatchSnapshot()
		expect(runThrow(`alias test r0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`alias r0 NaN`)).resolves.toMatchSnapshot()
	})
	test("jump", () => {
		expect(runThrow(`j`)).resolves.toMatchSnapshot()
		expect(runThrow(`j 1`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`j test\ntest:`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`j test`)).resolves.toMatchSnapshot()
	})
	test("stack", () => {
		expect(runThrow(`push 1`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`push 1\npeek r0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`peek r0`)).resolves.toMatchSnapshot()
		expect(runThrow(`push 1\npop r0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`pop r0`)).resolves.toMatchSnapshot()
	})
})
