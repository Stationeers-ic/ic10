import { ErrorSeverity, FatalIc10Error } from "@/Ic10/Errors/Errors";
import { type InstructionName, instructions, isInstructionName } from "@/Ic10/Instruction";
import type { Argument } from "@/Ic10/Instruction/Helpers/Argument";
import type { Instruction } from "@/Ic10/Instruction/Helpers/Instruction";
import { CommentLine, type CommentLineConstructorType } from "@/Ic10/Lines/CommentLine";

export type InstructionLineConstructorType = {
	instruction: keyof typeof instructions | string;
	args: Argument[];
} & CommentLineConstructorType;

export class InstructionLine extends CommentLine {
	public instructionName?: InstructionName;
	public args: Argument[];
	public instruction?: Instruction;

	constructor({ contextSwitcher, position, comment, originalText, instruction, args }: InstructionLineConstructorType) {
		super({ contextSwitcher, position, comment, originalText });
		this.args = args;
		if (!isInstructionName(instruction)) {
			this.context.addError(
				new FatalIc10Error({
					message: `Unknown instruction: ${instruction}`,
					severity: ErrorSeverity.Strong,
				}).setLine(this),
			);
		} else {
			this.instructionName = instruction;
		}
		this.prepare();
	}

	override run(): void | Promise<void> {
		return this.instruction?.execute();
	}

	override end(): void {
		if (!this.instruction?.end.call(this)) {
			if (this.position === this.context.getNextLineIndex()) {
				this.context.setNextLineIndex();
			}
		}
	}

	private prepare() {
		if (this.instructionName) {
			const _instruction = instructions[this.instructionName];
			if (_instruction) {
				this.instruction = new _instruction({
					line: this,
					context: this.context,
					args: this.args,
				});
			}
		}
	}
}
