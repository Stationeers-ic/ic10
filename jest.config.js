module.exports = {
	preset: "ts-jest",
	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(test).ts?(x)"],
	transform: {
		"^.+\\.(ts)$": "ts-jest",
	},
	transformIgnorePatterns: [
		"/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$",
		"/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$",
		"/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$",
	],
}
