import { hash, line } from "../regexps"
import { InterpreterIc10 } from "../"
import { functions } from "../functions"
import { z, ZodError } from "zod"
import CRC32 from "crc-32"
import { SyntaxError } from "../errors/SyntaxError"
import { AnyFunctionName } from "../ZodTypes"

export class Line {
	public fn: string | undefined
	public args: any[] | undefined
	public comment: string | undefined
	public runCounter: number = 0

	constructor(
		private scope: InterpreterIc10,
		public line: string,
		public lineIndex: number,
	) {
		this.parseLine()
	}

	parseLine() {
		const m = line.exec(this.line) as [string, string | undefined, string | undefined, string | undefined] | null
		if (m) {
			const [str, fn, args, comment] = m
			const matches = z
				.object({
					str: z.string(),
					fn: z.string().optional(),
					args: z.array(z.union([z.string(), z.number()])).optional(),
					comment: z.string().optional(),
				})
				.parse({
					str,
					fn,
					args: args
						?.split(" ")
						.filter((i) => i)
						.map((i): number | string => {
							if (!isNaN(parseFloat(i))) return parseFloat(i)
							const h = this.parseHash(i)
							if (h) return h.toString()
							return i
						}),
					comment,
				})
			this.fn = matches.fn
			this.args = matches.args
			this.comment = matches.comment
		}
	}

	// parse str HASH("SOME_STRING") to crc32(SOME_STRING)
	parseHash(str: string) {
		const matches = hash.exec(str) as [string, string] | null
		if (matches) {
			return CRC32.str(matches[1])
		}
	}

	public async run() {
		this.runCounter++
		if (this.fn && !this.fn.endsWith(":")) {

			const fn = AnyFunctionName.safeParse(this.fn)
			if (fn.success) {
				try {
					functions[fn.data](this.scope.env, this.args ?? [])
				} catch (e: ZodError | unknown) {
					if (e instanceof ZodError) {
						this.scope.env.throw(new SyntaxError(e.errors[0].message, "error"))
					} else {
						throw e
					}
				}
				return
			} else {
				this.scope.env.throw(new SyntaxError(`Function ${this.fn} not found`, "error"))
			}
		}
	}
}

export default Line
