import { Line, type LineConstructorType } from "@/Ic10/Lines/Line";

export class EmptyLine extends Line {
	constructor({ contextSwitcher, position, originalText = "" }: LineConstructorType) {
		super({ contextSwitcher, position, originalText });
	}

	override run(): void {}

	override end(): void {
		this.context.setNextLineIndex();
	}
}
