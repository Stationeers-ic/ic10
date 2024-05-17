import { Token } from "./lexer"

export type Line = {
	tokens: Token[]
	start: number
	end: number
	length: number
	line: number
}

export function getLines(tokens: Token[]): Line[] {
	// split by TOKEN_TYPES.ENDOFLINE
	const lines: Line[] = []
	let line = 0
	let start = 0
	let thisLine: Token[] = []
	tokens.forEach((token, i) => {
		if (token.type === "COMMENT") return
		if (token.type === "ENDOFLINE" || token.type === "EOF") {
			lines.push({
				tokens: thisLine,
				start,
				end: token.start,
				length: token.start - start,
				line,
			})
			thisLine = []
			start = token.end
			line++
		} else {
			thisLine.push(token)
		}
	})
	return lines
}
