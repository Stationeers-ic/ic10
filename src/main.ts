import { Environment } from "./abstract/Environment"
import { Line } from "./core/Line"
import { InfiniteLoop } from "./errors/InfiniteLoop"
import { Err } from "./abstract/Err"

export class InterpreterIc10 {
	constructor(
		public readonly env: Environment,
		private code: string,
	) {}

	public setCode(code: string) {
		this.code = code
	}

	parseCode() {
		return new Map(
			this.code
				.split("\n")
				.map((str) => str.trim().replace(/\s+/g, " "))
				.filter((str) => str)
				.map((str, i) => {
					const l = new Line(this, str, i)
					if (l.fn?.endsWith(":")) {
						const label = l.fn?.split(":")[0]
						this.env.alias(label, i)
					}
					return [i, l]
				}),
		)
	}

	public async run() {
		try {
			this.env.lines = this.parseCode()
			const size = this.env.lines.size
			while (this.env.line < size) {
				const old = this.env.line
				const line = this.env.getCurrentLine()
				// Запуск строки
				if (line) {
					await line.run()
					await this.env.afterLineRun(line)
				}
				// Проверка не прыжок
				if (old === this.env.line) {
					this.env.line++
				}
				// Проверка на бесконечный цикл
				let whileTrueLine = [...this.env.lines].filter(([, l]) => l.runCounter > this.env.InfiniteLoopLimit)
				if (whileTrueLine.length) {
					this.env.throw(
						new InfiniteLoop(
							`Infinite loop detected at line ${whileTrueLine[0][0]}`,
							"error",
							whileTrueLine[0][0],
						),
					)
				}
				let ErrLine = this.env.errors.filter((err) => err.level === "error")
				if (ErrLine.length) {
					break
				}
			}
		} catch (e: Err | unknown) {
			if (e instanceof Err) {
				this.env.throw(e)
			} else {
				throw e
			}
		}
	}
}
