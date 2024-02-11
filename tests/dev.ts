import {InterpreterIc10} from "../src/main";
import {DevEnv} from "../src/DevEnv";
import {functions} from "../src/functions";

// console.log(functions)
const mem = new DevEnv();
(new InterpreterIc10(mem,
    `
add r1 1 2
`
))
console.log(mem.data)
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