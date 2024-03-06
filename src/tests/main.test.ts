import { describe, expect, test } from "bun:test"
import { functions } from "../functions"
import data from "./data/data.json"
import { runCode } from "./testUtils"

describe("main", () => {
	test("functions", () => {
		let functionNames: string[] = []
		Object.entries(data).map(function ([key, value]) {
			if (value.type === "Function") {
				if (["debug", "stack", "return"].includes(key)) {
					return
				}
				functionNames.push(key)
			}
		})
		let myf = Object.keys(functions)
		myf = myf.sort()
		functionNames = functionNames.sort()
		expect(functionNames).toEqual(myf)
	})

	test.todo("RRRRRegisters", () => {
		expect(
			runCode(`
		move r5 4
		move r4 3
		move r3 2
		move r2 1
		move r1 0
		move rrrrr5 888
		`),
		).resolves.toBe(888)
	})
})
