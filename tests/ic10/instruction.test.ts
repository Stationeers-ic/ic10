import { describe, expect, test } from "bun:test"
import * as process from "node:process"
import { Random } from "@stationeers-ic/exact-ic10-math"
import { createRunner, expectExpectation, type InstructionLike, runInstructionTest } from "@tests/helpers"
import { Ic10Error } from "@/Ic10/Errors/Errors"
import { instructions } from "@/Ic10/Instruction"
import type { InstructionTestData } from "@/Ic10/Instruction/Helpers/Instruction"

describe("Проверка каждой инструкции", () => {
	// Собираем все тесты синхронно
	const testCases: [string, InstructionLike, InstructionTestData][] = []

	Object.entries(instructions).forEach(([key, instruction]) => {
		if (!instruction) return

		const instr = instruction as InstructionLike
		const tests = instr.tests?.()
		if (!tests || tests.length === 0) return

		tests.forEach((testData, index) => {
			testCases.push([`${key} ${testData?.title ?? `#${index}`}`, instr, testData])
		})
	})

	// Запускаем тесты последовательно
	for (const [testName, _instruction, testData] of testCases) {
		test(testName, async () => {
			Random.resetGlobalRandom(0)
			// console.time(`🚀 Запуск теста: ${testName}`);
			// Предыдущие тесты использовали длину регистра 18 — сохраним это поведение
			const runner = createRunner(testData.code, { register_length: 18 })
			try {
				await runInstructionTest(runner, testData)
			} catch (e) {
				if (e instanceof Ic10Error) {
					console.error(e.message)
				} else {
					console.error(e)
				}
				process.exit()
			}
			// Унифицированные проверки
			for (const exp of testData.expected) {
				expectExpectation(runner, exp, expect)
			}
			// console.timeEnd(`🚀 Запуск теста: ${testName}`);
		})
	}
})
