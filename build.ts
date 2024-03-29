import esbuild, { BuildOptions } from "esbuild" // Пути к исходным файлам TypeScript

// Пути к исходным файлам TypeScript
const entryPoints = ["src/index.ts"] // Путь к вашему входному файлу TypeScript

// Общие настройки для обеих сборок
const commonConfig: BuildOptions = {
	entryPoints,
	bundle: true, // Указание на создание бандла
	minify: true, // Минификация выходного кода
	sourcemap: true, // Генерация карты исходников
	platform: "node", // Платформа целевого окружения (node или browser)
	target: ["node18"], // Целевая версия Node.js или браузера
}

// Сборка для CommonJS
esbuild
	.build({
		...commonConfig,
		outfile: "dist/index.cjs.js", // Выходной файл для CJS
		format: "cjs", // Формат модуля CJS
	})
	.catch(() => process.exit(1))
