// scripts/updateLaunchOptions.ts

import { promises as fs } from "node:fs";
import path from "node:path";
import JSON5 from "json5";
import { instructions } from "@/Ic10/Instruction";

console.log("🚀 Generating vscode...");

interface Instruction {
	tests?: () => unknown;
}

interface ErrorStats {
	noInstruction: string[];
	noTestsMethod: string[];
	testsThrew: string[];
	notArray: string[];
	emptyArray: string[];
}

async function main() {
	console.log("Начинаем обновление launch.json...\n");

	const allowed: string[] = [];
	const errors: ErrorStats = {
		noInstruction: [],
		noTestsMethod: [],
		testsThrew: [],
		notArray: [],
		emptyArray: [],
	};

	// Сортируем ключи инструкций для детерминированного поведения
	const sortedInstructionKeys = Object.keys(instructions).sort();

	// Проходим по всем инструкциям в отсортированном порядке
	for (const key of sortedInstructionKeys) {
		const instruction = instructions[key];

		// Проверяем наличие инструкции
		if (!instruction) {
			errors.noInstruction.push(key);
			continue;
		}

		// Проверяем наличие метода tests
		if (typeof (instruction as Instruction).tests !== "function") {
			errors.noTestsMethod.push(key);
			continue;
		}

		let testResults: unknown;
		try {
			// Пытаемся получить тесты
			testResults = (instruction as Instruction).tests!();
		} catch (_error) {
			errors.testsThrew.push(key);
			continue;
		}

		// Проверяем что результат - непустой массив
		if (!Array.isArray(testResults)) {
			errors.notArray.push(key);
			continue;
		}

		if (testResults.length === 0) {
			errors.emptyArray.push(key);
			continue;
		}

		allowed.push(key);
	}

	// Сортируем массив allowed для детерминированного вывода
	allowed.sort();

	// Сортируем все массивы ошибок для детерминированного вывода
	errors.noInstruction.sort();
	errors.noTestsMethod.sort();
	errors.testsThrew.sort();
	errors.notArray.sort();
	errors.emptyArray.sort();

	// Выводим статистику
	console.log(`✅ Добавлено инструкций: ${allowed.length}`);

	// Выводим ошибки только если они есть
	if (errors.noInstruction.length > 0) {
		console.log(`❌ Пропущено (нет инструкции): ${errors.noInstruction.length}`);
	}

	if (errors.noTestsMethod.length > 0) {
		console.log(`❌ Пропущено (нет метода tests): ${errors.noTestsMethod.length}`);
	}

	if (errors.testsThrew.length > 0) {
		console.log(`❌ Пропущено (ошибка в tests()): ${errors.testsThrew.length}`);
	}

	if (errors.notArray.length > 0) {
		console.log(`❌ Пропущено (не массив): ${errors.notArray.length}`);
	}

	if (errors.emptyArray.length > 0) {
		console.log(`❌ Пропущено (пустой массив): ${errors.emptyArray.length}`);
	}

	// Подробный вывод по запросу (можно закомментировать если не нужен)
	if (process.env.DEBUG) {
		console.log("\nДетальная информация (только в DEBUG режиме):");
		for (const [category, items] of Object.entries(errors)) {
			if (items.length > 0) {
				console.log(`\n${category}: ${items.join(", ")}`);
			}
		}
	}

	// Обновляем launch.json
	const launchPath = path.join(path.dirname(__dirname), ".vscode/launch.json");

	try {
		const content = await fs.readFile(launchPath, "utf-8");
		const data = JSON5.parse(content);

		// Находим input с id "instrName"
		const inputs = Array.isArray(data?.inputs) ? data.inputs : [];
		const instrInput = inputs.find((i: any) => i?.id === "instrName");

		if (!instrInput) {
			console.warn("⚠️  Поле instrName не найдено в launch.json");
			return;
		}

		// Обновляем опции (уже отсортированные)
		instrInput.options = allowed;

		// Сохраняем изменения
		const updatedContent = JSON.stringify(data, null, 2);
		await fs.writeFile(launchPath, updatedContent, "utf-8");

		console.log("\n✅ launch.json успешно обновлен");
	} catch (error) {
		console.error("❌ Ошибка при работе с launch.json:", error);
		throw error;
	}
}

main().catch((err) => {
	console.error("💥 Критическая ошибка:", err);
	process.exit(1);
});
