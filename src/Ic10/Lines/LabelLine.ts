import { ErrorSeverity, ReferenceIc10Error } from "@/Ic10/Errors/Errors";
import { Define } from "@/Ic10/Instruction/Helpers/Define";
import { CommentLine, type CommentLineConstructorType } from "@/Ic10/Lines/CommentLine";

export type LabelLineConstructorType = {
	label: string;
} & CommentLineConstructorType;

export class LabelLine extends CommentLine {
	public readonly label: string;

	constructor({ contextSwitcher, position, comment, label, originalText }: LabelLineConstructorType) {
		super({ contextSwitcher, position, comment, originalText });
		this.label = label;
	}

	override run(): void {
		if (this.context.hasDefines(this.label)) {
			const old = this.context.getDefines(this.label)!;
			this.context.addError(
				new ReferenceIc10Error({
					message: `Label ${this.label} is already defined`,
					severity: old.type === "const" ? ErrorSeverity.Warning : ErrorSeverity.Strong,
				}).setLine(this),
			);
		}
		this.context.setDefines(this.label, new Define("label", this.position));
	}

	override end(): void {
		this.context.setNextLineIndex();
	}
}
