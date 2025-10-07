// argumentParser.test.ts
import { describe, expect, test } from "bun:test";
import {
	getConst,
	getDevicePin,
	getRegister,
	hash,
	jsThing,
	parseArgumentAnyNumber,
	parseBin,
	parseHash,
	parseHex,
	parseRegister,
	parseStr,
	recursiveDevice,
	recursiveRegister,
	singleDevice,
	singleRegister,
	str,
} from "@/Ic10/Helpers/ArgumentParse"; // путь к вашему файлу
import { crc32 } from "@/Ic10/Helpers/functions";
import { Argument } from "@/Ic10/Instruction/Helpers/Argument";
import { createRunner } from "./helpers";

// Mock Context
const createMockContext = () => {
	return createRunner("").realContext;
};

// Mock Argument
const createMockArgument = (text: string) => {
	return new Argument({
		text,
		start: 0,
		length: text.length,
	});
};

describe("jsThing", () => {
	test("converts -0 to 0", () => {
		expect(jsThing(-0)).toBe(0);
	});

	test("converts -Infinity to Infinity", () => {
		expect(jsThing(-Infinity)).toBe(Infinity);
	});

	test("returns normal numbers unchanged", () => {
		expect(jsThing(42)).toBe(42);
		expect(jsThing(0)).toBe(0);
		expect(jsThing(Infinity)).toBe(Infinity);
		expect(jsThing(-5)).toBe(-5);
	});
});

describe("getConst", () => {
	test("returns constant value when found", () => {
		const arg = createMockArgument("AirCon.Cold");
		expect(getConst(arg)).toBe(0);
	});

	test("returns false when constant not found", () => {
		const arg = createMockArgument("nonexistent");
		expect(getConst(arg)).toBe(false);
	});

	test("handles grouped constants", () => {
		const arg = createMockArgument("pi");
		expect(getConst(arg)).toBe(Math.PI);
	});
});

describe("parseHex", () => {
	test("parses valid hex numbers", () => {
		expect(parseHex("$FF")).toBe(255);
		expect(parseHex("$10")).toBe(16);
		expect(parseHex("$0")).toBe(0);
	});

	test("returns false for non-hex strings", () => {
		expect(parseHex("FF")).toBe(false);
		expect(parseHex("123")).toBe(false);
		expect(parseHex("")).toBe(false);
	});
});

describe("parseBin", () => {
	test("parses valid binary numbers", () => {
		expect(parseBin("%1010")).toBe(10);
		expect(parseBin("%1111")).toBe(15);
		expect(parseBin("%0")).toBe(0);
	});

	test("returns false for non-binary strings", () => {
		expect(parseBin("1010")).toBe(false);
		expect(parseBin("123")).toBe(false);
		expect(parseBin("")).toBe(false);
	});
});

describe("parseHash", () => {
	test("parses valid HASH expressions", () => {
		expect(parseHash('HASH("test")')).toBe(crc32("test")); // "test".length * 1000
		expect(parseHash('HASH("hello")')).toBe(crc32("hello")); // "hello".length * 1000
	});

	test("returns false for invalid HASH expressions", () => {
		expect(parseHash("HASH(test)")).toBe(false); // missing quotes
		expect(parseHash('HASH("test"')).toBe(false); // missing closing parenthesis
		expect(parseHash('hash("test")')).toBe(false); // lowercase
		expect(parseHash("test")).toBe(false); // no HASH
	});
});

describe("parseStr", () => {
	test("parses valid STR expressions", () => {
		const context = createMockContext();
		const arg = createMockArgument('STR("A")');

		expect(parseStr(context, arg)).toBe(65); // 'A' char code
	});

	test("handles stringToCode errors", () => {
		const context = createMockContext();
		const arg = createMockArgument('STR("")');
		const result = parseStr(context, arg);

		expect(result).toBe(false);
	});

	test("returns false for invalid STR expressions", () => {
		const context = createMockContext();
		const arg = createMockArgument("STR(test)");

		expect(parseStr(context, arg)).toBe(false);
	});
});

describe("getRegister", () => {
	test("parses single register", () => {
		const context = createMockContext();

		expect(getRegister(context, "r0")).toBe(0);
		expect(getRegister(context, "r15")).toBe(15);
		expect(getRegister(context, "r999")).toBe(999);
	});

	test("handles recursive registers", () => {
		const context = createMockContext();
		context.setRegister(5, 10);
		context.setRegister(10, 15);

		expect(getRegister(context, "rr5")).toBe(10); // one level of recursion
		expect(getRegister(context, "rrr5")).toBe(15); // two levels of recursion
	});

	test("returns false for invalid register syntax", () => {
		const context = createMockContext();

		expect(getRegister(context, "x5")).toBe(false);
		expect(getRegister(context, "r")).toBe(false);
		expect(getRegister(context, "")).toBe(false);
		expect(getRegister(context, "5")).toBe(false);
	});
});

describe("parseRegister", () => {
	test("returns register value", () => {
		const context = createMockContext();
		context.setRegister(5, 42);
		const arg = createMockArgument("r5");

		expect(parseRegister(context, arg)).toBe(42);
	});

	test("returns false for invalid register", () => {
		const context = createMockContext();
		const arg = createMockArgument("invalid");

		expect(parseRegister(context, arg)).toBe(false);
	});
});

describe("getDevicePin", () => {
	test("returns -1 for db", () => {
		const context = createMockContext();
		expect(getDevicePin(context, "db")).toBe(-1);
	});

	test("parses single device", () => {
		const context = createMockContext();

		expect(getDevicePin(context, "d0")).toBe(0);
		expect(getDevicePin(context, "d5")).toBe(5);
	});

	test("handles recursive devices", () => {
		const context = createMockContext();
		context.setRegister(3, 4);
		context.setRegister(7, 3);
		context.setRegister(5, 7);

		expect(getDevicePin(context, "dr3")).toBe(4); // 1 level of recursion
		expect(getDevicePin(context, "drr7")).toBe(4); // 2 levels of recursion
		expect(getDevicePin(context, "drrr5")).toBe(4); // 3 levels of recursion
	});

	test("returns false for invalid device syntax", () => {
		const context = createMockContext();

		expect(getDevicePin(context, "x5")).toBe(false);
		expect(getDevicePin(context, "d")).toBe(false);
		expect(getDevicePin(context, "")).toBe(false);
	});

	test("ports & channels", () => {
		const context = createMockContext();
		context.setRegister(1, 7);

		// Для устройств с портами используем toEqual для сравнения массивов
		expect(getDevicePin(context, "db:0")).toEqual([-1, 0]);
		expect(getDevicePin(context, "d1:1")).toEqual([1, 1]);
		expect(getDevicePin(context, "d2:3")).toEqual([2, 3]);
		expect(getDevicePin(context, "dr1:3")).toEqual([7, 3]);

		// Тестируем многоуровневую рекурсию
		context.setRegister(2, 1); // r2 содержит 1
		context.setRegister(3, 2); // r3 содержит 2
		expect(getDevicePin(context, "drr3:5")).toEqual([1, 5]);
	});

	// Добавляем тест для проверки что обычные устройства без портов все еще работают
	test("mixed device syntax", () => {
		const context = createMockContext();
		context.setRegister(1, 8);

		// Устройства без портов возвращают число
		expect(getDevicePin(context, "d5")).toBe(5);
		expect(getDevicePin(context, "dr1")).toBe(8);

		// Устройства с портами возвращают массив
		expect(getDevicePin(context, "d5:2")).toEqual([5, 2]);
		expect(getDevicePin(context, "dr1:4")).toEqual([8, 4]);
	});
});

describe("parseArgumentAnyNumber", () => {
	test("parses simple numbers", () => {
		const context = createMockContext();
		const arg = createMockArgument("42");

		expect(parseArgumentAnyNumber(context, arg)).toBe(42);
	});

	test("parses hex numbers", () => {
		const context = createMockContext();
		const arg = createMockArgument("$FF");

		expect(parseArgumentAnyNumber(context, arg)).toBe(255);
	});

	test("parses binary numbers", () => {
		const context = createMockContext();
		const arg = createMockArgument("%1010");

		expect(parseArgumentAnyNumber(context, arg)).toBe(10);
	});

	test("parses hash expressions", () => {
		const context = createMockContext();
		const arg = createMockArgument('HASH("test")');

		expect(parseArgumentAnyNumber(context, arg)).toBe(crc32("test"));
	});

	test("parses string expressions", () => {
		const context = createMockContext();
		const arg = createMockArgument('STR("A")');

		expect(parseArgumentAnyNumber(context, arg)).toBe(65);
	});

	test("parses constants", () => {
		const context = createMockContext();
		const arg = createMockArgument("AirCon.Cold");

		expect(parseArgumentAnyNumber(context, arg)).toBe(0);
	});

	test("parses registers", () => {
		const context = createMockContext();
		context.setRegister(3, 99);
		const arg = createMockArgument("r3");

		expect(parseArgumentAnyNumber(context, arg)).toBe(99);
	});

	test("returns false for unparsable argument", () => {
		const context = createMockContext();
		const arg = createMockArgument("invalid_argument");

		expect(parseArgumentAnyNumber(context, arg)).toBe(false);
	});
});

describe("Regular Expressions", () => {
	describe("singleRegister", () => {
		test("matches valid single registers", () => {
			expect(singleRegister.test("r0")).toBe(true);
			expect(singleRegister.test("r15")).toBe(true);
			expect(singleRegister.test("r999")).toBe(true);
		});

		test("rejects invalid single registers", () => {
			expect(singleRegister.test("r")).toBe(false);
			expect(singleRegister.test("0")).toBe(false);
			expect(singleRegister.test("rr5")).toBe(false);
		});
	});

	describe("recursiveRegister", () => {
		test("matches valid recursive registers", () => {
			expect(recursiveRegister.test("rr5")).toBe(true);
			expect(recursiveRegister.test("rrr15")).toBe(true);
			expect(recursiveRegister.test("rrrr999")).toBe(true);
		});

		test("rejects invalid recursive registers", () => {
			expect(recursiveRegister.test("r5")).toBe(false);
			expect(recursiveRegister.test("xrr5")).toBe(false);
		});
	});

	describe("singleDevice", () => {
		test("matches valid single devices", () => {
			expect(singleDevice.test("d0")).toBe(true);
			expect(singleDevice.test("d5")).toBe(true);
		});

		test("rejects invalid single devices", () => {
			expect(singleDevice.test("d")).toBe(false);
			expect(singleDevice.test("0")).toBe(false);
			expect(singleDevice.test("dd5")).toBe(false);
		});
	});

	describe("recursiveDevice", () => {
		test("matches valid recursive devices", () => {
			expect(recursiveDevice.test("dr5")).toBe(true);
			expect(recursiveDevice.test("drr15")).toBe(true);
		});

		test("rejects invalid recursive devices", () => {
			expect(recursiveDevice.test("d5")).toBe(false);
			expect(recursiveDevice.test("xdr5")).toBe(false);
		});
	});

	describe("hash", () => {
		test("matches valid HASH expressions", () => {
			expect(hash.test('HASH("test")')).toBe(true);
			expect(hash.test('HASH("hello world")')).toBe(true);
		});

		test("rejects invalid HASH expressions", () => {
			expect(hash.test("HASH(test)")).toBe(false);
			expect(hash.test('hash("test")')).toBe(false);
		});
	});

	describe("str", () => {
		test("matches valid STR expressions", () => {
			expect(str.test('STR("test")')).toBe(true);
			expect(str.test('STR("A")')).toBe(true);
		});

		test("rejects invalid STR expressions", () => {
			expect(str.test("STR(test)")).toBe(false);
			expect(str.test('str("test")')).toBe(false);
		});
	});
});

describe("Edge Cases", () => {
	test("handles multiple recursion levels", () => {
		const context = createMockContext();

		// Setup chain: r1 -> r2 -> r3 -> r4 -> 100
		context.setRegister(1, 2);
		context.setRegister(2, 3);
		context.setRegister(3, 4);
		context.setRegister(4, 100);

		expect(getRegister(context, "rrrrr1")).toBe(100);
	});

	test("handles zero recursion (edge case)", () => {
		const context = createMockContext();
		context.setRegister(5, 10);

		// This should be equivalent to r5 since we need at least 2 'r's for recursion
		expect(getRegister(context, "r5")).toBe(5); // no recursion
	});

	test("handles negative numbers", () => {
		const context = createMockContext();
		const arg = createMockArgument("-42");

		expect(parseArgumentAnyNumber(context, arg)).toBe(-42);
	});

	test("handles floating point numbers", () => {
		const context = createMockContext();
		const arg = createMockArgument("3.14");

		expect(parseArgumentAnyNumber(context, arg)).toBe(3.14);
	});
});
