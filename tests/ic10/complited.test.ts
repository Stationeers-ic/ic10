import { describe, expect, test } from "bun:test";
import INSTRUCTIONS from "@/Defines/instructions";
import { instructions } from "@/Ic10/Instruction";

describe("Выполнено", () => {
	test("Процент реализованных инструкций", () => {
		const implemented = Object.keys(instructions);
		const required = Object.keys(INSTRUCTIONS).filter((i) => i !== "label");

		// Находим лишние инструкции (реализованные, но не требуемые)
		const extraInstructions = implemented.filter((i) => !required.includes(i));

		// Формируем таблицу для требуемых инструкций
		const requiredTable = required.map((key) => ({
			instruction: key,
			status: implemented.includes(key) ? "✅" : "❌",
			type: "required",
		}));

		// Формируем таблицу для лишних инструкций
		const extraTable = extraInstructions.map((key) => ({
			instruction: key,
			status: "🟡",
			type: "extra",
		}));

		// Объединяем таблицы
		const table = [...requiredTable, ...extraTable].sort((a, b) => {
			// Сначала сортируем по статусу, затем по типу
			if (a.status !== b.status) {
				return a.status.localeCompare(b.status);
			}
			return a.type.localeCompare(b.type);
		});

		// Выводим таблицу
		console.table(table);

		// Выводим детали нереализованных
		const notImplemented = required.filter((key) => !implemented.includes(key));
		if (notImplemented.length > 0) {
			console.log("\nНереализованные инструкции:");
			notImplemented.forEach((key) => {
				console.log(`\n${key}:`);
				console.log(`  ${(INSTRUCTIONS as any)[key].description}  ${(INSTRUCTIONS as any)[key].example}`);
			});
		}

		// Выводим информацию о лишних инструкциях
		if (extraInstructions.length > 0) {
			console.log("\nЛишние инструкции (реализованы, но не требуются):");
			extraInstructions.forEach((key) => {
				console.log(`  ${key}`);
			});
		}

		// Считаем процент реализации (только по требуемым инструкциям)
		const percent = (implemented.filter((i) => required.includes(i)).length / required.length) * 100;

		// Выводим общую статистику
		console.log(`\nОбщая статистика:`);
		console.log(`  - Требуемые инструкции: ${required.length}`);
		console.log(`  - Реализованные требуемые: ${implemented.filter((i) => required.includes(i)).length}`);
		console.log(`  - Лишние инструкции: ${extraInstructions.length}`);
		console.log(`  - Всего реализовано: ${implemented.length}`);

		// Выводим процент с эмодзи
		if (percent >= 100) {
			console.log(
				`\n🎉 Реализовано 100% требуемых инструкций (${implemented.filter((i) => required.includes(i)).length} из ${required.length})`,
			);
		} else {
			console.log(
				`\n⚠️ Реализовано ${percent.toFixed(2)}% требуемых инструкций (${implemented.filter((i) => required.includes(i)).length} из ${required.length})`,
			);
		}

		if (extraInstructions.length > 0) {
			console.log(`📝 Обнаружены лишние инструкции: ${extraInstructions.length}`);
		}

		expect(percent).toBeGreaterThanOrEqual(100);
	});
});
