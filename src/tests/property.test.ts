import { describe, expect, test } from "bun:test"
import { getProperty, setProperty } from "../property"

describe("property", () => {
	const object: Record<string, any> = {
		foo: "bar",
		one: 1,
		obj: {
			two: 2,
			test: 3,
		},
		arr: [1, 2, 3],
		obj2: {
			three: 3,
			nan: NaN,
		},
	}
	test("getProperty", async () => {
		expect(getProperty(object, "foo")).toBe("bar")
		expect(getProperty(object, "one")).toBe(1)
		expect(getProperty(object, "obj.two")).toBe(2)
		expect(getProperty(object, "arr.2")).toBe(3)
		expect(getProperty(object, "obj2.three")).toBe(3)
		expect(getProperty(object, "obj2.nan")).toBe(NaN)
	})
	test("setProperty", async () => {
		setProperty(object, "foo", "baz")
		expect(object.foo).toBe("baz")
		setProperty(object, "obj.two", 4)
		expect(object.obj.two).toBe(4)
		expect(object.obj.test).toBe(3)
		setProperty(object, "obj2.nan", 4)
		expect(object.obj2.nan).toBe(4)
		setProperty(object, "arr.2", 4)
		expect(object.arr[2]).toBe(4)
		setProperty(object, "new", 2)
		expect(object.new).toBe(2)
		setProperty(object, "obj.new", 2)
		expect(object.obj.new).toBe(2)
		expect(object.obj.test).toBe(3)
		setProperty(object, "new.foo", 2)
		expect(object.new).toEqual({ foo: 2 })
	})
})
