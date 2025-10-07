import * as process from "node:process";
import { createInterface } from "node:readline/promises";
import { createRunner, type InstructionLike, logExpectation, runInstructionTest } from "@tests/helpers";
import { Ic10Error } from "@/Ic10/Errors/Errors";
import { instructions } from "@/Ic10/Instruction";

async function interactiveSelect() {
	const entries = Object.entries(instructions).filter(([_, instr]) => {
		const i = instr as InstructionLike;
		const t = i?.tests?.();
		return Array.isArray(t) && t.length > 0;
	});

	if (entries.length === 0) {
		console.error("Нет инструкций с тестами.");
		process.exit(1);
	}

	const rl = createInterface({ input: process.stdin, output: process.stdout });

	console.log("Доступные инструкции:");
	entries.forEach(([name], i) => {
		console.log(`${i}: ${name}`);
	});
	const ansInstr = await rl.question("Выберите инструкцию (номер или имя): ");

	const instrIndex = Number.isNaN(Number(ansInstr))
		? entries.findIndex(([n]) => n === ansInstr)
		: parseInt(ansInstr, 10);
	if (instrIndex < 0 || instrIndex >= entries.length) {
		console.error("Некорректный выбор инструкции.");
		process.exit(1);
	}

	const [instrName, instr] = entries[instrIndex];
	const tests = (instr as InstructionLike).tests?.() ?? [];
	if (tests.length === 0) {
		console.error("У выбранной инструкции нет тестов.");
		process.exit(1);
	}

	console.log(`Тесты для ${instrName}:`);
	tests.forEach((t, i) => {
		console.log(`${i}: ${t.title ?? `#${i}`}`);
	});
	const ansTest = await rl.question("Выберите тест (номер): ");
	const testIndex = parseInt(ansTest, 10);
	rl.close();

	if (Number.isNaN(testIndex) || testIndex < 0 || testIndex >= tests.length) {
		console.error("Некорректный выбор теста.");
		process.exit(1);
	}

	return { instrName, test: tests[testIndex], testIndex };
}

function selectByArgs(instrNameArg: string, testIndexArg?: string) {
	const entry = Object.entries(instructions).find(([n]) => n === instrNameArg);
	if (!entry) {
		console.error(`Инструкция "${instrNameArg}" не найдена.`);
		process.exit(1);
	}
	const [instrName, instr] = entry;
	const tests = (instr as InstructionLike).tests?.() ?? [];
	if (tests.length === 0) {
		console.error(`У инструкции "${instrName}" нет тестов.`);
		process.exit(1);
	}
	const testIndex = testIndexArg ? parseInt(testIndexArg, 10) : 0;
	if (Number.isNaN(testIndex) || testIndex < 0 || testIndex >= tests.length) {
		console.error(`Некорректный индекс теста: ${testIndexArg}`);
		process.exit(1);
	}
	return { instrName, test: tests[testIndex], testIndex };
}

async function main() {
	const [argInstr, argTestIndex] = process.argv.slice(2);
	const selection = argInstr ? selectByArgs(argInstr, argTestIndex) : await interactiveSelect();

	const { instrName, test, testIndex } = selection;

	console.log(`Инструкция: ${instrName}`);
	console.log(`Тест: ${test.title ?? `#${testIndex}`}`);
	console.log("IC10 code:\n", test.code);

	const runner = createRunner(test.code);

	try {
		await runInstructionTest(runner, test);
	} catch (e) {
		if (e instanceof Ic10Error) {
			console.error("Ic10Error:", e.message);
		} else {
			console.error(e);
		}
		process.exit(1);
	}
	console.warn(runner.realContext.errors);
	console.error(runner.realContext.errors);
	const registers = runner.realContext.chip.registers;
	console.log("Состояние регистров (r0..r15):");
	for (let i = 0; i < 16; i++) {
		console.log(`r${i}:`, registers.get(i));
	}

	if (test.expected?.length) {
		console.log("Проверка ожидаемых значений:");
		for (const exp of test.expected) {
			logExpectation(runner, exp);
		}
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
