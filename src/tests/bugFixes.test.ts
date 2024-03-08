import { describe, expect, test } from "bun:test"
import { run } from "./testUtils"
import CRC32 from "crc-32"
// находим баг пишем сюда тест и чиним 😁
describe("bugFixes", () => {
	test.todo("SemlerPDX", async () => {
		expect((await run(`alias ThisNet r6\nmove ThisNet HASH("Cable Analyzer MAIN OUT")`)).get("r6")).toBe(
			CRC32.str("Cable Analyzer MAIN OUT"),
		)
	})
})
