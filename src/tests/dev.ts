import DevEnv from "../core/DevEnv"
import {runWithMen} from "./testUtils"

const mem = new DevEnv()
const a = mem.appendDevice(123)
mem.attachDevice(a, "d0")
await runWithMen(`s d0:1 Channel1 10`, mem)

