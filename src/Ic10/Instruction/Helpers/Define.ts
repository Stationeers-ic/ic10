export class Define {
	public readonly type: "define" | "const" | "alias" | "label";
	private readonly _value: string | number;

	constructor(type: "define" | "alias" | "label" | "const", value: string | number) {
		this.type = type;
		this._value = value;
	}

	public get value() {
		return this._value?.toString();
	}
}
