import { describe, expect, test } from "bun:test"
import { run, runThrow } from "./testUtils"


describe("throw", () => {
	test("move", async () => {
		expect(runThrow(`move`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`move 1 1`)).resolves.toBeArrayOfSize(1)
	})
	test("alias", async () => {
		expect(runThrow(`alias`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias 1 1`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias d0 1`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias test d0`)).resolves.toBeArrayOfSize(0)
		expect(runThrow(`alias d0 test`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias r0 test`)).resolves.toBeArrayOfSize(1)
		expect(runThrow(`alias test r0`)).resolves.toBeArrayOfSize(0)
	})
})
