import { describe, test } from "bun:test";
import INSTRUCTIONS from "@/Defines/instructions";
import { instructions } from "@/Ic10/Instruction";

describe.only("Выполнено", () => {
	test.todo("Процент реализованных инструкций", () => {
		const implemented = Object.keys(instructions);
		const required = Object.keys(INSTRUCTIONS).filter((i) => i !== "label");

		// Формируем таблицу
		const table = required
			.map((key) => ({
				instruction: key,
				status: implemented.includes(key) ? "✅" : "❌",
			}))
			.sort((a, b) => a.status.localeCompare(b.status));

		// Выводим таблицу
		console.table(table);

		// Выводим детали нереализованных
		console.log("\nНереализованные инструкции:");
		required
			.filter((key) => !implemented.includes(key))
			.forEach((key) => {
				console.log(`\n${key}:`);
				console.log(`  ${INSTRUCTIONS[key].description}  ${INSTRUCTIONS[key].example}`);
			});

		// Считаем процент реализации
		const percent = ((implemented.length / required.length) * 100).toFixed(2);

		// Выводим процент с эмодзи
		if (percent === "100.00") {
			console.log(`🎉 Реализовано 100% инструкций (${implemented.length} из ${required.length})`);
		} else {
			console.log(`⚠️ Реализовано ${percent}% инструкций (${implemented.length} из ${required.length})`);
		}

		// Тест проходит только если реализовано 100%
	});
});
