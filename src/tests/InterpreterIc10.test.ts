import { describe, expect, spyOn, test } from "bun:test"
import InterpreterIc10 from "../InterpreterIc10"
import DevEnv from "../core/DevEnv"

const init = (code: string[]): InterpreterIc10 => {
	return new InterpreterIc10(new DevEnv(), code.join("\n"))
}

describe("InterpreterIc10", () => {
	test("step", () => {
		const ic = init(["move r0 1", "", "add r0 r0 10", "sub r0 r0 1", "mul r0 r0 2"])
		expect(ic.step()).resolves.toBe(true)
		expect(ic.env.get("r0")).toBe(1)
		expect(ic.step()).resolves.toBe(false)
		expect(ic.step()).resolves.toBe(true)
		expect(ic.step()).resolves.toBe(true)
		expect(ic.env.get("r0")).toBe(10)
		expect(ic.step()).resolves.toBe(true)
		expect(ic.step()).resolves.toBe("EOF")
	})
	test("run", () => {
		const ic = init(["move r0 1", "", "add r0 r0 10", "sub r0 r0 1", "mul r0 r0 2"])
		const spy = spyOn(ic, "step")
		expect(ic.run()).resolves.toBe("EOF")
		expect(ic.env.get("r0")).toBe(20)
		expect(spy).toHaveBeenCalledTimes(6)
	})
	test("Infinite loop", () => {
		const ic = init(["", "", "", "j 0"])
		const spy = spyOn(ic, "step")
		expect(ic.run()).resolves.toBe("ERR")
		expect(ic.env.getErrors()).toMatchSnapshot()
		expect(spy).toHaveBeenCalledTimes(2004)
	})
})
