import { Err } from "../abstract/Err"
import { ZodError, ZodIssue } from "zod"
import Line from "../core/Line"

export class SyntaxError extends Err {
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

	static fromZod(zodError: ZodError, line: Line): SyntaxError[] {
		const errors: SyntaxError[] = []

		const defaultError = (e: ZodIssue, line: Line) => {
			errors.push(new SyntaxError(e.message, "error", line.lineIndex, line.lineIndex, 0, line.line.length))
		}

		zodError.errors.forEach((e) => {
			console.log(e)
			if (e.path.length === 0) {
				return defaultError(e, line)
			}
			e.path.forEach((opIndex) => {
				const args = line.args
				if (args === undefined) {
					return defaultError(e, line)
				}
				const op = args[parseInt(opIndex.toString())].toString()
				console.log(op)
				if (op === undefined) {
					return defaultError(e, line)
				}

				errors.push(
					new SyntaxError(
						e.message,
						"error",
						line.lineIndex,
						line.lineIndex,
						line.line.indexOf(op),
						line.line.indexOf(op) + op.length,
					),
				)
			})
		})
		return errors
	}
}

export default SyntaxError
