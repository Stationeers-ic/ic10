import fs from "node:fs";
import path from "node:path";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { glob } from "glob";

interface GenerateLangIndexOptions {
	langDir: string;
	outputFile?: string;
	alias?: string;
}

export async function generateLangIndex({
	langDir,
	outputFile = "index.ts",
	alias = "@/lang",
}: GenerateLangIndexOptions): Promise<void> {
	// Находим все JSON файлы в директории
	const pattern = path.join(langDir, "*.json");
	const files = await glob(pattern);

	if (files.length === 0) {
		throw new Error(`No JSON files found in ${langDir}`);
	}

	const imports: t.ImportDeclaration[] = [];
	const properties: t.ObjectProperty[] = [];

	files.forEach((file) => {
		const filename = path.basename(file, ".json");
		const importName = t.identifier(filename);

		// Создаем импорт: import en from "@/lang/en.json"
		const importDeclaration = t.importDeclaration(
			[t.importDefaultSpecifier(importName)],
			t.stringLiteral(`${alias}/${filename}.json`),
		);

		imports.push(importDeclaration);

		// Создаем свойство для объекта: en: { translation: en }
		properties.push(
			t.objectProperty(
				t.identifier(filename),
				t.objectExpression([t.objectProperty(t.identifier("translation"), t.identifier(filename))]),
			),
		);
	});

	// Создаем export default { en: { translation: en }, ru: { translation: ru }, ... }
	const exportDefault = t.exportDefaultDeclaration(t.objectExpression(properties));

	const program = t.program([...imports, exportDefault]);
	const { code } = generate(program);

	// Создаем директорию если нужно
	const outputDir = path.dirname(outputFile);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	fs.writeFileSync(outputFile, `${code}\n`);
}

// Пример использования
generateLangIndex({
	langDir: "./src/lang",
	outputFile: "./src/lang/index.ts",
	alias: "@/lang",
}).catch(console.error);
