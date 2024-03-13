import { describe, expect, test } from "bun:test"
import { runFunc, runFuncWithMem } from "./testUtils"
import { instructions } from "../instructions"
import DevEnv from "../core/DevEnv"

describe("select", () => {
	test("seq", () => {
		expect(runFunc(instructions.seq, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.seq, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.seq, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.seq, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.seq, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(1)
		expect(runFunc(instructions.seq, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(0)
	})
	test("seqz", () => {
		expect(runFunc(instructions.seqz, ["r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.seqz, ["r0", "r0"], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.seqz, ["r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sge", () => {
		expect(runFunc(instructions.sge, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.sge, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.sge, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.sge, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.sge, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(1)
		expect(runFunc(instructions.sge, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(0)
	})
	test("sgez", () => {
		expect(runFunc(instructions.sgez, ["r0", "r0"], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.sgez, ["r0", "r0"], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.sgez, ["r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sgt", () => {
		expect(runFunc(instructions.sgt, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sgt, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.sgt, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.sgt, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.sgt, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(instructions.sgt, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(0)
	})
	test("sgtz", () => {
		expect(runFunc(instructions.sgtz, ["r0", "r0"], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.sgtz, ["r0", "r0"], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.sgtz, ["r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sle", () => {
		expect(runFunc(instructions.sle, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.sle, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sle, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.sle, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.sle, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(1)
		expect(runFunc(instructions.sle, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(1)
	})
	test("slez", () => {
		expect(runFunc(instructions.slez, ["r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.slez, ["r0", "r0"], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.slez, ["r0", "r0"], { r0: -1 })).resolves.toBe(1)
	})
	test("slt", () => {
		expect(runFunc(instructions.slt, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.slt, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.slt, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.slt, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.slt, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(instructions.slt, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(1)
	})
	test("sltz", () => {
		expect(runFunc(instructions.sltz, ["r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sltz, ["r0", "r0"], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.sltz, ["r0", "r0"], { r0: -1 })).resolves.toBe(1)
	})
	test("sne", () => {
		expect(runFunc(instructions.sne, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(instructions.sne, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.sne, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.sne, ["r0", -1, "r0"], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(instructions.sne, ["r0", -1, "r0"], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(instructions.sne, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(1)
	})
	test("snez", () => {
		expect(runFunc(instructions.snez, ["r0", 1])).resolves.toBe(1)
		expect(runFunc(instructions.snez, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(instructions.snez, ["r0", "r0"], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.snez, ["r0", "r0"], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.snez, ["r0", "r0"], { r0: -1 })).resolves.toBe(1)
	})
	test("sap", () => {
		expect(runFunc(instructions.sap, ["r0", 100, NaN, 0.01])).rejects.toThrow()
		expect(runFunc(instructions.sap, ["r0", 100, "r0", 0.01], { r0: NaN })).resolves.toBe(0) // TODO: verify
		expect(runFunc(instructions.sap, ["r0", 100, 101, "r0"], { r0: NaN })).resolves.toBe(0) // TODO: if not correct edit in other parts
		expect(runFunc(instructions.sap, ["r0", 100, 101, 0.01])).resolves.toBe(1)
		expect(runFunc(instructions.sap, ["r0", 100, 98, 0.01])).resolves.toBe(0)
		expect(runFunc(instructions.sap, ["r0", 10, 11, 0.1])).resolves.toBe(1)
		expect(runFunc(instructions.sap, ["r0", 10, 12, 0.1])).resolves.toBe(0)
	})
	// FIXME
	test.todo("sapz", () => {
		expect(runFunc(instructions.sapz, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(instructions.sapz, ["r0", "r0", "r0"], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(instructions.sapz, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sna", () => {
		expect(runFunc(instructions.sna, ["r0", 100, NaN, 0.01])).rejects.toThrow()
		expect(runFunc(instructions.sna, ["r0", 100, "r0", 0.01], { r0: NaN })).resolves.toBe(0)
		expect(runFunc(instructions.sna, ["r0", 100, 101, "r0"], { r0: NaN })).resolves.toBe(0)
		expect(runFunc(instructions.sna, ["r0", 100, 101, 0.01])).resolves.toBe(0)
		expect(runFunc(instructions.sna, ["r0", 100, 98, 0.01])).resolves.toBe(1)
		expect(runFunc(instructions.sna, ["r0", 10, 11, 0.1])).resolves.toBe(0)
		expect(runFunc(instructions.sna, ["r0", 10, 12, 0.1])).resolves.toBe(1)
	})
	// FIXME
	test.todo("snaz", () => {
		expect(runFunc(instructions.sna, ["r0", NaN, 0.01])).rejects.toThrow()
		expect(runFunc(instructions.sna, ["r0", "r0", 0.01], { r0: NaN })).resolves.toBe(0)
		expect(runFunc(instructions.sna, ["r0", 100, "r0"], { r0: NaN })).resolves.toBe(0)
		expect(runFunc(instructions.sna, ["r0", 100, 0.01])).resolves.toBe(0)
		expect(runFunc(instructions.sna, ["r0", 100, 0.01])).resolves.toBe(1)
		expect(runFunc(instructions.sna, ["r0", 10, 0.1])).resolves.toBe(0)
		expect(runFunc(instructions.sna, ["r0", 10, 0.1])).resolves.toBe(1)
	})
	test("snan", () => {
		expect(runFunc(instructions.snan, ["r0", "r1"], { r1: NaN })).resolves.toBe(1)
		expect(runFunc(instructions.snan, ["r0", "r1"], { r1: 1 })).resolves.toBe(0)
	})
})
