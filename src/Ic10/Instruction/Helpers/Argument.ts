export type ArgumentConstructorType = {
	start: number;
	length: number;
	text: string;
};

export class Argument {
	public readonly start: number;
	public readonly length: number;
	public text: string;
	public value?: number;

	constructor({ start, length, text }: ArgumentConstructorType) {
		this.start = start;
		this.length = length;
		this.text = text;
	}
}
