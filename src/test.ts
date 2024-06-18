import { hash } from "."
import { PrefabHash,Name } from "./abstract/Device"
import { DevDevice, DevChipHousing } from "./core/DevDevice"
import DevEnv from "./core/DevEnv"
import { runFuncWithMem, runWithMen } from "./tests/testUtils"

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
