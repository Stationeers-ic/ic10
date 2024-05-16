import { describe, expect, test } from "bun:test"
import { getNextToken, parse } from "../lexer"
import { TOKEN_TYPES, TOKENS } from "../lexerTokens"
import { instructionsNames } from "../../instructions"

/*
export function getNextToken(
	index: number,
	text: string,
): [length: number, Omit<Token, "start" | "end" | "length">] | undefined {
	for (const token of TOKENS) {
		if (token.patternType === "string") {
			if (token.pattern.length === 1 && text[index] === token.pattern) {
				return [1, { type: token.token }]
			} else if (text.startsWith(token.pattern, index)) {
				if (/^\W/.test(token.pattern)) return [token.pattern.length, { type: token.token }]
				if (/^\W/.test(text.slice(index + token.pattern.length)))
					return [token.pattern.length, { type: token.token }]
			}
		} else if (token.patternType === "range") {
			const [len, error] = extractTextBetween(index, text, token.open, token.close, token.ignore, token.errorOn)
			if (error === true) continue
			if (typeof error === "string") {
				return [
					len,
					{
						type: token.token,
						value: text.slice(index + token.open.length, index + len),
					},
				]
			}
			if (error === false) {
				return [
					len,
					{
						type: token.token,
						value: text.slice(index + token.open.length, index + len - token.close.length),
					},
				]
			}
		} else if (token.patternType === "function") {
			const result = token.pattern(index, text)
			if (result === null) continue
			return [result[0], { type: token.token, value: result[1] }]
		}
	}
}
*/
test("getNextToken", async () => {
	expect(getNextToken(0, "a")).toEqual([1, { type: TOKEN_TYPES.ALIAS, value: "a" }])
	expect(getNextToken(0, "a b")).toEqual([1, { type: TOKEN_TYPES.ALIAS, value: "a" }])
	expect(getNextToken(2, "a b")).toEqual([1, { type: TOKEN_TYPES.ALIAS, value: "b" }])
	expect(getNextToken(1, "a b")).toBe(null)
})

describe("parse", () => {
	test("general", () => {
		expect(parse("a")).toMatchSnapshot()
		expect(parse("sll")).toMatchSnapshot()
		expect(parse("%1010101\nalias r0 10 d2")).toMatchSnapshot()
	})
	test("hash", () => {
		expect(parse('HASH("hello")')[0]).toEqual({
			type: TOKEN_TYPES.HASH,
			value: "hello",
			start: 0,
			end: 13,
			length: 13,
		})
		expect(parse('HASH("1hello1")')[0]?.value).toBe("1hello1")
		expect(parse('HASH("1hel\nlo1")')[0]?.value).toBe("1hel")
		expect(parse('HASH("1hel"lo1")')[0]?.value).toBe("1hel")
	})
	describe("allFunctionTokens", () => {
		const testCases: Record<string, [string, len: number, value: any][]> = {}
		testCases[TOKEN_TYPES.COMMENT] = [
			["# comment", 2, " comment"],
			["#comment\n10", 4, "comment"],
		]
		testCases[TOKEN_TYPES.NUMBER] = [
			["9.1", 2, "9.1"],
			["11\n33", 4, "11"],
			["10", 2, "10"],
		]
		testCases[TOKEN_TYPES.BINARY] = [
			["%9", 2, "9"],
			["%11\n33", 4, "11"],
			["%10", 2, "10"],
			["%1_0", 2, "1_0"],
		]
		testCases[TOKEN_TYPES.HEX] = [
			["$D", 2, "D"],
			["$1a\n33", 4, "1a"],
			["$10", 2, "10"],
			["$1_F", 2, "1_F"],
		]
		testCases[TOKEN_TYPES.REGISTER] = [
			["r0", 2, "r0"],
			["rrr1\n33", 4, "rrr1"],
			["r22", 2, "r22"],
			["r1", 2, "r1"],
		]
		testCases[TOKEN_TYPES.PORT] = [
			["d0", 2, "d0"],
			["dr1\n33", 4, "dr1"],
			["d22", 2, "d22"],
			["drrr1", 2, "drrr1"],
		]
		testCases[TOKEN_TYPES.INSTRUCTION] = []
		instructionsNames.forEach((name) => {
			testCases[TOKEN_TYPES.INSTRUCTION].push([name, 2, name])
			testCases[TOKEN_TYPES.INSTRUCTION].push([`${name}\n12`, 4, name])
		})
		testCases[TOKEN_TYPES.LABEL] = [
			["d:", 2, "d"],
			["hello:\n33", 4, "hello"],
			["h:", 2, "h"],
		]
		testCases[TOKEN_TYPES.ALIAS] = [
			["dsfh", 2, "dsfh"],
			["dsfh\n33", 4, "dsfh"],
			["adhd1fgh", 2, "adhd1fgh"],
		]
		testCases[TOKEN_TYPES.UNKNOWN] = [
			["222dsfh", 2, "222dsfh"],
			["ds_fh\n33", 4, "ds_fh"],
			["1adhd1fgh", 2, "1adhd1fgh"],
		]
		const usedCases: string[] = []
		test("TestCases", () => {
			TOKENS.filter((t) => t.patternType === "function").forEach((token) => {
				usedCases.push(token.token)
				try {
					expect(Object.keys(testCases)).toContain(token.token)
				} catch (e: any) {
					console.log("No test cases for:", token.token)
					throw e.message
				}
				testCases[token.token].forEach(([c, len, val]) => {
					try {
						expect(parse(c)[0]?.type).toBe(token.token)
						expect(parse(c)[0]?.value).toBe(val)
						expect(parse(c).length).toBe(len)
					} catch (e: any) {
						console.log("On test case:", c)
						throw e.message
					}
				})
			})
		})

		test("AllCasesUsed", () => {
			usedCases.forEach((key) => {
				try {
					expect(usedCases).toContain(key)
				} catch (e: any) {
					console.log("Unused case:", key)
					throw e.message
				}
			})
		})
	})
})
