import { Environment } from "./abstract/Environment.js"
import { Line } from "./core/Line.js"
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
					this.env.afterLineRun(line)
				}
				// Проверка не прыжок
				if (old === this.env.line) {
					this.env.line++
				}
				// Проверка на бесконечный цикл
				let whileTrueLine = [...this.env.lines].filter(([, l]) => l.runCounter > this.env.InfiniteLoopLimit)
				if (whileTrueLine.length) {
					throw new InfiniteLoop(
						`Infinite loop detected at line ${whileTrueLine[0][0]}`,
						"warn",
						whileTrueLine[0][0],
					)
				}
			}
		} catch (e: Err | unknown) {
			if (e instanceof Err) {
				switch (e.level) {
					case "warn":
						this.env.emit("warn", e)
						break
					case "info":
						this.env.emit("info", e)
						break
					case "debug":
						this.env.emit("debug", e)
						break
					default:
						this.env.emit("error", e)
				}
			} else {
				throw e
			}
		}
	}
}
