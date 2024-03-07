import { getLineRegexGroupPositions, hash, Positions } from "../regexps"
import { InterpreterIc10 } from "../"
import { functions } from "../functions"
import { z, ZodError } from "zod"
import CRC32 from "crc-32"
import { SyntaxError } from "../errors/SyntaxError"
import { AnyFunctionName } from "../ZodTypes"

const LineTest = z
	.tuple([
		z.string(),
		z.string().optional(),
		z
			.string()
			.optional()
			.transform((args) =>
				args
					?.split(" ")
					.filter((i) => i)
					.map((i): number | string => {
						if (!isNaN(parseFloat(i))) return parseFloat(i)
						const h = Line.parseHash(i)
						if (h) return h.toString()
						return i
					}),
			)
			.pipe(z.array(z.union([z.string(), z.number()])).optional()),
		z.string().optional(),
	])
	.nullable()

export class Line {
	fn: string = ""
	args: (string | number)[] = []
	comment: string = ""
	runCounter: number = 0
	isGoTo: boolean
	tokens: Positions | null = null

	constructor(
		private scope: InterpreterIc10,
		public readonly line: string,
		public lineIndex: number,
	) {
		this.parseLine()
		this.isGoTo = this.fn?.endsWith(":") ?? false
	}

	parseLine(): void {
		this.tokens = getLineRegexGroupPositions(this.line)
		if (!this.tokens) {
			return
		}

		this.fn = this.tokens.fn.value
		this.args = this.tokens.args.map((i) => {
			if (!isNaN(parseFloat(i.value))) return parseFloat(i.value)
			const h = Line.parseHash(i.value)
			if (h) return h.toString()
			return i.value
		})
		this.comment = this.tokens.comment.value
	}

	// parse str HASH("SOME_STRING") to crc32(SOME_STRING)
	static parseHash(str: string) {
		const matches = hash.exec(str) as [string, string] | null
		if (matches) {
			return CRC32.str(matches[1])
		}
	}

	public async run(): Promise<Boolean> {
		if (this.fn && !this.fn.endsWith(":")) {
			this.runCounter++
			const fn = AnyFunctionName.safeParse(this.fn)
			if (fn.success) {
				try {
					this.scope.env.emit(`before_${fn.data}`, this.args ?? [], this)
					functions[fn.data](this.scope.env, this.args ?? [])
					this.scope.env.emit(`after_${fn.data}`, this.args ?? [], this)
				} catch (e: ZodError | unknown) {
					if (e instanceof ZodError) {
						// this.scope.env.throw(new SyntaxError(e.errors[0].message, "error"))
						SyntaxError.fromZod(e, this).forEach((e) => this.scope.env.throw(e))
					} else {
						throw e
					}
				}
			} else {
				this.scope.env.throw(
					new SyntaxError(
						`Function ${this.fn} not found`,
						"error",
						this.lineIndex,
						this.lineIndex,
						this.tokens?.fn.start,
						this.tokens?.fn.end,
					),
				)
			}
			return true
		}
		return false
	}
}
