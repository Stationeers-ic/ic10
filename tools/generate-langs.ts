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
	alias = "@/Languages",
}: GenerateLangIndexOptions): Promise<void> {
	// Находим все JSON файлы в директории
	const files = await glob("*.json", {
		cwd: langDir,
	});
	console.table(files);
	if (files.length === 0) {
		throw new Error(`No JSON files found in ${langDir}`);
	}

	const imports: t.ImportDeclaration[] = [];
	const properties: t.ObjectProperty[] = [];

	files.forEach((file) => {
		const filename = path.basename(file, ".json");
		const importName = t.identifier(filename);

		// Создаем импорт: import en from "@/Languages/en.json"
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

	// Создаем export const Languages = { ... }
	const exportDeclaration = t.exportNamedDeclaration(
		t.variableDeclaration("const", [t.variableDeclarator(t.identifier("Languages"), t.objectExpression(properties))]),
	);

	const program = t.program([...imports, exportDeclaration]);
	const { code } = generate(program as any);

	// Создаем директорию если нужно
	const outputDir = path.dirname(outputFile);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	fs.writeFileSync(outputFile, `${code}\n`);
}

// Пример использования
generateLangIndex({
	langDir: path.join(path.dirname(__dirname), "src", "Languages"),
	outputFile: path.join(path.dirname(__dirname), "src", "Languages", "index.ts"),
	alias: "@/Languages",
}).catch(console.error);
