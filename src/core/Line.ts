import { hash, type Positions, tokenize } from "../regexps"
import { instructions } from "../instructions"
import { ZodError } from "zod"
import CRC32 from "crc-32"
import { SyntaxError } from "../errors/SyntaxError"
import { AnyInstructionName } from "../ZodTypes"
import Interpreter from "../abstract/Interpreter"
import InterpreterIc10 from "../InterpreterIc10"

export class Line<scope extends Interpreter<any> = InterpreterIc10> {
	fn: string = ""
	args: (string | number)[] = []
	comment: string = ""
	runCounter: number = 0
	isGoTo: boolean
	tokens: Positions | null = null

	constructor(
		private scope: scope,
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
			const val = Line.parseNumber(i.value) ?? Line.parseHash(i.value) ?? i.value
			if (typeof val === "string" && (val.startsWith("$") || val.startsWith("%"))) {
				this.scope
					.getEnv()
					.throw(
						new SyntaxError(
							`Alias cannot start with ${val.startsWith("$") ? "$" : "%"}`,
							"error",
							this.lineIndex,
						),
					)
			}
			return val
		})
		this.comment = this.tokens.comment.value
	}

	// parse str HASH("SOME_STRING") to crc32(SOME_STRING)
	static parseHash(str: string) {
		const matches = hash.exec(str)
		if (matches) {
			return CRC32.str(matches[1])
		}
		return null
	}

	static parseNumber(str: string | number) {
		if (typeof str === "number") {
			return str
		}
		if (str.startsWith("0x") || str.startsWith("0b")) {
			return str
		}
		if (str.startsWith("$") || str.startsWith("%")) {
			str = str.replaceAll("_", "").replace("$", "0x").replace("%", "0b")
		}
		if (!isNaN(Number(str))) return Number(str)
		return null
	}

	public async run(): Promise<Boolean> {
		if (this.fn && !this.fn.endsWith(":")) {
			this.runCounter++
			const fn = AnyInstructionName.safeParse(this.fn)
			if (fn.success) {
				try {
					this.scope.getEnv().emit(`before_${fn.data}`, this.args ?? [], this)
					await instructions[fn.data](this.scope.getEnv(), this.args ?? [])
					this.scope.getEnv().emit(`after_${fn.data}`, this.args ?? [], this)
				} catch (e: ZodError | unknown) {
					if (e instanceof ZodError) {
						// this.scope.env.throw(new SyntaxError(e.errors[0].message, "error"))
						SyntaxError.fromZod(e, this).forEach((e) => this.scope.getEnv().throw(e))
					} else {
						throw e
					}
				}
			} else {
				this.scope
					.getEnv()
					.throw(
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
