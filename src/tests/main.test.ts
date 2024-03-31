import { describe, expect, test } from "bun:test"
import { instructions } from "../instructions"
import data from "./data/functions.en.json"
import { run, runCode } from "./testUtils"
import DevEnv from "../core/DevEnv"
import { pathFor_DynamicRegister } from "../core/Helpers"
import CRC32 from "crc-32"
import { z } from "zod"
import { AnyInstructionName } from "../ZodTypes"

describe("main", () => {
	test("functionsHasProto", () => {
		const test = z.tuple([
			AnyInstructionName,
			z.object({
				description: z.string(),
				example: z.string(),
				validate: z.instanceof(z.ZodSchema),
			}),
		])
		Object.entries(instructions).forEach(([key, element]) => {
			const result = test.safeParse([
				key,
				{
					description: element.description,
					example: element.example,
					validate: element.validate,
				},
			])
			if (!result.success) console.error(key, result.error.message)
			expect(result.success).toBe(true)
		})
	})
	// TODO
	test.todo("functions", () => {
		const a = z.array(
			z.object({
				name: z.string(),
				description: z.string(),
			}),
		)
		const result = a.safeParse(data)
		expect(result).toMatchObject({
			success: true,
			data: expect.anything(),
		})
		if (!result.success) return
		expect(data.map((x) => x.name).sort()).toEqual(Object.keys(instructions).sort())
	})
	test("dynamicRegister", () => {
		const mem = new DevEnv()
		mem.set("r1", 9)
		mem.set("r9", 5)
		expect(pathFor_DynamicRegister(mem, "rr1")).toBe("r9")
		expect(pathFor_DynamicRegister(mem, "rrr1")).toBe("r5")
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
