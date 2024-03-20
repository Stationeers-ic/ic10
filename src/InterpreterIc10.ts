import type Environment from "./abstract/Environment"
import Line from "./core/Line"
import InfiniteLoop from "./errors/InfiniteLoop"
import Err from "./abstract/Err"

export class InterpreterIc10 {
	code: string
	stopRun: boolean = false
	env: Environment

	constructor(env: Environment, code: string) {
		this.env = env
		this.code = code
		this.parseCode()
	}

	public setCode(code: string): this {
		this.code = code
		this.parseCode()
		return this
	}

	public setEnv(env: Environment): this {
		this.env = env
		this.parseCode()
		return this
	}

	public parseCode(): this {
		this.code
			.split("\n")
			// .map((str) => str.trim().replace(/\s+/g, " "))
			.map((str) => (str.trim() === "" ? null : str))
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
			.forEach((line) => {
				this.env.addLine(line)
			})
		return this
	}

	public async testCode() {
		this.env.isTest = true
		const lines = await this.env.getLines()
		for (const line in lines) {
			lines[line]?.run()
		}
	}

	public async step(): Promise<string | boolean> {
		const old = await this.env.getPosition()
		const line = await this.env.getCurrentLine()
		if (line === null) {
			await this.env.addPosition(1)
			await this.env.afterLineRun()
			return false
		}
		if (line === undefined) return "EOF"

		await this.env.beforeLineRun(line)
		// Запуск строки
		await line.run()

		// Проверка на бесконечный цикл
		if (line.runCounter > this.env.InfiniteLoopLimit) {
			await this.env.throw(
				new InfiniteLoop(`Infinite loop detected at line ${line.lineIndex}`, "error", line.lineIndex),
			)
		}

		// Проверка не прыжок
		if (old === (await this.env.getPosition())) {
			await this.env.addPosition(1)
		}
		await this.env.afterLineRun(line)
		return true
	}

	public async run(codeLines: number = 10_000, dryRun: number = 100_000): Promise<string> {
		codeLines = Math.min(codeLines, Number.MAX_SAFE_INTEGER)
		dryRun = Math.min(dryRun, Number.MAX_SAFE_INTEGER)
		this.stopRun = false
		if ((await this.env.getErrorCount()) !== 0) return "ERR"
		try {
			let result: string | boolean = false
			while (codeLines > 0 && dryRun > 0 && !this.stopRun) {
				result = await this.step()
				// exit with code
				if (typeof result === "string") return result
				if ((await this.env.getErrorCount()) !== 0) return "ERR"
				// on code lines
				if (result) codeLines--
				// on empty lines
				else dryRun--
			}
		} catch (e: Err | unknown) {
			if (e instanceof Err) {
				this.env.throw(e)
			} else {
				throw e
			}
		}
		if (codeLines <= 0 || dryRun <= 0) return "safeGuard"
		if (this.stopRun) return "STOP"
		return "ERR"
	}

	public stop() {
		this.stopRun = true
	}
}

export default InterpreterIc10
