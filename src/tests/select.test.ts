import { describe, expect, test } from "bun:test"
import { runFunc } from "./testUtils"
import { functions } from "../functions"

describe("select", () => {
	test("seq", () => {
		expect(runFunc(functions.seq, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.seq, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.seq, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.seq, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.seq, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(1)
		expect(runFunc(functions.seq, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(0)
	})
	test("seqz", () => {
		expect(runFunc(functions.seqz, ["r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.seqz, ["r0", "r0"], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.seqz, ["r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sge", () => {
		expect(runFunc(functions.sge, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.sge, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.sge, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.sge, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.sge, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(1)
		expect(runFunc(functions.sge, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(0)
	})
	test("sgez", () => {
		expect(runFunc(functions.sgez, ["r0", "r0"], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.sgez, ["r0", "r0"], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.sgez, ["r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sgt", () => {
		expect(runFunc(functions.sgt, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sgt, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.sgt, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.sgt, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.sgt, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(functions.sgt, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(0)
	})
	test("sgtz", () => {
		expect(runFunc(functions.sgtz, ["r0", "r0"], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.sgtz, ["r0", "r0"], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.sgtz, ["r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sle", () => {
		expect(runFunc(functions.sle, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.sle, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sle, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.sle, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.sle, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(1)
		expect(runFunc(functions.sle, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(1)
	})
	test("slez", () => {
		expect(runFunc(functions.slez, ["r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.slez, ["r0", "r0"], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.slez, ["r0", "r0"], { r0: -1 })).resolves.toBe(1)
	})
	test("slt", () => {
		expect(runFunc(functions.slt, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.slt, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.slt, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.slt, ["r0", "r0", -1], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.slt, ["r0", "r0", -1], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(functions.slt, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(1)
	})
	test("sltz", () => {
		expect(runFunc(functions.sltz, ["r0", "r0"], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sltz, ["r0", "r0"], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.sltz, ["r0", "r0"], { r0: -1 })).resolves.toBe(1)
	})
	test("sne", () => {
		expect(runFunc(functions.sne, ["r0", "r0", 1], { r0: 1 })).resolves.toBe(0)
		expect(runFunc(functions.sne, ["r0", "r0", 0], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.sne, ["r0", "r0", 1], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.sne, ["r0", -1, "r0"], { r0: 0 })).resolves.toBe(1)
		expect(runFunc(functions.sne, ["r0", -1, "r0"], { r0: -1 })).resolves.toBe(0)
		expect(runFunc(functions.sne, ["r0", "r0", 0], { r0: -1 })).resolves.toBe(1)
	})
	test("snez", () => {
		expect(runFunc(functions.snez, ["r0", 1])).resolves.toBe(1)
		expect(runFunc(functions.snez, ["r0", 0])).resolves.toBe(0)
		expect(runFunc(functions.snez, ["r0", "r0"], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.snez, ["r0", "r0"], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.snez, ["r0", "r0"], { r0: -1 })).resolves.toBe(1)
	})
	test("sap", () => {
		expect(runFunc(functions.sap, ["r0", 100, NaN, 0.01])).rejects.toThrow()
		expect(runFunc(functions.sap, ["r0", 100, "r0", 0.01], { r0: NaN })).resolves.toBe(0) // TODO: verify
		expect(runFunc(functions.sap, ["r0", 100, 101, "r0"], { r0: NaN })).resolves.toBe(0) // TODO: if not correct edit in other parts
		expect(runFunc(functions.sap, ["r0", 100, 101, 0.01])).resolves.toBe(1)
		expect(runFunc(functions.sap, ["r0", 100, 98, 0.01])).resolves.toBe(0)
		expect(runFunc(functions.sap, ["r0", 10, 11, 0.1])).resolves.toBe(1)
		expect(runFunc(functions.sap, ["r0", 10, 12, 0.1])).resolves.toBe(0)
	})
	test.todo("sapz", () => {
		expect(runFunc(functions.sapz, ["r0", "r0", "r0"], { r0: 1 })).resolves.toBe(1)
		expect(runFunc(functions.sapz, ["r0", "r0", "r0"], { r0: 0 })).resolves.toBe(0)
		expect(runFunc(functions.sapz, ["r0", "r0", "r0"], { r0: -1 })).resolves.toBe(0)
	})
	test("sna", () => {
		expect(runFunc(functions.sna, ["r0", 100, NaN, 0.01])).rejects.toThrow()
		expect(runFunc(functions.sna, ["r0", 100, "r0", 0.01], { r0: NaN })).resolves.toBe(0)
		expect(runFunc(functions.sna, ["r0", 100, 101, "r0"], { r0: NaN })).resolves.toBe(0)
		expect(runFunc(functions.sna, ["r0", 100, 101, 0.01])).resolves.toBe(0)
		expect(runFunc(functions.sna, ["r0", 100, 98, 0.01])).resolves.toBe(1)
		expect(runFunc(functions.sna, ["r0", 10, 11, 0.1])).resolves.toBe(0)
		expect(runFunc(functions.sna, ["r0", 10, 12, 0.1])).resolves.toBe(1)
	})
	test.todo("snaz", () => {
		expect(runFunc(functions.sna, ["r0", NaN, 0.01])).rejects.toThrow()
		expect(runFunc(functions.sna, ["r0", "r0", 0.01], { r0: NaN })).resolves.toBe(0)
		expect(runFunc(functions.sna, ["r0", 100, "r0"], { r0: NaN })).resolves.toBe(0)
		expect(runFunc(functions.sna, ["r0", 100, 0.01])).resolves.toBe(0)
		expect(runFunc(functions.sna, ["r0", 100, 0.01])).resolves.toBe(1)
		expect(runFunc(functions.sna, ["r0", 10, 0.1])).resolves.toBe(0)
		expect(runFunc(functions.sna, ["r0", 10, 0.1])).resolves.toBe(1)
	})

	test("sdse", () => {
		expect(runFunc(functions.sdse, ["r0", "d0"], { "d0.on": 1 })).resolves.toBe(1)
		expect(runFunc(functions.sdse, ["r0", "d0"], { "d0.on": 0 })).resolves.toBe(1)
		expect(runFunc(functions.sdse, ["r0", "d0"])).resolves.toBe(0)
	})

	test("sdns", () => {
		expect(runFunc(functions.sdns, ["r0", "d0"], { "d0.on": 1 })).resolves.toBe(0)
		expect(runFunc(functions.sdns, ["r0", "d0"], { "d0.on": 0 })).resolves.toBe(0)
		expect(runFunc(functions.sdns, ["r0", "d0"])).resolves.toBe(1)
	})

	test("snan", () => {
		expect(runFunc(functions.snan, ["r0", "r1"], { r1: NaN })).resolves.toBe(1)
		expect(runFunc(functions.snan, ["r0", "r1"], { r1: 1 })).resolves.toBe(0)
	})
})
