import { describe, expect, test } from "bun:test"
import { run } from "./testUtils"
import CRC32 from "crc-32"
// находим баг пишем сюда тест и чиним 😁
describe("bugFixes", () => {
	test("SemlerPDX", async () => {
		expect((await run(`move r0 HASH("Cable Analyzer MAIN OUT")`)).get("r0")).toBe(
			CRC32.str("Cable Analyzer MAIN OUT"),
		)
	})
})
