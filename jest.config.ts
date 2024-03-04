import type { Config } from "jest"

const config: Config = {
	preset: "ts-jest",
	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(test).ts?(x)"],
	transform: {
		"^.+\\.(ts)$": "ts-jest",
	},
	transformIgnorePatterns: [
		"/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\$",
		"/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$",
		"/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$",
	],
}

export default config
