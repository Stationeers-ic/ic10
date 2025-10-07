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
				code: "move r1 Color.Green",
				expected: [{ type: "register", register: 1, value: 2 }],
			},
			{
				title: "hash",
				code: `move r1 HASH("test")`,
				expected: [{ type: "register", register: 1, value: -662733300 }],
			},
			{
				title: "set label",
				code: "\nmove r0 label\n\nlabel:",
				expected: [{ type: "register", register: 0, value: 3 }],
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
