import { ArgumentCalculators } from "@/Ic10/Instruction/Helpers/ArgumentCalculators";
import {
	Instruction,
	type InstructionArgument,
	type InstructionTestData,
} from "@/Ic10/Instruction/Helpers/Instruction";
import type { InstructionLine } from "../Lines/InstructionLine";

// Базовый класс для условных переходов
abstract class ConditionalJumpInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.anyNumber(), ArgumentCalculators.anyNumber(), ArgumentCalculators.jumpTarget()];
	}

	abstract compare(a: number, b: number): boolean;

	override run(): void {
		const a = this.getArgumentValue<number>(0);
		const b = this.getArgumentValue<number>(1);
		const target = this.getArgumentValue<number>(2);

		if (this.compare(a, b)) {
			this.context.setNextLineIndex(target);
		}
	}
}

export class JInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: `j 2\nmove r0 1\nmove r1 1`,
				iterations_count: 2,
				expected: [
					{
						type: "loop",
						nextLineIndex: 3,
					},
					{
						type: "register",
						register: 0,
						value: 0,
					},
					{
						type: "register",
						register: 1,
						value: 1,
					},
				],
			},
		];
	}

	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.jumpTarget()];
	}

	override run(): void {
		const r = this.getArgumentValue<number>(0);
		this.context.setNextLineIndex(r);
	}
}
export class JalInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: `jal 2\nmove r0 1\nmove r1 1`,
				iterations_count: 2,
				expected: [
					{
						type: "loop",
						nextLineIndex: 3,
					},
					{
						type: "register",
						register: 0,
						value: 0,
					},
					{
						type: "register",
						register: 1,
						value: 1,
					},
				],
			},
		];
	}

	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.jumpTarget()];
	}

	override run(): void {
		const r = this.getArgumentValue<number>(0);
		this.context.setNextLineIndex(r, true);
	}
}

export class jrInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				title: "-1",
				code: `add r0 r0 1 \njr -1\n add r1 r1 1`,
				iterations_count: 3,
				expected: [
					{
						type: "loop",
						nextLineIndex: 1,
					},
					{
						type: "register",
						register: 0,
						value: 2,
					},
					{
						type: "register",
						register: 1,
						value: 0,
					},
				],
			},
			{
				title: "-1 #2",
				code: `add r0 r0 1 \njr -1\n add r1 r1 1`,
				iterations_count: 4,
				expected: [
					{
						type: "loop",
						nextLineIndex: 0,
					},
					{
						type: "register",
						register: 0,
						value: 2,
					},
					{
						type: "register",
						register: 1,
						value: 0,
					},
				],
			},
			{
				title: "0",
				code: `add r0 r0 1 \njr 0\n add r1 r1 1`,
				iterations_count: 3,
				expected: [
					{
						type: "loop",
						nextLineIndex: 1,
					},
					{
						type: "register",
						register: 0,
						value: 1,
					},
					{
						type: "register",
						register: 1,
						value: 0,
					},
				],
			},
			{
				title: "1",
				code: `jr 1\nmove r0 1\nmove r1 1`,
				iterations_count: 3,
				expected: [
					{
						type: "register",
						register: 0,
						value: 1,
					},
					{
						type: "register",
						register: 1,
						value: 1,
					},
				],
			},
			{
				title: "2",
				code: `jr 2\nmove r0 1\nmove r1 1`,
				iterations_count: 3,
				expected: [
					{
						type: "register",
						register: 0,
						value: 0,
					},
					{
						type: "register",
						register: 1,
						value: 1,
					},
				],
			},
		];
	}

	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.jumpTarget()];
	}

	override run(): void {
		const r = this.getArgumentValue<number>(0);
		if (r === 0) {
			this.context.setNextLineIndex(this.context.currentLinePosition);
		}
		if (r < 0) {
			const t = Math.abs(r) + 1;
			this.context.setNextLineIndex(this.context.currentLinePosition - t);
		} else {
			this.context.setNextLineIndex(this.context.currentLinePosition + r);
		}
	}

	public end(this: InstructionLine): boolean {
		return true;
	}
}

export class JeInstruction extends ConditionalJumpInstruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: `move r0 1\nmove r1 1\nje r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 0 },
					{ type: "register", register: 3, value: 1 },
				],
			},
			{
				code: `move r0 1\nmove r1 2\nje r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 1 },
					{ type: "register", register: 3, value: 1 },
				],
			},
		];
	}

	compare(a: number, b: number): boolean {
		return a === b;
	}
}

export class JneInstruction extends ConditionalJumpInstruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: `move r0 1\nmove r1 2\njne r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 0 },
					{ type: "register", register: 3, value: 1 },
				],
			},
			{
				code: `move r0 1\nmove r1 1\njne r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 1 },
					{ type: "register", register: 3, value: 1 },
				],
			},
		];
	}

	compare(a: number, b: number): boolean {
		return a !== b;
	}
}

export class JgtInstruction extends ConditionalJumpInstruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: `move r0 3\nmove r1 2\njgt r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 0 },
					{ type: "register", register: 3, value: 1 },
				],
			},
			{
				code: `move r0 2\nmove r1 3\njgt r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 1 },
					{ type: "register", register: 3, value: 1 },
				],
			},
		];
	}

	compare(a: number, b: number): boolean {
		return a > b;
	}
}

export class JltInstruction extends ConditionalJumpInstruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: `move r0 1\nmove r1 2\njlt r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 0 },
					{ type: "register", register: 3, value: 1 },
				],
			},
			{
				code: `move r0 2\nmove r1 1\njlt r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 1 },
					{ type: "register", register: 3, value: 1 },
				],
			},
		];
	}

	compare(a: number, b: number): boolean {
		return a < b;
	}
}

export class JgeInstruction extends ConditionalJumpInstruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: `move r0 2\nmove r1 2\njge r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 0 },
					{ type: "register", register: 3, value: 1 },
				],
			},
			{
				code: `move r0 1\nmove r1 2\njge r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 1 },
					{ type: "register", register: 3, value: 1 },
				],
			},
		];
	}

	compare(a: number, b: number): boolean {
		return a >= b;
	}
}

export class JleInstruction extends ConditionalJumpInstruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: `move r0 1\nmove r1 2\njle r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 0 },
					{ type: "register", register: 3, value: 1 },
				],
			},
			{
				code: `move r0 2\nmove r1 1\njle r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [
					{ type: "register", register: 2, value: 1 },
					{ type: "register", register: 3, value: 1 },
				],
			},
		];
	}

	compare(a: number, b: number): boolean {
		return a <= b;
	}
}
