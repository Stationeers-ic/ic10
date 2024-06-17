import { expect, test } from "bun:test"
import { TOKEN_TYPES, TOKENS } from "../lexerTokens"

test("TOKEN_TYPES", () => {
	expect(TOKEN_TYPES).toBeTypeOf("object")
	// test that keys are uppercase and match values
	for (const [key, value] of Object.entries(TOKEN_TYPES)) {
		expect(key).toBe(key.toUpperCase())
		expect(key).toBe(value)
	}
})
test("TOKENS", () => {
	expect(TOKENS).toBeTypeOf("object")
})
