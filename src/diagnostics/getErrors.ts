import { parse, Token } from "./lexer"
import { getLines, Line } from "./lines"
import { record, ZodTypeAny } from "zod"
import instructions, { instructionsNames } from "../instructions"
import { AnyInstructionName } from "../ZodTypes"
import { TOKEN_TYPES } from "./lexerTokens"
import { findBestMatch } from "../tools/stringSimilarity"

type lexerInstruction = {
	name: keyof typeof instructions
	arguments: [] | [ZodTypeAny, ...ZodTypeAny[]]
}
function entries<T>(text: string): [] {
	return []
}
const lexerInstructions: Partial<Record<AnyInstructionName, lexerInstruction>> = {}
;(
	Object.entries(instructions) as [keyof typeof instructions, (typeof instructions)[keyof typeof instructions]][]
).forEach(([name, instruction]) => {
	lexerInstructions[name] = {
		name,
		arguments: instruction.validate.items,
	}
})

export const ErrorTypes = {
	UNEXPECTED_TOKEN: "UNEXPECTED_TOKEN",
	UNRECOGNIZED_INSTRUCTION: "UNRECOGNIZED_INSTRUCTION",
} as const
export type ErrorTypes = (typeof ErrorTypes)[keyof typeof ErrorTypes]

export type Error = {
	type: ErrorTypes
	start: number
	end: number
	line: {
		start: number
		end: number
		index: number
	}
	token?: Token
	expected?: (TOKEN_TYPES | "NONE")[]
	received: TOKEN_TYPES | "MULTIPLE"
	suggested?: string
}

function getError(
	lines: Line[],
	type: ErrorTypes,
	start: number,
	end: number,
	received: TOKEN_TYPES | "MULTIPLE",
	expected?: (TOKEN_TYPES | "NONE")[],
): Error {
	const { start: lStart, line } = lines.find((line) => line.start <= start && line.end >= end) ?? {}
	const error: Error = {
		type,
		start,
		end,
		line: {
			start: lStart === undefined ? -1 : start - lStart,
			end: lStart === undefined ? -1 : end - lStart,
			index: line ?? -1,
		},
		received,
	}
	if (expected) error.expected = expected
	return error
}
function getErrorFromToken(lines: Line[], type: ErrorTypes, token: Token, expected?: (TOKEN_TYPES | "NONE")[]): Error {
	const { start: lStart, line } = lines.find((line) => line.start <= token.start && line.end >= token.end) ?? {}
	const error: Error = {
		type,
		start: token.start,
		end: token.end,
		line: {
			start: lStart === undefined ? -1 : token.start - lStart,
			end: lStart === undefined ? -1 : token.end - lStart,
			index: line ?? -1,
		},
		received: token.type,
		token: token,
	}
	if (expected) error.expected = expected
	return error
}

export function getErrors(lines: Line[]) {
	const errors: Error[] = []
	lines.forEach((line, i) => {
		if (line.tokens.length === 0) return
		const firstToken = line.tokens[0]
		if (firstToken.type === TOKEN_TYPES.ALIAS && line.tokens.length === 1) {
			const error = getErrorFromToken(lines, ErrorTypes.UNEXPECTED_TOKEN, firstToken, [
				TOKEN_TYPES.INSTRUCTION,
				TOKEN_TYPES.LABEL,
			])
			if (firstToken.value) error.suggested = firstToken.value + ":"
			errors.push(error)
		} else if (firstToken.type !== TOKEN_TYPES.INSTRUCTION && firstToken.type !== TOKEN_TYPES.LABEL) {
			const error = getErrorFromToken(lines, ErrorTypes.UNRECOGNIZED_INSTRUCTION, firstToken, [
				TOKEN_TYPES.INSTRUCTION,
			])
			const value = firstToken.value
			if (value) {
				const x = findBestMatch(value, instructionsNames)
				if (x !== null && x[1] <= 2) error.suggested = x[0]
			}
			errors.push(error)
		}
		if (firstToken.type !== TOKEN_TYPES.INSTRUCTION && firstToken.type !== TOKEN_TYPES.LABEL) return
		if (firstToken.type === TOKEN_TYPES.LABEL && line.tokens.length !== 1) {
			if (line.tokens.length === 2) {
				const error = getErrorFromToken(lines, ErrorTypes.UNEXPECTED_TOKEN, line.tokens[1], ["NONE"])
				errors.push(error)
				return
			}
			const error = getError(
				lines,
				ErrorTypes.UNEXPECTED_TOKEN,
				line.tokens[1].start,
				line.tokens[line.tokens.length - 1].end,
				"MULTIPLE",
				["NONE"],
			)
			errors.push(error)
			return
		}
		line.tokens.forEach((token, j) => {
			if (token === firstToken) return
		})
	})

	return errors
}
