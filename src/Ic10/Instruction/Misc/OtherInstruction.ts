import { Ic10Error } from "@/Ic10/Errors/Errors";
import { ArgumentCalculators } from "@/Ic10/Instruction/Helpers/ArgumentCalculators";
import { Instruction, type InstructionArgument } from "@/Ic10/Instruction/Helpers/Instruction";

export class SleepInstruction extends Instruction {
	public argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.anyNumber("second")];
	}
	public run(): void | Promise<void> {
		const second = this.getArgumentValue("second") * 1000;
		if (second > 0) {
			return this.context.sleep(second);
		}
	}
}
export class YieldInstruction extends Instruction {
	public argumentList(): InstructionArgument[] {
		return [];
	}
	public run(): void | Promise<void> {
		return this.context.yield();
	}
}

export class HcfInstruction extends Instruction {
	public argumentList(): InstructionArgument[] {
		return [];
	}
	public run(): void | Promise<void> {
		throw new Ic10Error({ message: "Hcf" });
	}
}
