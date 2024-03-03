import {describe, expect, test} from "bun:test"
import {runThrow} from "./testUtils"
// находим баг пишем сюда тест и чиним 😁
describe("bugFixes", () => {
	test("move", () => {
		expect(runThrow(`s d4 Setting 1`)).resolves.toBeArrayOfSize(0)
	})
})
