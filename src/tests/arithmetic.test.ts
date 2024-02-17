import { describe, expect, test } from "bun:test"
import { runFunc } from "./testUtils"
import { functions } from "../functions"

describe("arithmetic", () => {
	test("add", () => {
		expect(runFunc(functions.add, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.add, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.add, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.add, ["r0", 1, 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.add, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.add, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.add, ["r0", "r0", -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.add, ["r0", 1, -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.add, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(-2)
		expect(runFunc(functions.add, ["r0", -1, "r0"])).resolves.toBe(-1)
	})
	test("sub", () => {
		expect(runFunc(functions.sub, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.sub, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.sub, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sub, ["r0", 1, 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sub, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sub, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sub, ["r0", "r0", -1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sub, ["r0", 1, -1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sub, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(functions.sub, ["r0", -1, "r0"])).resolves.toBe(-1)
	})
	test("mul", () => {
		expect(runFunc(functions.mul, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.mul, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.mul, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(4)
		expect(runFunc(functions.mul, ["r0", 2, 2], { r0: 2 })).resolves.toBe(4)
		expect(runFunc(functions.mul, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(4)
		expect(runFunc(functions.mul, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(4)
		expect(runFunc(functions.mul, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(-4)
		expect(runFunc(functions.mul, ["r0", 2, -2], { r0: 2 })).resolves.toBe(-4)
		expect(runFunc(functions.mul, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(4)
		expect(runFunc(functions.mul, ["r0", -2, "r0"])).resolves.toBe(0)
	})
	test("div", () => {
		expect(runFunc(functions.div, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.div, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.div, ["r0", "r0", 2], { r0: 4 })).resolves.toBe(2)
		expect(runFunc(functions.div, ["r0", 4, 2], { r0: 4 })).resolves.toBe(2)
		expect(runFunc(functions.div, ["r0", "r0", "r0"], { r0: 4 })).resolves.toBe(1)
		expect(runFunc(functions.div, ["r0", 4, "r0"], { r0: 4 })).resolves.toBe(1)
		expect(runFunc(functions.div, ["r0", "r0", -2], { r0: 4 })).resolves.toBe(-2)
		expect(runFunc(functions.div, ["r0", 4, -2], { r0: 4 })).resolves.toBe(-2)
		expect(runFunc(functions.div, ["r0", "r0", "r0"], { r0: -4 })).resolves.toBe(1)
		expect(runFunc(functions.div, ["r0", -4, "r0"])).resolves.toBe(Infinity)
		expect(runFunc(functions.div, ["r0", -4, -0])).resolves.toBe(Infinity)
	})
	test("mod", () => {
		expect(runFunc(functions.mod, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.mod, ["r0", "r0", 1], { r0: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.mod, ["r0", "r0", 2], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(functions.mod, ["r0", 4, 2], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(functions.mod, ["r0", "r0", "r0"], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(functions.mod, ["r0", 4, "r0"], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(functions.mod, ["r0", "r0", -2], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(functions.mod, ["r0", 4, -2], { r0: 4 })).resolves.toBe(0)
		expect(runFunc(functions.mod, ["r0", "r0", "r0"], { r0: -4 })).resolves.toBe(0)
		expect(runFunc(functions.mod, ["r0", -4, 0])).resolves.toBeNaN()
		expect(runFunc(functions.mod, ["r0", -4, -0])).resolves.toBeNaN()
	})
	test("sqrt", () => {
		expect(runFunc(functions.sqrt, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.sqrt, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.sqrt, ["r0", 4])).resolves.toBe(2)
		expect(runFunc(functions.sqrt, ["r0", "r0"], { r0: 4 })).resolves.toBe(2)
		expect(runFunc(functions.sqrt, ["r0", -4])).resolves.toBeNaN()
		expect(runFunc(functions.sqrt, ["r0", 2])).resolves.toBe(Math.sqrt(2))
		expect(runFunc(functions.sqrt, ["r0", 8.8])).resolves.toBe(Math.sqrt(8.8))
	})
	test("round", () => {
		expect(runFunc(functions.round, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.round, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.round, ["r0", 1.2])).resolves.toBe(1)
		expect(runFunc(functions.round, ["r0", 1.5])).resolves.toBe(2)
		expect(runFunc(functions.round, ["r0", 1.8])).resolves.toBe(2)
		expect(runFunc(functions.round, ["r0", -1.2])).resolves.toBe(-1)
		expect(runFunc(functions.round, ["r0", -1.5])).resolves.toBe(-1)
		expect(runFunc(functions.round, ["r0", -1.8])).resolves.toBe(-2)
	})
	test("trunc", () => {
		expect(runFunc(functions.trunc, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.trunc, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.trunc, ["r0", 1.2])).resolves.toBe(1)
		expect(runFunc(functions.trunc, ["r0", 1.5])).resolves.toBe(1)
		expect(runFunc(functions.trunc, ["r0", 1.8])).resolves.toBe(1)
		expect(runFunc(functions.trunc, ["r0", -1.2])).resolves.toBe(-1)
		expect(runFunc(functions.trunc, ["r0", -1.5])).resolves.toBe(-1)
		expect(runFunc(functions.trunc, ["r0", -1.8])).resolves.toBe(-1)
	})
	test("ceil", () => {
		expect(runFunc(functions.ceil, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.ceil, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.ceil, ["r0", 1.2])).resolves.toBe(2)
		expect(runFunc(functions.ceil, ["r0", 1.5])).resolves.toBe(2)
		expect(runFunc(functions.ceil, ["r0", 1.8])).resolves.toBe(2)
		expect(runFunc(functions.ceil, ["r0", -1.2])).resolves.toBe(-1)
		expect(runFunc(functions.ceil, ["r0", -1.5])).resolves.toBe(-1)
		expect(runFunc(functions.ceil, ["r0", -1.8])).resolves.toBe(-1)
	})
	test("floor", () => {
		expect(runFunc(functions.floor, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.floor, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.floor, ["r0", 1.2])).resolves.toBe(1)
		expect(runFunc(functions.floor, ["r0", 1.5])).resolves.toBe(1)
		expect(runFunc(functions.floor, ["r0", 1.8])).resolves.toBe(1)
		expect(runFunc(functions.floor, ["r0", -1.2])).resolves.toBe(-2)
		expect(runFunc(functions.floor, ["r0", -1.5])).resolves.toBe(-2)
		expect(runFunc(functions.floor, ["r0", -1.8])).resolves.toBe(-2)
	})
	test("max", () => {
		expect(runFunc(functions.max, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.max, ["r0", "r1", 0], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.max, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.max, ["r0", 2, 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.max, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.max, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.max, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.max, ["r0", 2, -2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.max, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(-2)
		expect(runFunc(functions.max, ["r0", -2, "r0"])).resolves.toBe(0)
	})
	test("min", () => {
		expect(runFunc(functions.min, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.min, ["r0", "r1", 0], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.min, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.min, ["r0", 2, 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.min, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.min, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.min, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(-2)
		expect(runFunc(functions.min, ["r0", 2, -2], { r0: 2 })).resolves.toBe(-2)
		expect(runFunc(functions.min, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(-2)
		expect(runFunc(functions.min, ["r0", -2, "r0"])).resolves.toBe(-2)
	})
	test("abs", () => {
		expect(runFunc(functions.abs, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.abs, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.abs, ["r0", 1])).resolves.toBe(1)
		expect(runFunc(functions.abs, ["r0", -1])).resolves.toBe(1)
		expect(runFunc(functions.abs, ["r0", 0])).resolves.toBe(0)
	})
	test("log", () => {
		expect(runFunc(functions.log, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.log, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.log, ["r0", 1])).resolves.toBe(0)
		expect(runFunc(functions.log, ["r0", Math.E])).resolves.toBe(1)
		expect(runFunc(functions.log, ["r0", 10])).resolves.toBe(Math.log(10))
	})
	test("exp", () => {
		expect(runFunc(functions.exp, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.exp, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.exp, ["r0", 0])).resolves.toBe(1)
		expect(runFunc(functions.exp, ["r0", 1])).resolves.toBe(Math.E)
		expect(runFunc(functions.exp, ["r0", Math.log(10)])).resolves.toBe(Math.exp(Math.log(10)))
	})
	test("rand", () => {
		expect(runFunc(functions.rand, ["r0"])).resolves.toBeGreaterThanOrEqual(0)
		expect(runFunc(functions.rand, ["r0"])).resolves.toBeLessThanOrEqual(1)
	})
	test("sll", () => {
		expect(runFunc(functions.sll, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.sll, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sll, ["r0", 1, 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sll, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sll, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sll, ["r0", "r0", -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sll, ["r0", 1, -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sll, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(functions.sll, ["r0", -1, "r0"])).resolves.toBe(-1)
	})
	test("srl", () => {
		expect(runFunc(functions.srl, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.srl, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.srl, ["r0", 1, 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.srl, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.srl, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.srl, ["r0", "r0", -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.srl, ["r0", 1, -1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.srl, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sla", () => {
		expect(runFunc(functions.sla, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.sla, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sla, ["r0", 1, 1], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sla, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(2)
		expect(runFunc(functions.sla, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(2)
	})
	test("sra", () => {
		expect(runFunc(functions.sra, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.sra, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sra, ["r0", 1, 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sra, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sra, ["r0", 1, "r0"], { r0: 1 })).resolves.toBe(0)
	})
	test("sin", () => {
		expect(runFunc(functions.sin, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.sin, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.sin, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(functions.sin, ["r0", Math.PI / 2])).resolves.toBe(1)
		expect(runFunc(functions.sin, ["r0", Math.PI])).resolves.toBeCloseTo(0, 8)
		expect(runFunc(functions.sin, ["r0", (3 * Math.PI) / 2])).resolves.toBe(-1)
	})
	test("cos", () => {
		expect(runFunc(functions.cos, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.cos, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.cos, ["r0", 0])).resolves.toBe(1)
		expect(runFunc(functions.cos, ["r0", Math.PI / 2])).resolves.toBeCloseTo(0, 8)
		expect(runFunc(functions.cos, ["r0", Math.PI])).resolves.toBe(-1)
		expect(runFunc(functions.cos, ["r0", (3 * Math.PI) / 2])).resolves.toBeCloseTo(0, 8)
	})
	test("tan", () => {
		expect(runFunc(functions.tan, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.tan, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.tan, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(functions.tan, ["r0", Math.PI / 4])).resolves.toBeCloseTo(1, 8)
		expect(runFunc(functions.tan, ["r0", (Math.PI / 4) * 3])).resolves.toBeCloseTo(-1, 8)
		expect(runFunc(functions.tan, ["r0", Math.PI])).resolves.toBeCloseTo(0, 8)
	})
	test("asin", () => {
		expect(runFunc(functions.asin, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.asin, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.asin, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(functions.asin, ["r0", 1])).resolves.toBe(Math.PI / 2)
		expect(runFunc(functions.asin, ["r0", -1])).resolves.toBe(-Math.PI / 2)
	})
	test("acos", () => {
		expect(runFunc(functions.acos, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.acos, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.acos, ["r0", 0])).resolves.toBe(Math.PI / 2)
		expect(runFunc(functions.acos, ["r0", 1])).resolves.toBe(0)
		expect(runFunc(functions.acos, ["r0", -1])).resolves.toBe(Math.PI)
	})
	test("atan", () => {
		expect(runFunc(functions.atan, ["r0", "r1"], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.atan, ["r0", NaN])).rejects.toThrow()
		expect(runFunc(functions.atan, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(functions.atan, ["r0", 1])).resolves.toBe(Math.PI / 4)
		expect(runFunc(functions.atan, ["r0", -1])).resolves.toBe(-Math.PI / 4)
	})
	test("atan2", () => {
		expect(runFunc(functions.atan2, ["r0", "r1", 1], { r1: NaN })).resolves.toBeNaN()
		expect(runFunc(functions.atan2, ["r0", NaN, NaN])).rejects.toThrow()
		expect(runFunc(functions.atan2, ["r0", 1, 1])).resolves.toBe(Math.PI / 4)
		expect(runFunc(functions.atan2, ["r0", 1, -1])).resolves.toBe((3 * Math.PI) / 4)
		expect(runFunc(functions.atan2, ["r0", -1, 1])).resolves.toBe(-Math.PI / 4)
		expect(runFunc(functions.atan2, ["r0", -1, -1])).resolves.toBe((-3 * Math.PI) / 4)
	})
	test("and", () => {
		expect(runFunc(functions.and, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.and, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.and, ["r0", 2, 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.and, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.and, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.and, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.and, ["r0", 2, -2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.and, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(-2)
		expect(runFunc(functions.and, ["r0", -2, "r0"])).resolves.toBe(0)
	})
	test("or", () => {
		expect(runFunc(functions.or, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.or, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.or, ["r0", 2, 2], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.or, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.or, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(2)
		expect(runFunc(functions.or, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(-2)
		expect(runFunc(functions.or, ["r0", 2, -2], { r0: 2 })).resolves.toBe(-2)
		expect(runFunc(functions.or, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(-2)
		expect(runFunc(functions.or, ["r0", -2, "r0"])).resolves.toBe(-2)
	})
	test("xor", () => {
		expect(runFunc(functions.xor, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.xor, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(0)
		expect(runFunc(functions.xor, ["r0", 2, 2], { r0: 2 })).resolves.toBe(0)
		expect(runFunc(functions.xor, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(0)
		expect(runFunc(functions.xor, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(0)
		expect(runFunc(functions.xor, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(-4)
		expect(runFunc(functions.xor, ["r0", 2, -2], { r0: 2 })).resolves.toBe(-4)
		expect(runFunc(functions.xor, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(0)
		expect(runFunc(functions.xor, ["r0", -2, "r0"])).resolves.toBe(-2)
	})
	test("nor", () => {
		expect(runFunc(functions.nor, ["r0", "r0", NaN], { r0: 1 })).rejects.toThrow()
		expect(runFunc(functions.nor, ["r0", "r0", 2], { r0: 2 })).resolves.toBe(-3)
		expect(runFunc(functions.nor, ["r0", 2, 2], { r0: 2 })).resolves.toBe(-3)
		expect(runFunc(functions.nor, ["r0", "r0", "r0"], { r0: 2 })).resolves.toBe(-3)
		expect(runFunc(functions.nor, ["r0", 2, "r0"], { r0: 2 })).resolves.toBe(-3)
		expect(runFunc(functions.nor, ["r0", "r0", -2], { r0: 2 })).resolves.toBe(1)
		expect(runFunc(functions.nor, ["r0", 2, -2], { r0: 2 })).resolves.toBe(1)
		expect(runFunc(functions.nor, ["r0", "r0", "r0"], { r0: -2 })).resolves.toBe(1)
		expect(runFunc(functions.nor, ["r0", -2, "r0"])).resolves.toBe(1)
	})
})
