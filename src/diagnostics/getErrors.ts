import type { Token } from "./lexer"
import type { Line } from "./lines"
import type { ZodTypeAny } from "zod"
import instructions, { instructionsNames } from "../instructions"
import {
	Alias,
	AliasOrValue,
	AliasOrValueOrNaN,
	AnyInstructionName,
	Device,
	DeviceOrAlias,
	Hash,
	LineIndex,
	Logic,
	Mode,
	Ralias,
	RaliasOrCoerceValue,
	RaliasOrValue,
	RaliasOrValueOrNaN,
	Register,
	RegisterOrDevice,
	RelativeLineIndex,
	RelativeSlotIndex,
	SlotIndex,
	Value,
} from "../ZodTypes"
import { TOKEN_TYPES } from "./lexerTokens"
import { findBestMatch } from "../tools/stringSimilarity"

type lexerInstruction = {
	name: keyof typeof instructions
	arguments: [] | [ZodTypeAny, ...ZodTypeAny[]]
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
	MISSING_TOKEN: "MISSING_TOKEN",
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
	expected?: (TOKEN_TYPES | "NONE" | "VALUE")[]
	received: TOKEN_TYPES | "MULTIPLE" | "NONE"
	suggested?: string
}

function getError(
	lines: Line[],
	type: ErrorTypes,
	start: number,
	end: number,
	received: TOKEN_TYPES | "MULTIPLE" | "NONE",
	expected?: (TOKEN_TYPES | "NONE" | "VALUE")[],
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
function getErrorFromToken(
	lines: Line[],
	type: ErrorTypes,
	token: Token,
	expected?: (TOKEN_TYPES | "NONE" | "VALUE")[],
): Error {
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

function getExpectedTokens(token: AnyInstructionName): (TOKEN_TYPES | "VALUE")[][] {
	const args = lexerInstructions[token]?.arguments
	if (args === undefined) return []
	const result: (TOKEN_TYPES | "VALUE")[][] = []
	for (const arg of args) {
		switch (arg) {
			case Alias:
				result.push([TOKEN_TYPES.ALIAS])
				break
			case AliasOrValue:
			case AliasOrValueOrNaN:
				result.push([TOKEN_TYPES.ALIAS, "VALUE"])
				break
			case Register:
				result.push([TOKEN_TYPES.REGISTER])
				break
			case Device:
				result.push([TOKEN_TYPES.PORT])
				break
			case RegisterOrDevice:
				result.push([TOKEN_TYPES.REGISTER, TOKEN_TYPES.PORT])
				break
			case Value:
				result.push(["VALUE"])
				break
			case Ralias:
				result.push([TOKEN_TYPES.REGISTER, TOKEN_TYPES.ALIAS])
				break
			case DeviceOrAlias:
				result.push([TOKEN_TYPES.PORT, TOKEN_TYPES.ALIAS])
				break
			case RaliasOrValue:
			case SlotIndex:
			case RelativeSlotIndex:
			case LineIndex:
			case RelativeLineIndex:
			case Hash:
			case RaliasOrValueOrNaN:
			case Logic:
			case Mode:
			case RaliasOrCoerceValue:
				result.push([TOKEN_TYPES.REGISTER, TOKEN_TYPES.ALIAS, "VALUE"])
				break
			case RaliasOrValue:
				result.push([TOKEN_TYPES.REGISTER, TOKEN_TYPES.ALIAS, "VALUE"])
				break
			default:
				result.push([])
		}
	}
	return result
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
		if (firstToken.type !== TOKEN_TYPES.INSTRUCTION) return
		const expected = getExpectedTokens(firstToken.value as AnyInstructionName)
		line.tokens.forEach((token, j) => {
			if (token === firstToken) return
			const { type, start, end, length, value } = token
			if (expected[j - 1] === undefined) {
				errors.push(getErrorFromToken(lines, ErrorTypes.UNEXPECTED_TOKEN, token, ["NONE"]))
				return
			}
			if (expected[j - 1].includes(type)) return
			if (expected[j - 1].includes("VALUE"))
				if ([TOKEN_TYPES.BINARY, TOKEN_TYPES.HASH, TOKEN_TYPES.HEX, TOKEN_TYPES.NUMBER].includes(type)) return
			errors.push(getErrorFromToken(lines, ErrorTypes.UNEXPECTED_TOKEN, token, expected[j - 1]))
		})
		for (let j = line.tokens.length; j < expected.length + 1; j++) {
			errors.push(
				getError(
					lines,
					ErrorTypes.MISSING_TOKEN,
					line.tokens[line.tokens.length - 1].end,
					line.end,
					"NONE",
					expected[j - 1],
				),
			)
		}
	})

	return errors
}
