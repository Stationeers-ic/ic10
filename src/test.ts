import { hash } from "."
import { Name, PrefabHash } from "./abstract/Device"
import { DevDevice } from "./core/DevDevice"
import DevEnv from "./core/DevEnv"
import { runWithMen } from "./tests/testUtils"

const mem = new DevEnv()
const device = new DevDevice(336213101)
device.PrefabHash = PrefabHash.fromNumber(336213101)
device.Name = Name.fromString("Autolathe")
const a = mem.appendDevice(device, hash("Autolathe"))
await runWithMen(
	`
	define test 8
	move r0 test
`,
	mem,
)
console.log(device.stack.get(0)) // 3
