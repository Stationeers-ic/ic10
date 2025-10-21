import { describe, expect, test } from "bun:test";
import { ValidateIc10Runner } from "@/index";

describe("Errors", async () => {
	test("syntax", async () => {
		const errors = await ValidateIc10Runner.validate(["move r0"].join("\n"));
		expect(errors).toBeArray();
		expect(errors).toHaveLength(1);
		expect(errors).toMatchSnapshot();
	});
});
