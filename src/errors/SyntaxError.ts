import type { ZodError, ZodIssue } from "zod"
import type Line from "../core/Line"
import type { Position } from "../regexps"
import Err from "../abstract/Err"

export class SyntaxError extends Err {
	public readonly name: string

	constructor(
		message: string,
		public level: "error" | "warn" | "info" | "debug" = "error",
		public lineStart?: number,
		public lineEnd?: number,
		public charStart?: number,
		public charEnd?: number,
	) {
		super(message, level, lineStart, lineEnd, charStart, charEnd)
		this.name = "SyntaxError"
	}

	static fromZod(zodError: ZodError, line: Line<any>): SyntaxError[] {
		const errors: SyntaxError[] = []
		const defaultError = (e: ZodIssue, line: Line) => {
			errors.push(new SyntaxError(e.message, "error", line.lineIndex, line.lineIndex, 0, line.line.length))
		}
		zodError.errors.forEach((e) => {
			if (e.path.length === 0) {
				return defaultError(e, line)
			}
			e.path.forEach((opIndex) => {
				const tokens = line.tokens
				if (!tokens) {
					return defaultError(e, line)
				}
				const op = Number(opIndex.toString())
				if (isNaN(op)) return defaultError(e, line)
				const p: Position | undefined = tokens.args[op % 1]
				if (typeof p === "undefined") {
					return defaultError(e, line)
				}
				errors.push(new SyntaxError(e.message, "error", line.lineIndex, line.lineIndex, p.start, p.end))
			})
		})
		return errors
	}
}

export default SyntaxError
