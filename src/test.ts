import { DevChipHousing } from "./core/DevChipHousing";
import DevEnv from "./core/DevEnv";
import {  runWithMen } from "./tests/testUtils";


const chipHousing = new DevChipHousing(123)
const mem = new DevEnv(chipHousing)
await runWithMen(`move r1 3`, mem)

await runWithMen(`push r1`, mem)
console.log(chipHousing.stack.get(0)) // 3
