import { describe, expect, test } from "bun:test"
import { runFunc } from "./testUtils"
import { instructions } from "../instructions"

describe("arithmetic", () => {
	test("add", () => {
		expect(runFunc(instructions.add, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.add, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.add, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.add, ["r0", 1, 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.add, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.add, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.add, ["r0", "r0", -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.add, ["r0", 1, -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.add, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(-2)
		expect(runFunc(instructions.add, ["r0", -1, "r0"])).resolves.toBe(-1)
	})
	test("sub", () => {
		expect(runFunc(instructions.sub, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.sub, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.sub, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sub, ["r0", 1, 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sub, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sub, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sub, ["r0", "r0", -1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sub, ["r0", 1, -1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sub, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(instructions.sub, ["r0", -1, "r0"])).resolves.toBe(-1)
	})
	test("mul", () => {
		expect(runFunc(instructions.mul, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.mul, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.mul, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(4)
		expect(runFunc(instructions.mul, ["r0", 2, 2], { r0: 2 })).resolves.toBe(4)
		expect(runFunc(instructions.mul, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(4)
		expect(runFunc(instructions.mul, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(4)
		expect(runFunc(instructions.mul, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(-4)
		expect(runFunc(instructions.mul, ["r0", 2, -2], { r0: 2 })).resolves.toBe(-4)
		expect(runFunc(instructions.mul, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(4)
		expect(runFunc(instructions.mul, ["r0", -2, "r0"])).resolves.toBe(0)
	})
	test("div", () => {
		expect(runFunc(instructions.div, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.div, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.div, ["r0", "r0", 2], { r0: 4 })).resolves.toBe(2)
		expect(runFunc(instructions.div, ["r0", 4, 2], { r0: 4 })).resolves.toBe(2)
		expect(runFunc(instructions.div, ["r0", "r0", "r0"], { r0: 4 })).resolves.toBe(1)
		expect(runFunc(instructions.div, ["r0", 4, "r0"], { r0: 4 })).resolves.toBe(1)
		expect(runFunc(instructions.div, ["r0", "r0", -2], { r0: 4 })).resolves.toBe(-2)
		expect(runFunc(instructions.div, ["r0", 4, -2], { r0: 4 })).resolves.toBe(-2)
		expect(runFunc(instructions.div, ["r0", "r0", "r0"], { r0: -4 })).resolves.toBe(1)
		expect(runFunc(instructions.div, ["r0", -4, "r0"])).resolves.toBe(Infinity)
		expect(runFunc(instructions.div, ["r0", -4, -0])).resolves.toBe(Infinity)
	})
	test("mod", () => {
		expect(runFunc(instructions.mod, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.mod, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.mod, ["r0", "r0", 2], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(instructions.mod, ["r0", 4, 2], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(instructions.mod, ["r0", "r0", "r0"], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(instructions.mod, ["r0", 4, "r0"], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(instructions.mod, ["r0", "r0", -2], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(instructions.mod, ["r0", 4, -2], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(instructions.mod, ["r0", "r0", "r0"], { r0: -4 })).resolves.toBe(0)
		expect(runFunc(instructions.mod, ["r0", -4, 0])).resolves.toBeNaN()
		expect(runFunc(instructions.mod, ["r0", -4, -0])).resolves.toBeNaN()
		expect(runFunc(instructions.mod, ["r0", -2, "r0"], { r0: 4 })).resolves.toBe(2)
		expect(runFunc(instructions.mod, ["r0", "r0", -2], { r0: 3 })).resolves.toBe(1)
		expect(runFunc(instructions.mod, ["r0", -0.1, 2], { r0: 4 })).resolves.toBe(1.9)
		expect(runFunc(instructions.mod, ["r0", -1.5, 2], { r0: 4 })).resolves.toBe(0.5)
	})
	test("sqrt", () => {
		expect(runFunc(instructions.sqrt, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.sqrt, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.sqrt, ["r0", 4])).resolves.toBe(2)
		expect(runFunc(instructions.sqrt, ["r0", "r0"], { r0: 4 })).resolves.toBe(2)
		expect(runFunc(instructions.sqrt, ["r0", -4])).resolves.toBeNaN()
		expect(runFunc(instructions.sqrt, ["r0", 2])).resolves.toBe(Math.sqrt(2))
		expect(runFunc(instructions.sqrt, ["r0", 8.8])).resolves.toBe(Math.sqrt(8.8))
	})
	test("round", () => {
		expect(runFunc(instructions.round, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.round, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.round, ["r0", 1.2])).resolves.toBe(1)
		expect(runFunc(instructions.round, ["r0", 1.5])).resolves.toBe(2)
		expect(runFunc(instructions.round, ["r0", 1.8])).resolves.toBe(2)
		expect(runFunc(instructions.round, ["r0", -1.2])).resolves.toBe(-1)
		expect(runFunc(instructions.round, ["r0", -1.5])).resolves.toBe(-1)
		expect(runFunc(instructions.round, ["r0", -1.8])).resolves.toBe(-2)
	})
	test("trunc", () => {
		expect(runFunc(instructions.trunc, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.trunc, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.trunc, ["r0", 1.2])).resolves.toBe(1)
		expect(runFunc(instructions.trunc, ["r0", 1.5])).resolves.toBe(1)
		expect(runFunc(instructions.trunc, ["r0", 1.8])).resolves.toBe(1)
		expect(runFunc(instructions.trunc, ["r0", -1.2])).resolves.toBe(-1)
		expect(runFunc(instructions.trunc, ["r0", -1.5])).resolves.toBe(-1)
		expect(runFunc(instructions.trunc, ["r0", -1.8])).resolves.toBe(-1)
	})
	test("ceil", () => {
		expect(runFunc(instructions.ceil, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.ceil, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.ceil, ["r0", 1.2])).resolves.toBe(2)
		expect(runFunc(instructions.ceil, ["r0", 1.5])).resolves.toBe(2)
		expect(runFunc(instructions.ceil, ["r0", 1.8])).resolves.toBe(2)
		expect(runFunc(instructions.ceil, ["r0", -1.2])).resolves.toBe(-1)
		expect(runFunc(instructions.ceil, ["r0", -1.5])).resolves.toBe(-1)
		expect(runFunc(instructions.ceil, ["r0", -1.8])).resolves.toBe(-1)
	})
	test("floor", () => {
		expect(runFunc(instructions.floor, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.floor, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.floor, ["r0", 1.2])).resolves.toBe(1)
		expect(runFunc(instructions.floor, ["r0", 1.5])).resolves.toBe(1)
		expect(runFunc(instructions.floor, ["r0", 1.8])).resolves.toBe(1)
		expect(runFunc(instructions.floor, ["r0", -1.2])).resolves.toBe(-2)
		expect(runFunc(instructions.floor, ["r0", -1.5])).resolves.toBe(-2)
		expect(runFunc(instructions.floor, ["r0", -1.8])).resolves.toBe(-2)
	})
	test("max", () => {
		expect(runFunc(instructions.max, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.max, ["r0", "r1", 0], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.max, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.max, ["r0", 2, 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.max, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.max, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.max, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.max, ["r0", 2, -2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.max, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(-2)
		expect(runFunc(instructions.max, ["r0", -2, "r0"])).resolves.toBe(0)
	})
	test("min", () => {
		expect(runFunc(instructions.min, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.min, ["r0", "r1", 0], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.min, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.min, ["r0", 2, 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.min, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.min, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.min, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(-2)
		expect(runFunc(instructions.min, ["r0", 2, -2], { r0: 2 })).resolves.toBe(-2)
		expect(runFunc(instructions.min, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(-2)
		expect(runFunc(instructions.min, ["r0", -2, "r0"])).resolves.toBe(-2)
	})
	test("abs", () => {
		expect(runFunc(instructions.abs, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.abs, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.abs, ["r0", 1])).resolves.toBe(1)
		expect(runFunc(instructions.abs, ["r0", -1])).resolves.toBe(1)
		expect(runFunc(instructions.abs, ["r0", 0])).resolves.toBe(0)
	})
	test("log", () => {
		expect(runFunc(instructions.log, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.log, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.log, ["r0", 1])).resolves.toBe(0)
		expect(runFunc(instructions.log, ["r0", Math.E])).resolves.toBe(1)
		expect(runFunc(instructions.log, ["r0", 10])).resolves.toBe(Math.log(10))
	})
	test("exp", () => {
		expect(runFunc(instructions.exp, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.exp, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.exp, ["r0", 0])).resolves.toBe(1)
		expect(runFunc(instructions.exp, ["r0", 1])).resolves.toBe(Math.E)
		expect(runFunc(instructions.exp, ["r0", Math.log(10)])).resolves.toBe(Math.exp(Math.log(10)))
	})
	test("rand", () => {
		expect(runFunc(instructions.rand, ["r0"])).resolves.toBeGreaterThanOrEqual(0)
		expect(runFunc(instructions.rand, ["r0"])).resolves.toBeLessThanOrEqual(1)
	})
	test("sll", () => {
		expect(runFunc(instructions.sll, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.sll, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sll, ["r0", 1, 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sll, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sll, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sll, ["r0", "r0", -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sll, ["r0", 1, -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sll, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(instructions.sll, ["r0", -1, "r0"])).resolves.toBe(-1)
		expect(runFunc(instructions.sll, ["r0", 1, 30])).resolves.toBe(1073741824)
	})
	test("srl", () => {
		expect(runFunc(instructions.srl, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.srl, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.srl, ["r0", 1, 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.srl, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.srl, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.srl, ["r0", "r0", -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.srl, ["r0", 1, -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.srl, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sla", () => {
		expect(runFunc(instructions.sla, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.sla, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sla, ["r0", 1, 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sla, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(instructions.sla, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(2)
	})
	test("sra", () => {
		expect(runFunc(instructions.sra, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.sra, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sra, ["r0", 1, 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sra, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sra, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(0)
	})
	test("sin", () => {
		expect(runFunc(instructions.sin, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.sin, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.sin, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(instructions.sin, ["r0", Math.PI / 2])).resolves.toBe(1)
		expect(runFunc(instructions.sin, ["r0", Math.PI])).resolves.toBeCloseTo(0, 8)
		expect(runFunc(instructions.sin, ["r0", (3 * Math.PI) / 2])).resolves.toBe(-1)
	})
	test("cos", () => {
		expect(runFunc(instructions.cos, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.cos, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.cos, ["r0", 0])).resolves.toBe(1)
		expect(runFunc(instructions.cos, ["r0", Math.PI / 2])).resolves.toBeCloseTo(0, 8)
		expect(runFunc(instructions.cos, ["r0", Math.PI])).resolves.toBe(-1)
		expect(runFunc(instructions.cos, ["r0", (3 * Math.PI) / 2])).resolves.toBeCloseTo(0, 8)
	})
	test("tan", () => {
		expect(runFunc(instructions.tan, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.tan, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.tan, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(instructions.tan, ["r0", Math.PI / 4])).resolves.toBeCloseTo(1, 8)
		expect(runFunc(instructions.tan, ["r0", (Math.PI / 4) * 3])).resolves.toBeCloseTo(-1, 8)
		expect(runFunc(instructions.tan, ["r0", Math.PI])).resolves.toBeCloseTo(0, 8)
	})
	test("asin", () => {
		expect(runFunc(instructions.asin, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.asin, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.asin, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(instructions.asin, ["r0", 1])).resolves.toBe(Math.PI / 2)
		expect(runFunc(instructions.asin, ["r0", -1])).resolves.toBe(-Math.PI / 2)
	})
	test("acos", () => {
		expect(runFunc(instructions.acos, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.acos, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.acos, ["r0", 0])).resolves.toBe(Math.PI / 2)
		expect(runFunc(instructions.acos, ["r0", 1])).resolves.toBe(0)
		expect(runFunc(instructions.acos, ["r0", -1])).resolves.toBe(Math.PI)
	})
	test("atan", () => {
		expect(runFunc(instructions.atan, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.atan, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(instructions.atan, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(instructions.atan, ["r0", 1])).resolves.toBe(Math.PI / 4)
		expect(runFunc(instructions.atan, ["r0", -1])).resolves.toBe(-Math.PI / 4)
	})
	test("atan2", () => {
		expect(runFunc(instructions.atan2, ["r0", "r1", 1], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(instructions.atan2, ["r0", NaN, NaN])).rejects.toThrow()
		expect(runFunc(instructions.atan2, ["r0", 1, 1])).resolves.toBe(Math.PI / 4)
		expect(runFunc(instructions.atan2, ["r0", 1, -1])).resolves.toBe((3 * Math.PI) / 4)
		expect(runFunc(instructions.atan2, ["r0", -1, 1])).resolves.toBe(-Math.PI / 4)
		expect(runFunc(instructions.atan2, ["r0", -1, -1])).resolves.toBe((-3 * Math.PI) / 4)
	})
	test("and", () => {
		expect(runFunc(instructions.and, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.and, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.and, ["r0", 2, 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.and, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.and, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.and, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.and, ["r0", 2, -2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.and, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(-2)
		expect(runFunc(instructions.and, ["r0", -2, "r0"])).resolves.toBe(0)
	})
	test("or", () => {
		expect(runFunc(instructions.or, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.or, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.or, ["r0", 2, 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.or, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.or, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(instructions.or, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(-2)
		expect(runFunc(instructions.or, ["r0", 2, -2], { r0: 2 })).resolves.toBe(-2)
		expect(runFunc(instructions.or, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(-2)
		expect(runFunc(instructions.or, ["r0", -2, "r0"])).resolves.toBe(-2)
	})
	test("xor", () => {
		expect(runFunc(instructions.xor, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.xor, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(0)
		expect(runFunc(instructions.xor, ["r0", 2, 2], { r0: 2 })).resolves.toBe(0)
		expect(runFunc(instructions.xor, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(0)
		expect(runFunc(instructions.xor, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(0)
		expect(runFunc(instructions.xor, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(-4)
		expect(runFunc(instructions.xor, ["r0", 2, -2], { r0: 2 })).resolves.toBe(-4)
		expect(runFunc(instructions.xor, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(0)
		expect(runFunc(instructions.xor, ["r0", -2, "r0"])).resolves.toBe(-2)
	})
	test("nor", () => {
		expect(runFunc(instructions.nor, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(instructions.nor, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(-3)
		expect(runFunc(instructions.nor, ["r0", 2, 2], { r0: 2 })).resolves.toBe(-3)
		expect(runFunc(instructions.nor, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(-3)
		expect(runFunc(instructions.nor, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(-3)
		expect(runFunc(instructions.nor, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(1)
		expect(runFunc(instructions.nor, ["r0", 2, -2], { r0: 2 })).resolves.toBe(1)
		expect(runFunc(instructions.nor, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(1)
		expect(runFunc(instructions.nor, ["r0", -2, "r0"])).resolves.toBe(1)
	})
})
