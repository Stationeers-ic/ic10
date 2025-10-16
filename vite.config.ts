import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@tests": path.resolve(__dirname, "tests"),
			"@tools": path.resolve(__dirname, "tools"),
		},
	},
	build: {
		minify: true,
		sourcemap: false,
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "ic10",
			formats: ["cjs"],
			fileName: (format) => {
				switch (format) {
					case "cjs":
						return "ic10.cjs.js";
				}
				return "ic10.js";
			},
		},
		rollupOptions: {
			external: [/^@tests\//, /^@tools\//],
			output: {
				globals: {
					ic10: "ic10",
				},
			},
		},
	},
	plugins: [
		// dts({
		// 	entryRoot: "src",
		// 	outDir: "dist",
		// 	exclude: ["tests/**/*", "tools/**/*", "node_modules/**/*", "vite.config.ts"],
		// 	rollupTypes: true,
		// 	insertTypesEntry: true,
		// }),
	],
	define: {
		__VITE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
		isProd: process.env.NODE_ENV === "production",
	},
});
