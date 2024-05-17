import { parse } from "./lexer"
import { getErrors, type Error } from "./getErrors"
import { getLines } from "./lines"

export function findErrorsInCode(code: string): Error[] {
	return getErrors(getLines(parse(code)))
}

export { parse } from "./lexer"
export { ErrorTypes, getErrors, type Error } from "./getErrors"
export { type Line, getLines } from "./lines"
export { TOKEN_TYPES } from "./lexerTokens"
