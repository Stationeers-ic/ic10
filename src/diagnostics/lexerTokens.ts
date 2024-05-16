import instructions from "../instructions"

export const TOKEN_TYPES = {
	INSTRUCTION: "INSTRUCTION",
	ENDOFLINE: "ENDOFLINE",
	HASH: "HASH",
	REGISTER: "REGISTER",
	LABEL: "LABEL",
	ALIAS: "ALIAS",
	PORT: "PORT",
	NUMBER: "NUMBER",
	BINARY: "BINARY",
	HEX: "HEX",
	COMMENT: "COMMENT",
	EOF: "EOF",
	UNKNOWN: "UNKNOWN",
} as const
export type TOKEN_TYPES = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]
const instructionsKeys = Object.keys(instructions) as unknown as (keyof typeof instructions)[]
export const TOKENS: Array<
	| {
			token: TOKEN_TYPES
			patternType: "string"
			pattern: string
	  }
	| {
			token: TOKEN_TYPES
			patternType: "range"
			open: string
			close: string
			ignore?: string[]
			errorOn?: string[]
	  }
	| {
			token: TOKEN_TYPES
			patternType: "function"
			pattern: (position: number, total: string) => [length: number, value: any] | null
	  }
> = [
	{ token: TOKEN_TYPES.EOF, patternType: "string", pattern: "\u0003" },
	{ token: TOKEN_TYPES.ENDOFLINE, patternType: "string", pattern: "\n" },
	{ token: TOKEN_TYPES.HASH, patternType: "range", open: 'HASH("', close: '")', errorOn: ["\n", '"'] },
	{
		token: TOKEN_TYPES.NUMBER,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^-?\d+(?:\.\d+)?\b/
			const match = reg.exec(total.slice(position))
			if (match === null) return null
			return [match[0].length, match[0]]
		},
	},
	{
		token: TOKEN_TYPES.BINARY,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^%[0-9_]+\b/
			const match = reg.exec(total.slice(position))
			if (match === null) return null
			return [match[0].length, match[0].slice(1)]
		},
	},
	{
		token: TOKEN_TYPES.HEX,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^\$\w+\b/
			const match = reg.exec(total.slice(position))
			if (match === null) return null
			return [match[0].length, match[0].slice(1)]
		},
	},
	{
		token: TOKEN_TYPES.REGISTER,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^(?:r+(?:[0-9]+|a)|sp)\b/
			const match = reg.exec(total.slice(position))
			if (match === null) return null
			return [match[0].length, match[0]]
		},
	},
	{
		token: TOKEN_TYPES.PORT,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^d(?:r+(?:[0-9]+)|[0-9]+|b)(?::[0-9]+)?\b/
			const match = reg.exec(total.slice(position))
			if (match === null) return null
			return [match[0].length, match[0]]
		},
	},
	{
		token: TOKEN_TYPES.INSTRUCTION,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^[a-zA-Z][a-zA-Z0-9]*\b/
			const match = reg.exec(total.slice(position))
			if (match === null) return null
			for (const key of instructionsKeys) {
				// if (total.startsWith(key, position)) return [key.length, key]
				if (match[0] === key) return [key.length, key]
			}
			return null
		},
	},
	{
		token: TOKEN_TYPES.LABEL,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^[a-zA-Z0-9]+:/
			const match = reg.exec(total.slice(position))
			// if start position is 0 return 0
			// else return length of match
			if (match === null) return null
			return [match[0].length, match[0].slice(0, -1)]
		},
	},
	{
		token: TOKEN_TYPES.ALIAS,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^[a-zA-Z][a-zA-Z0-9]*\b/
			const match = reg.exec(total.slice(position))
			// if start position is 0 return 0
			// else return length of match
			if (match === null) return null
			return [match[0].length, match[0]]
		},
	},
	{
		token: TOKEN_TYPES.COMMENT,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^#[^\n\x03]*/
			const match = reg.exec(total.slice(position))
			// if start position is 0 return 0
			// else return length of match
			if (match === null) return null
			return [match[0].length, match[0].slice(1)]
		},
	},
	{
		token: TOKEN_TYPES.UNKNOWN,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^\S+\b/
			const match = reg.exec(total.slice(position))
			// if start position is 0 return 0
			// else return length of match
			if (match === null) return null
			return [match[0].length, match[0]]
		},
	},
]
