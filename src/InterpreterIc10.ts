import type Environment from "./abstract/Environment"
import Line from "./core/Line"
import InfiniteLoop from "./errors/InfiniteLoop"
import Err from "./abstract/Err"
import Interpreter, { isStop } from "./abstract/Interpreter"
import DevEnv from "./core/DevEnv"

export class InterpreterIc10<env extends Environment<any> = DevEnv> extends Interpreter<env> {
	code: string
	env: env
	stopRun: boolean = false

	constructor(env: env, code: string) {
		super()
		this.env = env
		this.code = code
		this.parseCode()
	}

	public setCode(code: string): this {
		this.code = code
		return this
	}

	public getCode(): string {
		return this.code
	}

	public setEnv(env: env): this {
		this.env = env
		this.parseCode()
		return this
	}

	public getEnv(): env {
		return this.env
	}

	public parseCode(): this {
		this.getCode()
			.split("\n")
			// .map((str) => str.trim().replace(/\s+/g, " "))
			.map((str) => (str.trim() === "" ? null : str))
			.map((str, i) => {
				if (str === null) return null
				const line = new Line<typeof this>(this, str, i)
				// add alias for goto
				if (line.fn?.endsWith(":")) {
					const label = line.fn?.split(":")[0]
					this.getEnv().label(label, i)
				}
				return line
			})
			.forEach((line) => {
				this.getEnv().addLine(line)
			})
		return this
	}

	public async testCode() {
		this.getEnv().isTest = true
		const lines = await this.getEnv().getLines()
		for (const line in lines) {
			lines[line]?.run()
		}
	}

	public async step() {
		try {
			const old = await this.getEnv().getPosition()
			const line = await this.getEnv().getCurrentLine()
			if (line === null) {
				await this.getEnv().addPosition(1)
				await this.getEnv().afterLineRun()
				return false
			}
			if (line === undefined) return "EOF"

			await this.getEnv().beforeLineRun(line)
			// Запуск строки
			await line.run()

			// Проверка на бесконечный цикл
			if (line.runCounter > this.getEnv().InfiniteLoopLimit) {
				await this.getEnv().throw(
					new InfiniteLoop(`Infinite loop detected at line ${line.lineIndex}`, "error", line.lineIndex),
				)
			}

			// Проверка не прыжок
			if (old === (await this.getEnv().getPosition())) {
				await this.getEnv().addPosition(1)
			}
			await this.getEnv().afterLineRun(line)
		} catch (e: Err | unknown) {
			if (e instanceof Err) {
				this.getEnv().throw(e)
			} else {
				throw e
			}
			return "ERR"
		}
		return true
	}

	public async run(codeLines: number = 10_000, dryRun: number = 100_000) {
		codeLines = Math.min(codeLines, Number.MAX_SAFE_INTEGER)
		dryRun = Math.min(dryRun, Number.MAX_SAFE_INTEGER)
		this.stopRun = false
		if ((await this.getEnv().getErrorCount()) !== 0) return "ERR"

		let result: string | boolean = false
		while (codeLines > 0 && dryRun > 0 && !this.stopRun) {
			result = await this.step()
			// exit with code
			if (isStop(result)) return result
			if ((await this.getEnv().getErrorCount()) !== 0) return "ERR"
			// on code lines
			if (result) codeLines--
			// on empty lines
			else dryRun--
		}

		if (codeLines <= 0 || dryRun <= 0) return "safeGuard"
		if (this.stopRun) return "STOP"
		return "ERR"
	}

	public stop() {
		this.stopRun = true
		return this
	}
}

export default InterpreterIc10
