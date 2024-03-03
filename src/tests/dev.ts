import {InterpreterIc10} from "../"
import {DevEnv} from "../DevEnv";

(async () => {
	const mem = new DevEnv()
	mem.on("error", (e) => console.error(e.format()))
	// mem.on("warn", (e) => console.warn(e))

	try {
		const a = new InterpreterIc10(
			mem,
			`
define CableAnalyzer 1036015121
define Button 491845673
define MediumLED -53151617
define LargeLED -1949054743
sb LargeLED Mode 2
sb LargeLED Color 6

`,
		)
		await a.testCode()
	} catch (e: unknown) {
		console.error("ПИЗДЕЦ Бляяяяяяяя", e)
	}
})()
