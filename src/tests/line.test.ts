import { describe, expect, test } from "bun:test"
import CRC32 from "crc-32"
import Line from "../core/Line"
import InterpreterIc10 from "../InterpreterIc10"
import DevEnv from "../core/DevEnv"

describe("bugFixes", () => {
	const ic10 = new InterpreterIc10(new DevEnv(), "")
	test("Line", async () => {
		const line = new Line(ic10, "define hello 123", 0)
		expect(line.fn).toBe("define")
		expect(line.args).toStrictEqual(["hello", 123])
	})
	test("Line Hash", async () => {
		const line = new Line(ic10, 'move r0 HASH("Hello there")', 0)
		expect(line.fn).toBe("move")
		expect(line.args).toStrictEqual(["r0", CRC32.str("Hello there")])
	})
})
