import { InterpreterIc10 } from "../"
import DevEnv from "../DevEnv"
;(async () => {
	const mem = new DevEnv()
	mem.on("error", (e) => console.error(e.format()))
	// mem.on("warn", (e) => console.warn(e))

	try {
		const a = new InterpreterIc10(
			mem,
			`
			alias test d0
`,
		)
		await a.testCode()
	} catch (e: unknown) {
		console.error("ПИЗДЕЦ Бляяяяяяяя", e)
	}
})()
