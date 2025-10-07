import { Line, type LineConstructorType } from "@/Ic10/Lines/Line";

export type CommentLineConstructorType = {
	comment?: string;
} & LineConstructorType;

export class CommentLine extends Line {
	public readonly comment: string;

	constructor({ contextSwitcher, position, comment, originalText }: CommentLineConstructorType) {
		super({ contextSwitcher, position, originalText });
		this.comment = comment || "";
	}

	override run(): void | Promise<void> {}

	override end(): void {
		this.context.setNextLineIndex();
	}
}
