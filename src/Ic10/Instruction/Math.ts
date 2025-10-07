import icMath from "exact-ic10-math";
import { ArgumentCalculators } from "@/Ic10/Instruction/Helpers/ArgumentCalculators";
import {
	Instruction,
	type InstructionArgument,
	type InstructionTestData,
} from "@/Ic10/Instruction/Helpers/Instruction";

abstract class BinaryMathInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("a"),
			ArgumentCalculators.anyNumber("b"),
		];
	}

	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const a1 = this.getArgumentValue<number>("a");
		const a2 = this.getArgumentValue<number>("b");
		this.context.setRegister(r, this.operation(a1, a2));
	}

	public abstract operation(a: number, b: number): number;
}

abstract class UnaryMathInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.registerLink("result"), ArgumentCalculators.anyNumber("value")];
	}

	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const a = this.getArgumentValue<number>("value");
		this.context.setRegister(r, this.operation(a));
	}

	public abstract operation(a: number): number;
}

export class AddInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "add r2 5 5",
				expected: [{ type: "register", register: 2, value: 10 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return a + b;
	}
}

export class SubInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "sub r4 20 10",
				expected: [{ type: "register", register: 4, value: 10 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return a - b;
	}
}

export class MulInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "mul r3 5 2",
				expected: [{ type: "register", register: 3, value: 10 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return a * b;
	}
}

export class DivInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "div r5 20 2",
				expected: [{ type: "register", register: 5, value: 10 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return a / b;
	}
}

export class ModInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "mod r7 20 3",
				expected: [{ type: "register", register: 7, value: 2 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return a % b;
	}
}

export class AbsInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "abs r6 -1",
				expected: [{ type: "register", register: 6, value: 1 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.abs(a);
	}
}

export class SqrtInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "sqrt r1 9",
				expected: [{ type: "register", register: 1, value: 3 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.sqrt(a);
	}
}

export class RoundInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "round r2 2.7",
				expected: [{ type: "register", register: 2, value: 3 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.round(a);
	}
}

export class TruncInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "trunc r3 2.9",
				expected: [{ type: "register", register: 3, value: 2 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.trunc(a);
	}
}

export class CeilInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "ceil r4 2.1",
				expected: [{ type: "register", register: 4, value: 3 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.ceil(a);
	}
}

export class FloorInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "floor r5 2.9",
				expected: [{ type: "register", register: 5, value: 2 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.floor(a);
	}
}

export class MaxInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "max r6 5 10",
				expected: [{ type: "register", register: 6, value: 10 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return Math.max(a, b);
	}
}

export class MinInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "min r7 5 10",
				expected: [{ type: "register", register: 7, value: 5 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return Math.min(a, b);
	}
}

export class LogInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "log r8 1",
				expected: [{ type: "register", register: 8, value: 0 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.log(a);
	}
}

export class ExpInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "exp r9 1",
				expected: [{ type: "register", register: 9, value: Math.exp(1) }],
			},
		];
	}

	public operation(a: number): number {
		return Math.exp(a);
	}
}

export class SinInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "sin r10 0",
				expected: [{ type: "register", register: 10, value: 0 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.sin(a);
	}
}

export class AsinInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "asin r11 0",
				expected: [{ type: "register", register: 11, value: 0 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.asin(a);
	}
}

export class TanInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "tan r12 0",
				expected: [{ type: "register", register: 12, value: 0 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.tan(a);
	}
}

export class AtanInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "atan r1 0",
				expected: [{ type: "register", register: 1, value: 0 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.atan(a);
	}
}

export class CosInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "cos r1 0",
				expected: [{ type: "register", register: 1, value: 1 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.cos(a);
	}
}

export class AcosInstruction extends UnaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "acos r1 1",
				expected: [{ type: "register", register: 1, value: 0 }],
			},
		];
	}

	public operation(a: number): number {
		return Math.acos(a);
	}
}

export class Atan2Instruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "atan2 r1 0 1",
				expected: [{ type: "register", register: 1, value: 0 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return Math.atan2(a, b);
	}
}

export class RandInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.registerLink()];
	}

	override run(): void {
		const r = this.getArgumentValue<number>(0);
		this.context.setRegister(r, Math.random());
	}
}
export class SllInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "sll r1 5 1", // 5 = 0b101, shifted left by 1 = 0b1010 = 10
				expected: [{ type: "register", register: 1, value: 10 }],
			},
			{
				code: "sll r2 1 3", // 1 << 3 = 8
				expected: [{ type: "register", register: 2, value: 8 }],
			},
			{
				code: "sll r3 -1 1", // -1 << 1 = -2 (in signed 32-bit)
				expected: [{ type: "register", register: 3, value: -2 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		const result = icMath.sll(a, b);
		if (result === null) {
			throw new Error("SLL operation resulted in null");
		}
		return result;
	}
}

export class SlaInstruction extends SllInstruction {}

export class SrlInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "srl r1 8 1", // 8 = 0b1000, shifted right logically by 1 = 0b100 = 4
				expected: [{ type: "register", register: 1, value: 4 }],
			},
			{
				code: "srl r2 15 2", // 15 = 0b1111, shifted right by 2 = 0b11 = 3
				expected: [{ type: "register", register: 2, value: 3 }],
			},
			{
				code: "srl r3 -1 1", // -1 (0xFFFFFFFF) >>> 1 = 0x7FFFFFFF = 2147483647
				expected: [{ type: "register", register: 3, value: 0x1fffffffffffff }],
			},
		];
	}

	public operation(a: number, b: number): number {
		const result = icMath.srl(a, b);
		if (result === null) {
			throw new Error("SRL operation resulted in null");
		}
		return result;
	}
}

export class SraInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "sra r1 8 1", // 8 = 0b1000, shifted right arithmetically by 1 = 0b100 = 4
				expected: [{ type: "register", register: 1, value: 4 }],
			},
			{
				code: "sra r2 -8 1", // -8 >> 1 = -4 (sign bit preserved)
				expected: [{ type: "register", register: 2, value: -4 }],
			},
			{
				code: "sra r3 -1 1", // -1 >> 1 = -1 (sign bit preserved)
				expected: [{ type: "register", register: 3, value: -1 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		const result = icMath.sra(a, b);
		if (result === null) {
			throw new Error("SRA operation resulted in null");
		}
		return result;
	}
}

// Update existing bitwise instructions to handle null return values

export class AndInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "and r1 5 3", // 5 = 0b101, 3 = 0b011 → 0b001 = 1
				expected: [{ type: "register", register: 1, value: 1 }],
			},
			{
				code: "and r2 15 9", // 15 = 0b1111, 9 = 0b1001 → 0b1001 = 9
				expected: [{ type: "register", register: 2, value: 9 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		const result = icMath.and(a, b);
		if (result === null) {
			throw new Error("AND operation resulted in null");
		}
		return result;
	}
}

export class OrInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "or r1 5 3", // 5 = 0b101, 3 = 0b011 → 0b111 = 7
				expected: [{ type: "register", register: 1, value: 7 }],
			},
			{
				code: "or r2 8 1", // 8 = 0b1000, 1 = 0b0001 → 0b1001 = 9
				expected: [{ type: "register", register: 2, value: 9 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		const result = icMath.or(a, b);
		if (result === null) {
			throw new Error("OR operation resulted in null");
		}
		return result;
	}
}

export class XorInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "xor r1 5 3", // 5 = 0b101, 3 = 0b011 → 0b110 = 6
				expected: [{ type: "register", register: 1, value: 6 }],
			},
			{
				code: "xor r2 15 15", // 15 XOR 15 = 0
				expected: [{ type: "register", register: 2, value: 0 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		const result = icMath.xor(a, b);
		if (result === null) {
			throw new Error("XOR operation resulted in null");
		}
		return result;
	}
}

export class NorInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "nor r1 5 3", // 5 = 0b101, 3 = 0b011 → OR = 0b111 → NOT = ...1111111111111000 (in 32-bit) → -8 in JS
				expected: [{ type: "register", register: 1, value: ~(5 | 3) }],
			},
			{
				code: "nor r2 0 0", // OR = 0, NOT = -1 (all bits set in 32-bit signed)
				expected: [{ type: "register", register: 2, value: -1 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		const result = icMath.nor(a, b);
		if (result === null) {
			throw new Error("NOR operation resulted in null");
		}
		return result;
	}
}
export class PowInstruction extends BinaryMathInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "pow r1 2 3",
				expected: [{ type: "register", register: 1, value: 8 }],
			},
			{
				code: "pow r2 4 0.5",
				expected: [{ type: "register", register: 2, value: 2 }],
			},
			{
				code: "pow r3 5 -1",
				expected: [{ type: "register", register: 3, value: 0.2 }],
			},
		];
	}

	public operation(a: number, b: number): number {
		return a ** b;
	}
}
// TODO: протестировать в игре

export class ExtInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("source"),
			ArgumentCalculators.anyNumber("start"),
			ArgumentCalculators.anyNumber("length"),
		];
	}

	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const source = this.getArgumentValue<number>("source");
		const start = this.getArgumentValue<number>("start");
		const length = this.getArgumentValue<number>("length");

		const result = icMath.ext(source, start, length);
		this.context.setRegister(r, result);
	}
}

export class InsInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("payload"),
			ArgumentCalculators.anyNumber("start"),
			ArgumentCalculators.anyNumber("length"),
		];
	}

	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const payload = this.getArgumentValue<number>("payload");
		const start = this.getArgumentValue<number>("start");
		const length = this.getArgumentValue<number>("length");

		const result = icMath.ins(r, payload, start, length);
		this.context.setRegister(r, result);
	}
}

export class LerpInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("start"),
			ArgumentCalculators.anyNumber("end"),
			ArgumentCalculators.anyNumber("ratio"),
		];
	}

	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const start = this.getArgumentValue<number>("start");
		const end = this.getArgumentValue<number>("end");
		let ratio = this.getArgumentValue<number>("ratio");

		// Clamp ratio between 0 and 1
		ratio = Math.max(0, Math.min(1, ratio));

		// Linear interpolation: start + ratio * (end - start)
		const result = start + ratio * (end - start);

		this.context.setRegister(r, result);
	}

	static override tests(): InstructionTestData[] {
		return [
			{
				code: "lerp r1 0 10 0.5",
				expected: [{ type: "register", register: 1, value: 5 }],
			},
			{
				code: "lerp r2 10 20 0.25",
				expected: [{ type: "register", register: 2, value: 12.5 }],
			},
			{
				code: "lerp r3 100 200 2.0", // ratio clamped to 1
				expected: [{ type: "register", register: 3, value: 200 }],
			},
			{
				code: "lerp r4 50 100 -1.0", // ratio clamped to 0
				expected: [{ type: "register", register: 4, value: 50 }],
			},
		];
	}
}
