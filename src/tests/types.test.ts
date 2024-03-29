import { describe, expect, test } from "bun:test"
import * as types from "../ZodTypes"

describe("types", () => {
	test("Register", () => {
		;[
			{ a: "r-1", expected: false },
			{ a: "r0", expected: true },
			{ a: "d0", expected: false },
			{ a: "r1", expected: true },
			{ a: "d1", expected: false },
			{ a: "r2", expected: true },
			{ a: "r3", expected: true },
			{ a: "r4", expected: true },
			{ a: "r5", expected: true },
			{ a: "r6", expected: true },
			{ a: "r7", expected: true },
			{ a: "r8", expected: true },
			{ a: "r9", expected: true },
			{ a: "r10", expected: true },
			{ a: "r11", expected: true },
			{ a: "r12", expected: true },
			{ a: "r13", expected: true },
			{ a: "r14", expected: true },
			{ a: "r15", expected: true },
			{ a: "r16", expected: true },
			{ a: "r17", expected: true },
			{ a: "r18", expected: false },
			{ a: "r55", expected: false },
			{ a: "sp", expected: true },
			{ a: "bp", expected: false },
			{ a: "sr17", expected: false },
			{ a: "r17s", expected: false },
			{ a: "sr1", expected: false },
			{ a: "r1s", expected: false },
			{ a: "sr1s", expected: false },
			{ a: "ssp", expected: false },
			{ a: "rr2", expected: true },
			{ a: "rrrrrrr16", expected: true },
			{ a: "rrrrrrrrrrrrr17", expected: true },
		].forEach(({ a, expected }) => {
			try {
				expect(types.Register.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`${a} is ${!expected} expected ${expected}`)
			}
		})
	})
	test("Device", () => {
		;[
			{ a: "d-1", expected: false },
			{ a: "d0", expected: true },
			{ a: "r0", expected: false },
			{ a: "d1", expected: true },
			{ a: "r1", expected: false },
			{ a: "d2", expected: true },
			{ a: "d3", expected: true },
			{ a: "d4", expected: true },
			{ a: "d5", expected: true },
			{ a: "d0:0", expected: true },
			{ a: "d0:7", expected: true },
			{ a: "d0:8", expected: false },
			{ a: "d6", expected: false },
			{ a: "d7", expected: false },
			{ a: "d18", expected: false },
			{ a: "d55", expected: false },
			{ a: "db", expected: true },
			{ a: "bp", expected: false },
			{ a: "sd17", expected: false },
			{ a: "d17s", expected: false },
			{ a: "sd1", expected: false },
			{ a: "d1s", expected: false },
			{ a: "sd1s", expected: false },
			{ a: "dd1", expected: false },
			{ a: "drr2", expected: true },
			{ a: "drr2:1", expected: true },
			{ a: "drr2:8", expected: false },
			{ a: "drrrrrrr16", expected: true },
			{ a: "drrrrrrrrrrrrr17", expected: true },
		].forEach(({ a, expected }) => {
			try {
				expect(types.Device.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`${a} is ${!expected} expected ${expected}`)
			}
		})
	})
	test("RegisterOrDevice", () => {
		;[
			{ a: "r-1", expected: false },
			{ a: "d-1", expected: false },
			{ a: "d0", expected: true },
			{ a: "r0", expected: true },
			{ a: "d1", expected: true },
			{ a: "r1", expected: true },
			{ a: "d5", expected: true },
			{ a: "d6", expected: false },
			{ a: "r17", expected: true },
			{ a: "r18", expected: false },
			{ a: "dd1", expected: false },
			{ a: "drr2", expected: true },
			{ a: "r1s", expected: false },
			{ a: "d0:7", expected: true },
			{ a: "d0:8", expected: false },
		].forEach(({ a, expected }) => {
			try {
				expect(types.RegisterOrDevice.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`${a} is ${!expected} expected ${expected}`)
			}
		})
	})
	test("Value", () => {
		;[
			{ a: "1", expected: true },
			{ a: "2", expected: true },
			{ a: "22", expected: true },
			{ a: "02", expected: true },
			{ a: "a02", expected: false },
			// TODO 02a is false
			{ a: "02a", expected: true },
			// TODO same
			{ a: "11a", expected: true },
			{ a: "123_234", expected: true },
			{ a: "1_2_3___2_3_4", expected: true },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (!isNaN(parseFloat(a))) x = parseFloat(a)
				expect(types.Value.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`${a} is ${!expected} expected ${expected}`)
			}
		})
	})
})
