import { ArgumentCalculators } from "@/Ic10/Instruction/Helpers/ArgumentCalculators";
import {
	Instruction,
	type InstructionArgument,
	type InstructionTestData,
} from "@/Ic10/Instruction/Helpers/Instruction";

export class MoveInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "move r1 10",
				expected: [{ type: "register", register: 1, value: 10 }],
			},
			{
				title: "const",
				code: "move r2 Color.Green",
				expected: [{ type: "register", register: 2, value: 2 }],
			},
			{
				title: "hash",
				code: `move r3 HASH("test")`,
				expected: [{ type: "register", register: 3, value: -662733300 }],
			},
			{
				title: "set label",
				code: "\nmove r4 label\n\nlabel:",
				expected: [{ type: "register", register: 4, value: 3 }],
			},
			{
				title: "set hex",
				code: "move r5 $f",
				expected: [{ type: "register", register: 5, value: 15 }],
			},
			{
				title: "set bin",
				code: "move r5 %101",
				expected: [{ type: "register", register: 5, value: 5 }],
			},
		];
	}

	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.registerLink(), ArgumentCalculators.anyNumber()];
	}

	override run(): void {
		const r = this.getArgumentValue<number>(0);
		const v = this.getArgumentValue<number>(1);
		this.context.setRegister(r, v);
	}
}
