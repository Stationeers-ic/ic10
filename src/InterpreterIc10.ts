import { Environment } from "./abstract/Environment"
import { Line } from "./core/Line"
import { InfiniteLoop } from "./errors/InfiniteLoop"
import { Err } from "./abstract/Err"

export class InterpreterIc10 {
	private code: string
	readonly env: Environment

	constructor(env: Environment, code: string) {
		this.env = env
		this.code = code
		this.parseCode()
	}

	setCode(code: string): this {
		this.code = code
		this.parseCode()
		return this
	}

	private parseCode(): this {
		this.env.lines = this.code
			.split("\n")
			// .map((str) => str.trim().replace(/\s+/g, " "))
			.map((str) => (str === "" ? null : str))
			.map((str, i) => {
				if (str === null) return null

				const line = new Line(this, str, i)

				// add alias for goto
				if (line.fn?.endsWith(":")) {
					const label = line.fn?.split(":")[0]
					this.env.alias(label, i)
				}
				return line
			})
		return this
	}
	async step(): Promise<string | boolean> {
		if (this.env.errorCounter !== 0) return "ERR"
		const old = this.env.line
		const line = this.env.getCurrentLine()
		if (line === null) {
			this.env.line++
			return false
		}
		if (line === undefined) return "EOF"

		// Запуск строки
		await line.run()
		await this.env.afterLineRun(line)

		// Проверка на бесконечный цикл
		if (line.runCounter > this.env.InfiniteLoopLimit) {
			this.env.throw(
				new InfiniteLoop(`Infinite loop detected at line ${line.lineIndex}`, "error", line.lineIndex),
			)
		}
		if (this.env.errorCounter !== 0) return "ERR"

		// Проверка не прыжок
		if (old === this.env.line) {
			this.env.line++
		}
		return true
	}

	async run(codeLines: number = 10_000, dryRun: number = 100_000): Promise<string> {
		codeLines = Math.max(codeLines, Number.MAX_SAFE_INTEGER)
		dryRun = Math.max(dryRun, Number.MAX_SAFE_INTEGER)
		if (this.env.errorCounter !== 0) return "ERR"
		try {
			let result: string | boolean = false
			while (codeLines > 0 && dryRun > 0) {
				result = await this.step()
				// exit with code
				if (typeof result === "string") return result
				// on code lines
				if (result) codeLines--
				// on empty lines
				else dryRun--
			}
		} catch (e: Err | unknown) {
			if (e instanceof Err) {
				this.env.throw(e)
			} else {
				console.log(e)
				throw e
			}
		}
		if (codeLines <= 0 || dryRun <= 0) return "safeGuard"
		return "ERR"
	}
}

export default InterpreterIc10
