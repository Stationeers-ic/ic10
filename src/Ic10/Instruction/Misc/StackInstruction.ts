// PopInstruction.ts
import { ArgumentCalculators } from "@/Ic10/Instruction/Helpers/ArgumentCalculators";
import {
	Instruction,
	type InstructionArgument,
	type InstructionTestData,
} from "@/Ic10/Instruction/Helpers/Instruction";
export class PushInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["push 10", "peek r0"],
				expected: [{ type: "register", register: 0, value: 10 }],
			},
			{
				title: "multiple values",
				code: ["push 20", "push 30", "peek r0", "peek r1"],
				expected: [
					{ type: "register", register: 0, value: 30 },
					{ type: "register", register: 1, value: 30 },
				],
			},
			{
				title: "from register",
				code: ["move r2 42", "push r2", "peek r3"],
				expected: [{ type: "register", register: 3, value: 42 }],
			},
			{
				title: "negative value",
				code: ["push -5", "peek r0"],
				expected: [{ type: "register", register: 0, value: -5 }],
			},
			{
				title: "zero value",
				code: ["push 0", "peek r0"],
				expected: [{ type: "register", register: 0, value: 0 }],
			},
			{
				title: "SP 1",
				code: ["push 0", "push 0", "push 0"],
				expected: [{ type: "register", register: 16, value: 3 }],
			},
			{
				title: "SP 2",
				code: ["push 0", "push 0", "push 0", "pop r1"],
				expected: [{ type: "register", register: 16, value: 2 }],
			},
		];
	}

	public argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.anyNumber("value")];
	}

	public run(): void | Promise<void> {
		const value = this.getArgumentValue("value");
		this.context.push(value);
	}
}
export class PopInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: "push 10\npop r0",
				expected: [{ type: "register", register: 0, value: 10 }],
			},
			{
				title: "multiple values",
				code: "push 20\npush 30\npop r1\npop r2",
				expected: [
					{ type: "register", register: 1, value: 30 },
					{ type: "register", register: 2, value: 20 },
				],
			},
			{
				title: "empty stack",
				code: "pop r0",
				expected: [{ type: "register", register: 0, value: 0 }],
			},
			{
				title: "from register",
				code: "move r3 42\npush r3\npop r4",
				expected: [{ type: "register", register: 4, value: 42 }],
			},
		];
	}

	public argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.registerLink("register")];
	}

	public run(): void | Promise<void> {
		const register = this.getArgumentValue("register");
		const value = this.context.pop();
		this.context.setRegister(register, value);
	}
}

export class PeekInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: "push 10\npeek r0",
				expected: [{ type: "register", register: 0, value: 10 }],
			},
			{
				title: "stack unchanged",
				code: "push 20\npeek r0\npeek r1",
				expected: [
					{ type: "register", register: 0, value: 20 },
					{ type: "register", register: 1, value: 20 },
				],
			},
			{
				title: "empty stack",
				code: "peek r0",
				expected: [{ type: "register", register: 0, value: 0 }],
			},
			{
				title: "after pop",
				code: "push 30\npush 40\npop r0\npeek r1",
				expected: [
					{ type: "register", register: 0, value: 40 },
					{ type: "register", register: 1, value: 30 },
				],
			},
			{
				title: "multiple values",
				code: "push 50\npush 60\npeek r0\npop r1\npeek r2",
				expected: [
					{ type: "register", register: 0, value: 60 },
					{ type: "register", register: 1, value: 60 },
					{ type: "register", register: 2, value: 50 },
				],
			},
		];
	}

	public argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.registerLink("register")];
	}

	public run(): void | Promise<void> {
		const register = this.getArgumentValue("register");
		const value = this.context.peek();
		this.context.setRegister(register, value);
	}
}

export class PokeInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["push 99", "poke 0 50"],
				expected: [{ type: "stack", index: 0, value: 50 }],
			},
		];
	}

	public run(): void | Promise<void> {
		const address = this.getArgumentValue<number>("address");
		const value = this.getArgumentValue<number>("value");
		this.context.stack().set(address, value);
	}

	public argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.anyNumber("address"), ArgumentCalculators.anyNumber("value")];
	}
}
