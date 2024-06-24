import { hash } from "."
import { Name, PrefabHash } from "./abstract/Device"
import { DevDevice } from "./core/DevDevice"
import DevEnv from "./core/DevEnv"
import jump from "./instructions/jump"
import { runFuncJump, runWithMen } from "./tests/testUtils"

const mem = new DevEnv()
const device = new DevDevice(336213101)
device.PrefabHash = PrefabHash.fromNumber(336213101)
device.Name = Name.fromString("Autolathe")
const a = mem.appendDevice(device, hash("Autolathe"))
await runWithMen(
	`alias Machine r7\n
			alias MachineHash r10\n
			define Autolathe 336213101\n
			move Machine HASH("Autolathe")\n
			lbn MachineHash Autolathe Machine PrefabHash 1`,
	mem,
)
console.log(device.stack.get(0)) // 3

// console.log(runFuncJump(jump.j, ["r0"], 10, { r0: 1 })) // 10
