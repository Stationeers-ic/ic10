import { describe, expect, test } from "bun:test"
import { functions } from "../functions"
import data from "./data/data.json"

describe("main", () => {
	test.todo("functions", () => {
		let functionNames: string[] = []
		Object.entries(data).map(function([key, value]) {
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
})
