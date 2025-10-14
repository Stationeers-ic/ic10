import { Chip } from "@/Core/Chip";
import { Network } from "@/Core/Network";
import { Ic10Runner } from "@/Ic10/Ic10Runner";
import type { InstructionTestData, InstructionTestExpected } from "@/Ic10/Instruction/Helpers/Instruction";
import { Ic10Error, StructureCircuitHousing } from "@/index";

export type CreateRunnerOptions = {
	register_length: number;
	stack_length: number;
	hash: number;
	network?: Network;
};

export function createRunner(ic10Code: string | string[], options?: Partial<CreateRunnerOptions>): Ic10Runner {
	const network = options?.network ?? new Network();
	if (Array.isArray(ic10Code)) {
		ic10Code = ic10Code.join("\n");
	}
	const chip = new Chip({
		ic10Code,
		register_length: options?.register_length ?? 16,
		stack_length: options?.stack_length ?? 512,
	});
	const socket = new StructureCircuitHousing({
		network,
		chip,
	});
	socket.id = 0;
	return new Ic10Runner({ housing: socket });
}

export async function runInstructionTest(runner: Ic10Runner, testData: InstructionTestData) {
	if (testData.devices !== undefined) {
		for (const device of testData.devices) {
			runner.realContext.network.apply(device.device);
			if (typeof device.pin !== "undefined") {
				runner.realContext.housing.connectDevices(device.pin, device.device);
			}
		}
	}
	await runner.run(); // песочница
	runner.switchContext("real");
	if (testData.iterations_count) {
		for (let i = 0; i < testData.iterations_count; i++) {
			await runner.step();
		}
	} else {
		await runner.run();
	}
	runner.contextSwitcher.getErrors().forEach((err) => {
		if (err instanceof Ic10Error) {
			console.log("🟥", err.formated_message);
		}
	});
	return runner;
}

export async function runDualContext(runner: Ic10Runner) {
	await runner.run(); // песочница
	await runner.switchContext().run(); // рабочая среда
	return runner;
}

export type InstructionLike = {
	tests?: () => InstructionTestData[] | undefined;
};

/** Внутренняя утилита для получения фактического значения и описания ожидания */
export function resolveExpectation(
	runner: Ic10Runner,
	exp: InstructionTestExpected,
): { label: string; expected: number; got: number } {
	switch (exp.type) {
		case "register": {
			const got = runner.realContext.chip.registers.get(exp.register);
			return { label: `r${exp.register}`, expected: exp.value, got };
		}
		case "device": {
			const got = runner.realContext.getDeviceParameterByPin(exp.pin, exp.prop);
			return {
				label: `pin ${exp.pin}.${String(exp.prop)}`,
				expected: exp.value,
				got,
			};
		}
		case "loop": {
			const got = runner.realContext.getNextLineIndex();
			return { label: "nextLineIndex", expected: exp.nextLineIndex, got };
		}
		case "stack": {
			const got = runner.realContext.stack().get(exp.index);
			return { label: `get db ${exp.index}`, expected: exp.value, got };
		}
	}
}

/** Логирование результата ожидания (для CLI-скриптов) */
export function logExpectation(runner: Ic10Runner, exp: InstructionTestExpected) {
	const { label, expected, got } = resolveExpectation(runner, exp);
	console.log(`exp ${label} = ${expected} | got ${got}`);
}

/** Проверка ожидания через expect (для тестов) */
export function expectExpectation(
	runner: Ic10Runner,
	exp: InstructionTestExpected,
	expectImpl: (val: any) => { toBe: (v: any) => void },
) {
	const { expected, got } = resolveExpectation(runner, exp);
	expectImpl(got).toBe(expected);
}

/** Проверить все ожидания */
export function expectAll(
	runner: Ic10Runner,
	expectedList: InstructionTestExpected[],
	expectImpl: (val: any) => { toBe: (v: any) => void },
) {
	for (const exp of expectedList) {
		expectExpectation(runner, exp, expectImpl);
	}
}

/** Залогировать все ожидания */
export function logAll(runner: Ic10Runner, expectedList: InstructionTestExpected[]) {
	for (const exp of expectedList) {
		logExpectation(runner, exp);
	}
}
