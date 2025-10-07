import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { glob } from "glob";

console.log("🚀 Generating intstructions...");

const SOURCE_DIR = path.resolve(__dirname, "../src/Ic10/Instruction");
const INDEX_PATH = path.join(SOURCE_DIR, "index.ts");

// Функция для проверки, является ли класс абстрактным
function isAbstractClass(classNode: t.ClassDeclaration): boolean {
	return classNode.abstract === true;
}

// Функция для генерации имени инструкции из имени класса
function generateInstructionName(className: string): string {
	// Удаляем суффикс "Instruction" если он есть
	const withoutSuffix = className.replace(/Instruction$/, "");

	// Преобразуем PascalCase в snake_case (или сохраняем аббревиатуры)
	return withoutSuffix
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
		.replace(/([a-z\d])([A-Z])/g, "$1_$2")
		.toLowerCase();
}

// Расширенная функция для проверки наследования от Instruction
function extendsInstruction(classNode: t.ClassDeclaration): boolean {
	if (!classNode.superClass) return false;

	// Рекурсивная функция для проверки наследования через сложные выражения
	function checkSuperClass(superClass: t.Node): boolean {
		// Прямое наследование: class A extends Instruction
		if (t.isIdentifier(superClass)) {
			return superClass.name === "Instruction";
		}

		// Через MemberExpression: class A extends Base.Instruction
		if (t.isMemberExpression(superClass)) {
			if (t.isIdentifier(superClass.property)) {
				return superClass.property.name === "Instruction";
			}
		}

		// Через CallExpression: class A extends makeBinarySet(...)
		if (t.isCallExpression(superClass)) {
			// Проверяем аргументы call expression на наличие Instruction
			return superClass.arguments.some((arg) => {
				if (t.isIdentifier(arg)) {
					return arg.name.includes("Instruction");
				}
				if (t.isMemberExpression(arg)) {
					return t.isIdentifier(arg.property) && arg.property.name.includes("Instruction");
				}
				return false;
			});
		}

		return false;
	}

	return checkSuperClass(classNode.superClass);
}

// Альтернативный подход: проверяем по имени файла или другим признакам
function shouldIncludeClass(className: string, filePath: string): boolean {
	// Исключаем абстрактные классы по имени
	const abstractClassNames = [
		"Instruction",
		"AbstractInstruction",
		"BinaryInstruction",
		"BinaryBranchInstruction",
		"UnaryInstruction",
		"BranchInstruction",
	];

	if (abstractClassNames.includes(className)) {
		return false;
	}

	// Включаем только классы, заканчивающиеся на Instruction (но не абстрактные)
	return className.endsWith("Instruction") && !abstractClassNames.includes(className);
}

async function generateInstructionsIndex() {
	let files = await glob([`${SOURCE_DIR}/**/*.ts`, `!${INDEX_PATH}`]);

	// Сортируем файлы для детерминированного порядка обработки
	files = files.sort((a, b) => a.localeCompare(b));

	const imports: string[] = [];
	const instructionMap: Map<string, string> = new Map(); // instructionName -> className

	// Собираем все классы, наследующие от Instruction
	for (const file of files) {
		const content = fs.readFileSync(file, "utf-8");

		try {
			const ast = parse(content, {
				sourceType: "module",
				plugins: ["typescript"],
			});

			const fileClasses: Array<{ name: string; node: t.ClassDeclaration; filePath: string }> = [];

			// Сначала собираем все классы в файле
			traverse(ast, {
				ClassDeclaration(path) {
					const className = path.node.id?.name;
					if (className) {
						fileClasses.push({
							name: className,
							node: path.node,
							filePath: file,
						});
					}
				},
			});

			// Сортируем классы в файле по имени для детерминированного порядка
			fileClasses.sort((a, b) => a.name.localeCompare(b.name));

			// Проверяем наследование от Instruction и формируем импорты
			if (fileClasses.length > 0) {
				const relativePath = path.relative(SOURCE_DIR, file).replace(/\.ts$/, "").replace("\\", "/");
				// Формируем путь в формате @/src/Ic10/Instruction/...
				const importPath = `@/Ic10/Instruction/${relativePath}`;

				// Используем комбинированный подход для фильтрации
				const classNames = fileClasses
					.filter(({ name, node, filePath }) => {
						// Исключаем абстрактные классы
						if (isAbstractClass(node)) return false;

						// Проверяем наследование сложными способами
						if (extendsInstruction(node)) return true;

						// Дополнительная проверка по имени
						return shouldIncludeClass(name, filePath);
					})
					.map(({ name }) => name);

				if (classNames.length > 0) {
					// Сортируем имена классов перед добавлением в импорт
					const sortedClassNames = classNames.sort((a, b) => a.localeCompare(b));
					imports.push(`import { ${sortedClassNames.join(", ")} } from "${importPath}";`);

					// Добавляем инструкции в карту
					sortedClassNames.forEach((className) => {
						const instructionName = generateInstructionName(className);
						instructionMap.set(instructionName, className);
					});
				}
			}
		} catch (error) {
			console.warn(`Failed to parse ${file}:`, error);
		}
	}

	// Сортируем импорты и инструкции для детерминированного результата
	imports.sort((a, b) => a.localeCompare(b));
	const sortedInstructions = Array.from(instructionMap.entries()).sort(([a], [b]) => a.localeCompare(b));

	// Формируем содержимое файла через строки (проще и надежнее)
	const instructionsObject = sortedInstructions.map(([key, className]) => `  ${key}: ${className},`).join("\n");

	const content = `// Auto-generated file - DO NOT EDIT MANUALLY
${imports.join("\n")}

export type InstructionName = keyof typeof instructions;

export function isInstructionName(name: string): name is InstructionName {
  return name in instructions;
}

export const instructions = {
${instructionsObject}
} as const;
`;

	fs.writeFileSync(INDEX_PATH, content);
	console.table(sortedInstructions);
	console.log(`Generated ${INDEX_PATH} with ${instructionMap.size} instructions`);
}

// Запуск
generateInstructionsIndex().catch(console.error);
