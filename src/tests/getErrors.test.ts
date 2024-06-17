import { expect, test, describe } from "bun:test"
import { getLines } from "../diagnostics/lines"
import { parse } from "../diagnostics/lexer"
import { ErrorTypes, getErrors } from "../diagnostics/getErrors"
import { TOKEN_TYPES } from "../diagnostics/lexerTokens"
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
	test("alias hello 10", () => {
		const errors = getErrors(getLines(parse(`alias hello 10`)))
		expect(errors.length).toBe(1)
		expect(errors[0].type).toBe(ErrorTypes.UNEXPECTED_TOKEN)
		expect(errors[0].token?.value).toBe("10")
		expect(errors[0].line.index).toBe(0)
		expect(errors[0].received).toBe(TOKEN_TYPES.NUMBER)
		expect(errors[0].expected).toEqual([TOKEN_TYPES.REGISTER, TOKEN_TYPES.PORT])
	})
	test("alias hello r0 %1", () => {
		const errors = getErrors(getLines(parse(`alias hello r0 %1`)))
		expect(errors.length).toBe(1)
		expect(errors[0].type).toBe(ErrorTypes.UNEXPECTED_TOKEN)
		expect(errors[0].token?.value).toBe("1")
		expect(errors[0].line.index).toBe(0)
		expect(errors[0].received).toBe(TOKEN_TYPES.BINARY)
		expect(errors[0].expected).toEqual(["NONE"])
	})
	test("alias", () => {
		const errors = getErrors(getLines(parse(`alias`)))
		expect(errors.length).toBe(2)
		expect(errors[0].type).toBe(ErrorTypes.MISSING_TOKEN)
		expect(errors[0].line.index).toBe(0)
		expect(errors[0].received).toBe("NONE")
		expect(errors[0].expected).toEqual([TOKEN_TYPES.ALIAS])
		expect(errors[1].expected).toEqual([TOKEN_TYPES.REGISTER, TOKEN_TYPES.PORT])
	})
})
