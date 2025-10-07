import { describe, expect, test } from "bun:test";
import { ErrorSeverity } from "@/Ic10/Errors/Errors";
import { Chip, codeToString, Housing, Ic10Runner, Network, RuntimeIc10Error, stringToCode } from "@/index";

describe("Ic10Runner", () => {
	let runner: Ic10Runner;
	let code: string;

	function createRunner(ic10Code: string) {
		const network = new Network();
		const chip = new Chip({ ic10Code, register_length: 16, stack_length: 512 });
		const socket = new Housing({ hash: 125, network, chip });
		runner = new Ic10Runner({ housing: socket });
	}

	async function run() {
		await runner.run();
		await runner.switchContext().run();
	}

	describe("База", () => {
		test("Должен выполняться без сильных ошибок", async () => {
			code = `
          move r0 3
          alias test rr0
          move test 9999
          alias test r1
          move test 9999
        `;
			createRunner(code);
			await run();
			// Проверяем ошибки песочницы
			const sandboxErrors = runner.context.errors;
			const strongSandboxErrors = sandboxErrors.filter((e) => e.severity === ErrorSeverity.Strong);
			// Убеждаемся что нет критических ошибок
			expect(strongSandboxErrors).toHaveLength(0);
			// Проверяем ошибки рабочей среды
			const runtimeErrors = runner.context.errors;
			const strongRuntimeErrors = runtimeErrors.filter((e) => e.severity === ErrorSeverity.Strong);
			// Убеждаемся что нет критических ошибок
			expect(strongRuntimeErrors).toHaveLength(0);
		});
		test("Должен правильно установить регистры", async () => {
			code = `
          move r0 3
          alias test rr0
          move test 9999
          alias test r1
          move test 9999
        `;
			createRunner(code);
			await run();
			// Проверяем значения регистров
			const registers = runner.realContext.chip.registers;
			// Добавьте свои проверки здесь
			expect(registers.get(0)).toBe(3);
			expect(registers.get(1)).toBe(9999);
			expect(registers.get(3)).toBe(9999);
		});
		test("Должен правильно обрабатывать ошибки", async () => {
			code = "invalid_command r0 1"; // Заведомо неверный код
			createRunner(code);
			await run();
			// Проверяем наличие ошибок в песочнице
			const sandboxErrors = runner.context.errors;
			expect(sandboxErrors.length).toBeGreaterThan(0);
			// Проверяем что есть хотя бы одна критическая ошибка
			const hasStrongError = sandboxErrors.some((e) => e.severity === ErrorSeverity.Strong);
			expect(hasStrongError).toBeTrue();
		});
	});
	describe("Прыжки", () => {
		test("Простой переход в низ", async () => {
			code = `
j label
move r0 1
label:          
move r1 1  
        `;
			createRunner(code);
			await run();

			const registers = runner.realContext.chip.registers;
			expect(registers.get(0)).toBe(0);
			expect(registers.get(1)).toBe(1);
		});
		test("Простой переход в вверх", async () => {
			code = `
label:
move r0 1
j label
move r1 1
        `;
			createRunner(code);
			try {
				await run();
				expect(false).toBeTrue();
			} catch (e) {
				expect(e).toBeInstanceOf(RuntimeIc10Error);
			}
			const registers = runner.realContext.chip.registers;
			expect(registers.get(0)).toBe(1);
			expect(registers.get(1)).toBe(0);
		});
	});

	describe("STR", () => {
		test("stringToCode", () => {
			expect(stringToCode("a")).toBe(97);
			expect(stringToCode("ab")).toBe(24930);
		});
		test("codeToString", () => {
			expect(codeToString(97)).toBe("a");
			expect(codeToString(24930)).toBe("ab");
		});
	});
});
