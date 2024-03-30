import type { InterpreterIc10 } from "../InterpreterIc10"
import { hash, type Positions, tokenize } from "../regexps"
import { instructions } from "../instructions"
import { z, ZodError } from "zod"
import CRC32 from "crc-32"
import { SyntaxError } from "../errors/SyntaxError"
import { AnyInstructionName } from "../ZodTypes"

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
		this.tokens = tokenize(this.line)
		if (!this.tokens) {
			return
		}

		this.fn = this.tokens.fn.value
		this.args = this.tokens.args.map((i) => {
			if (!isNaN(Number(i.value))) return Number(i.value)
			const h = Line.parseHash(i.value)
			return h ?? i.value
		})
		this.comment = this.tokens.comment.value
	}

	// parse str HASH("SOME_STRING") to crc32(SOME_STRING)
	static parseHash(str: string) {
		const matches = hash.exec(str)
		if (matches) {
			return CRC32.str(matches[1])
		}
	}

	public async run(): Promise<Boolean> {
		if (this.fn && !this.fn.endsWith(":")) {
			this.runCounter++
			const fn = AnyInstructionName.safeParse(this.fn)
			if (fn.success) {
				try {
					this.scope.env.emit(`before_${fn.data}`, this.args ?? [], this)
					await instructions[fn.data](this.scope.env, this.args ?? [])
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

export default Line
