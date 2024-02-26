import { InterpreterIc10 } from "../"
import { DevEnv } from "../DevEnv"
console.clear()
;(async () => {
	const mem = new DevEnv()
	mem.on("error", (e) => console.error(e))
	mem.on("warn", (e) => console.warn(e))
	try {
		const a = new InterpreterIc10(
			mem,
			`
  move move  r0  r1r1  r1  r1 r1 r1    # 123 24
`,
		)
		await a.run()
	} catch (e) {
		console.error(e)
	}
	console.log("mem.data :>> ", mem.data)
	console.log("mem.aliases :>> ", mem.aliases)
})()

//    `
//     test:
//  alias speaker r2
// alias speaker d1
// move r1 HASH("Pizdeck")
// yield # Switch on-off and see the pin's names
// define cooler -739292323
// yield
// ble r1 373.15 27
// s d2 On 1
// j test
// # Compiled at 2024-02-11 15:21 by Exca's Basic10.
// `
