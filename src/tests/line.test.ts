import { expect, test } from "bun:test"
import { parse } from "../diagnostics/lexer"
import { getLines } from "../diagnostics/lines"

test("lines", () => {
	const tokens = getLines(parse("1 one 2\n3 two 4\n5 tree 6"))
	expect(tokens.length).toBe(3)
	expect(tokens[0].tokens.length).toBe(3)
	expect(tokens[1].tokens.length).toBe(3)
	expect(tokens[2].tokens.length).toBe(3)
	expect(tokens[0].tokens[0].value).toBe("1")
	expect(tokens[1].tokens[1].value).toBe("two")
	expect(tokens[2].tokens[2].value).toBe("6")
	expect(tokens[0].start).toBe(0)
	expect(tokens[0].end).toBe(7)
	expect(tokens[2].start).toBe(16)
	expect(tokens[2].end).toBe(24)
	expect(tokens[0].length).toBe(7)
	expect(tokens[2].length).toBe(8)
	expect(tokens[0].line).toBe(0)
	expect(tokens[2].line).toBe(2)
})
