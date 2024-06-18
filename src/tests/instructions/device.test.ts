import { describe, expect, test } from "bun:test"
import { runFuncWithMem, runThrow, runWithMen } from "../testUtils"
import DevEnv from "../../core/DevEnv"
import { instructions } from "../../instructions"
import { hash } from "../../index"
import { DevDevice, DevChipHousing } from "../../core/DevDevice"
import { Name, PrefabHash } from '../../abstract/Device';

describe("device", () => {
	test("s", async () => {
		expect(runThrow(`s d0 On 1`)).resolves.toMatchSnapshot()
		const mem = new DevEnv()
		const a = mem.appendDevice(123)

		mem.attachDevice(a, "d0")
		await runWithMen(`s d0 On 1`, mem)
		expect(mem.get("d0.On")).toBe(1)

		await runWithMen(`alias test d0\ns test On 2`, mem)
		expect(mem.get("d0.On")).toBe(2)
	})

	test("l", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		await runWithMen(`s d0 On 99`, mem)
		expect(mem.get("d0.On")).toBe(99)
		await runWithMen(`l r0 d0 On`, mem)
		expect(mem.get("r0")).toBe(99)
	})

	test("sb", async () => {
		const mem = new DevEnv()
		mem.appendDevice(123)
		mem.appendDevice(123)
		const t = mem.appendDevice(123)
		await runWithMen(`sb 123 On 1`, mem)
		expect(mem.getDevices().get(t)?.["On"]).toBe(1)
		await runWithMen(`lb r0 123 On Sum`, mem)
		expect(mem.get("r0")).toBe(3)
	})

	test("sdse", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		mem.set("r0", 5)
		expect(runFuncWithMem(instructions.sdse, ["r0", "d0"], mem)).resolves.toBe(1)
		mem.set("r0", 5)
		expect(runFuncWithMem(instructions.sdse, ["r0", "d1"], mem)).resolves.toBe(0)
		mem.set("r0", 5)
		expect(runFuncWithMem(instructions.sdns, ["r0", "d0"], mem)).resolves.toBe(0)
		mem.set("r0", 5)
		expect(runFuncWithMem(instructions.sdns, ["r0", "d1"], mem)).resolves.toBe(1)
	})

	test("ss", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		await runWithMen(`ss d0 0 On 1`, mem)
		expect(mem.get("d0.Slots.0.On")).toBe(1)
	})

	test("lr", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(123)
		mem.attachDevice(a, "d0")
		mem.set("d0.Reagents.1.123", 2)
		expect(runFuncWithMem(instructions.lr, ["r0", "d0", 1, 123], mem)).resolves.toBe(2)
	})

	test("lbn", async () => {
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
		expect(mem.get("r10")).toBe(336213101)
	})

	test("dr10", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(336213101, hash("Autolathe"))
		mem.attachDevice(a, "d2")
		mem.set("r10", 2)
		mem.set("d2.Setting", 999)
		expect(mem.get("dr10.Setting")).toBe(999)
	})
	test("put", async () => {
		const chipHousing = new DevChipHousing(123)
		const device = new DevDevice(1234)

		const mem = new DevEnv(chipHousing)
		const b = mem.appendDevice(device, hash("Circuit Housing 2"))
		mem.attachDevice(b, "d2")

		await runFuncWithMem(instructions.put, ["db", 10, 999], mem)
		expect(chipHousing.stack.get(10)).toBe(999)
		expect(runFuncWithMem(instructions.put, ["d1", 10, 999], mem)).rejects.toThrow()

		await runFuncWithMem(instructions.put, ["d2", 10, 999], mem)
		expect(device.stack.get(10)).toBe(999)
	})
	test("get", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(-128473777, hash("Circuit Housing"))
		mem.attachDevice(a, "db")
		const b = mem.appendDevice(-128473777, hash("Circuit Housing 2"))
		mem.attachDevice(b, "d2")

		await runFuncWithMem(instructions.put, ["db", 10, 999], mem)
		expect(runFuncWithMem(instructions.get, ["r0", "db", 10], mem)).resolves.toBe(999)

		await runFuncWithMem(instructions.put, ["d2", 10, 999], mem)
		expect(runFuncWithMem(instructions.get, ["r0", "d2", 10], mem)).resolves.toBe(999)
	})

	test("putd", async () => {
		const device = new DevDevice(123)
		const mem = new DevEnv()
		const a = mem.appendDevice(device, hash("Circuit Housing"), -128473777)

		await runFuncWithMem(instructions.putd, [a, 10, 999], mem)
		expect(device.stack.get(10)).toBe(999)
	})
	test("getd", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(-128473777, hash("Circuit Housing"))

		await runFuncWithMem(instructions.putd, [a, 10, 999], mem)
		expect(runFuncWithMem(instructions.getd, ["r0", a, 10], mem)).resolves.toBe(999)
	})

	test("poke", async () => {
		const chipHousing = new DevChipHousing(123)
		const mem = new DevEnv(chipHousing)
		await runFuncWithMem(instructions.poke, [10, 999], mem)
		expect(chipHousing.stack.get(10)).toBe(999)
	})

	test("ld", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(-128473777, hash("Circuit Housing"))
		mem.attachDevice(a, "db")
		mem.setDeviceProp(a, "On", 999)
		await runFuncWithMem(instructions.ld, ["r0", a, "On"], mem)
		expect(mem.get("r0")).toBe(999)
	})

	test("sd", async () => {
		const mem = new DevEnv()
		const a = mem.appendDevice(-128473777, hash("Circuit Housing"))
		mem.attachDevice(a, "db")

		await runFuncWithMem(instructions.sd, [a, "On", 999], mem)
		expect(runFuncWithMem(instructions.ld, ["r0", a, "On"], mem)).resolves.toBe(999)
	})
})
