import { expect, test, describe } from "bun:test"
import { getLines } from "../lines"
import { parse } from "../lexer"
import { ErrorTypes, getErrors } from "../getErrors"
import { TOKEN_TYPES } from "../lexerTokens"
describe("getErrors", () => {
	test("slll: hello", () => {
		const errors = getErrors(getLines(parse(`slll: hello`)))
		expect(errors.length).toBe(1)
		expect(errors[0].type).toBe(ErrorTypes.UNEXPECTED_TOKEN)
		expect(errors[0].token?.value).toBe("hello")
		expect(errors[0].line.index).toBe(0)
		expect(errors[0].received).toBe(TOKEN_TYPES.ALIAS)
		expect(errors[0].expected).toEqual(["NONE"])
	})
	test("slll", () => {
		const errors = getErrors(getLines(parse(`slll`)))
		expect(errors.length).toBe(1)
		expect(errors[0].type).toBe(ErrorTypes.UNEXPECTED_TOKEN)
		expect(errors[0].token?.value).toBe("slll")
		expect(errors[0].line.index).toBe(0)
		expect(errors[0].received).toBe(TOKEN_TYPES.ALIAS)
		expect(errors[0].expected).toEqual([TOKEN_TYPES.INSTRUCTION, TOKEN_TYPES.LABEL])
		expect(errors[0].suggested).toBe("slll:")
	})
	test("sl r0", () => {
		const errors = getErrors(getLines(parse(`sl r0`)))
		expect(errors.length).toBe(1)
		expect(errors[0].type).toBe(ErrorTypes.UNRECOGNIZED_INSTRUCTION)
		expect(errors[0].token?.value).toBe("sl")
		expect(errors[0].line.index).toBe(0)
		expect(errors[0].received).toBe(TOKEN_TYPES.ALIAS)
		expect(errors[0].expected).toEqual([TOKEN_TYPES.INSTRUCTION])
		expect(errors[0].suggested).toBe("sll")
	})
})
