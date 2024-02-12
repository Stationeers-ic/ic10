import {InterpreterIc10} from "../main.js";
import {DevEnv} from "../DevEnv.js";

(async () => {
    const mem = new DevEnv();
    mem.set('db.Stress', 50)
    try {
        const a = new InterpreterIc10(mem, `
define targetrmp 1000
yield
l r0 db Rpm
l r1 db Stress
bge r0 targetrmp 13
bne r1 0 8
s db Throttle 100
j 12
bge r1 20 11
s db Throttle 10
j 12
s db Throttle 0
j 14
s db Throttle 0
j 1
# Compiled at 2023-12-30 13:03 by Exca's Basic10.
`
        )
        await a.run()
    } catch (e) {
        console.error(e)
    }
    console.log(mem.data)
    console.log(mem.aliases)
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