import {InterpreterIc10} from "../main.js";
import {DevEnv} from "../DevEnv.js";

(async () => {

    const mem = new DevEnv();
    try {
        const a = new InterpreterIc10(mem, `
mod r0 -4 0
`
        )
        await a.run()
    } catch (e) {
        console.error(e)
    }
    console.log(mem.data)
    // console.log(mem.aliases)
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