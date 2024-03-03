import {expect, test} from "bun:test"
import CRC32 from "crc-32"

test("hash", () => {
	expect(CRC32.str("StructureAutolathe")).toBe(336213101)
	expect(CRC32.str("ItemCharcoal")).toBe(252561409)
	expect(CRC32.str("ItemAngleGrinder")).toBe(201215010)
})
