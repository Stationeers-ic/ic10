import { describe, expect, test } from "bun:test"
import { functions } from "../functions"
import data from "./data/data.json"
import { run, runCode } from "./testUtils"
import DevEnv from "../core/DevEnv"
import { dynamicRegister } from "../core/Helpers"
import CRC32 from "crc-32"

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
	test("dynamicRegister", () => {
		const mem = new DevEnv()
		mem.set("r1", 9)
		mem.set("r9", 5)
		expect(dynamicRegister(mem, "rr1")).toBe("r9")
		expect(dynamicRegister(mem, "rrr1")).toBe("r5")
	})

	test("RRRRRegisters", () => {
		expect(
			runCode(`
		move r5 4
		move r4 3
		move r3 2
		move r2 1
		move r1 0
		move rrrrrr5 888
		`),
		).resolves.toBe(888)
	})

	test("SemlerPDX", async () => {
		expect((await run(`move r0 HASH("Cable Analyzer MAIN OUT")`)).get("r0")).toBe(
			CRC32.str("Cable Analyzer MAIN OUT"),
		)
	})
})
