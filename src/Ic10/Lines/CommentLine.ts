import { Line, type LineConstructorType } from "@/Ic10/Lines/Line";

export type CommentLineConstructorType = LineConstructorType;

export class CommentLine extends Line {
	override run(): void | Promise<void> {}

	override end(): void {
		this.context.setNextLineIndex();
	}
}
