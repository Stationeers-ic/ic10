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
			{ a: "", expected: false },
		].forEach(({ a, expected }) => {
			try {
				expect(types.Register.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
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
			{ a: "", expected: false },
		].forEach(({ a, expected }) => {
			try {
				expect(types.Device.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
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
			{ a: "", expected: false },
		].forEach(({ a, expected }) => {
			try {
				expect(types.RegisterOrDevice.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("Value and CoerceValue", () => {
		;[
			{ a: "1", expected: true },
			{ a: "-1", expected: true },
			{ a: "2", expected: true },
			{ a: "22", expected: true },
			{ a: "02", expected: true },
			{ a: "a02", expected: false },
			{ a: "02a", expected: false },
			{ a: "11a", expected: false },
			{ a: "123_234", expected: false },
			{ a: "1_2_3___2_3_4", expected: false },
			{ a: "", expected: false },
			{ a: ".1", expected: true },
			{ a: "-.1", expected: true },
			{ a: ".111", expected: true },
			{ a: "1.", expected: true },
			{ a: "1.1", expected: true },
			{ a: "111.111", expected: true },
			{ a: "-111.111", expected: true },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (a !== "" && !isNaN(Number(a))) x = Number(a)
				expect(types.Value.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`Value: "${a}" is ${!expected} expected ${expected}`)
			}
			try {
				expect(types.CoerceValue.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`CoerceValue: "${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("Alias", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "a_aa_", expected: true },
			{ a: "_a_aa_", expected: true },
			{ a: "1a_aa_a", expected: false },
			{ a: "r0", expected: false },
			{ a: "rrrr0", expected: false },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: " a_aa_a", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: false },
			{ a: "111aa", expected: false },
			{ a: "-111.111", expected: false },
			{ a: "", expected: false },
		].forEach(({ a, expected }) => {
			try {
				expect(types.Alias.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("Ralias", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: true },
			{ a: "rrr0", expected: true },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: false },
			{ a: "111aa", expected: false },
			{ a: "-111.111", expected: false },
			{ a: "", expected: false },
		].forEach(({ a, expected }) => {
			try {
				expect(types.Ralias.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("DeviceOrAlias", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: false },
			{ a: "rrr0", expected: false },
			{ a: "d0", expected: true },
			{ a: "dr0", expected: true },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: false },
			{ a: "111aa", expected: false },
			{ a: "-111.111", expected: false },
			{ a: "", expected: false },
		].forEach(({ a, expected }) => {
			try {
				expect(types.DeviceOrAlias.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("AliasOrValue", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: false },
			{ a: "rrr0", expected: false },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: true },
			{ a: "111aa", expected: false },
			{ a: "", expected: false },
			{ a: ".1", expected: true },
			{ a: ".111", expected: true },
			{ a: "1.", expected: true },
			{ a: "1.1", expected: true },
			{ a: "-111.111", expected: true },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (a !== "" && !isNaN(Number(a))) x = Number(a)
				expect(types.AliasOrValue.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("RaliasOrValue", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: true },
			{ a: "rrr0", expected: true },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: true },
			{ a: "111aa", expected: false },
			{ a: "", expected: false },
			{ a: ".1", expected: true },
			{ a: ".111", expected: true },
			{ a: "1.", expected: true },
			{ a: "1.1", expected: true },
			{ a: "-111.111", expected: true },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (a !== "" && !isNaN(Number(a))) x = Number(a)
				expect(types.RaliasOrValue.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("RaliasOrValuePositive", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: true },
			{ a: "rrr0", expected: true },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: true },
			{ a: "111aa", expected: false },
			{ a: "", expected: false },
			{ a: "-1", expected: false },
			{ a: ".1", expected: true },
			{ a: ".111", expected: true },
			{ a: "1.", expected: true },
			{ a: "1.1", expected: true },
			{ a: "-111.111", expected: false },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (a !== "" && !isNaN(Number(a))) x = Number(a)
				expect(types.RaliasOrValuePositive.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("SlotIndex and LineIndex", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: true },
			{ a: "rrr0", expected: true },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: true },
			{ a: "111aa", expected: false },
			{ a: "", expected: false },
			{ a: "-1", expected: false },
			{ a: ".1", expected: false },
			{ a: ".111", expected: false },
			{ a: "1.", expected: true },
			{ a: "1.1", expected: false },
			{ a: "-111.111", expected: false },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (a !== "" && !isNaN(Number(a))) x = Number(a)
				expect(types.SlotIndex.safeParse(x).success).toBe(expected)
				expect(types.LineIndex.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("RelativeSlotIndex and RelativeLineIndex and Hash", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: true },
			{ a: "rrr0", expected: true },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: true },
			{ a: "111aa", expected: false },
			{ a: "", expected: false },
			{ a: "-1", expected: true },
			{ a: ".1", expected: false },
			{ a: ".111", expected: false },
			{ a: "1.", expected: true },
			{ a: "1.1", expected: false },
			{ a: "-111.111", expected: false },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (a !== "" && !isNaN(Number(a))) x = Number(a)
				expect(types.RelativeSlotIndex.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("AliasOrValueOrNaN", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: false },
			{ a: "rrr0", expected: false },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: true },
			{ a: "111aa", expected: false },
			{ a: "", expected: false },
			{ a: "-1", expected: true },
			{ a: ".1", expected: true },
			{ a: ".111", expected: true },
			{ a: "1.", expected: true },
			{ a: "1.1", expected: true },
			{ a: "-111.111", expected: true },
			{ a: NaN, expected: true },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (a !== "" && !isNaN(Number(a))) x = Number(a)
				expect(types.AliasOrValueOrNaN.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("RaliasOrValueOrNaN", () => {
		;[
			{ a: "hello", expected: true },
			{ a: "aaaaa", expected: true },
			{ a: "a123", expected: true },
			{ a: "r0", expected: true },
			{ a: "rrr0", expected: true },
			{ a: "d0", expected: false },
			{ a: "dr0", expected: false },
			{ a: "aa aa", expected: false },
			{ a: "111", expected: true },
			{ a: "111aa", expected: false },
			{ a: "", expected: false },
			{ a: "-1", expected: true },
			{ a: ".1", expected: true },
			{ a: ".111", expected: true },
			{ a: "1.", expected: true },
			{ a: "1.1", expected: true },
			{ a: "-111.111", expected: true },
			{ a: NaN, expected: true },
		].forEach(({ a, expected }) => {
			try {
				let x: string | number = a
				if (a !== "" && !isNaN(Number(a))) x = Number(a)
				expect(types.RaliasOrValueOrNaN.safeParse(x).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
	test("Logic", () => {
		;[
			{ a: "hello", expected: true },
			{ a: 1, expected: false },
		].forEach(({ a, expected }) => {
			try {
				expect(types.Logic.safeParse(a).success).toBe(expected)
			} catch (e) {
				throw new Error(`"${a}" is ${!expected} expected ${expected}`)
			}
		})
	})
})
