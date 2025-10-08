import type { Builer } from "@/Envierment/Builder";

export type ParserConstructorType = {
	builer: Builer;
};

export abstract class Parser {
	protected readonly builer: Builer;
	constructor({ builer }: ParserConstructorType) {
		this.builer = builer;
	}
}

export class ParserV1 extends Parser {}
