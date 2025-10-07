import { Stack, type StackInterface } from "@/Core/Stack";
import CONSTS from "@/Defines/consts";
import { Define } from "@/Ic10/Instruction/Helpers/Define";

export type ChipConstructorType = {
	ic10Code?: string;
	register_length?: number;
	stack_length?: number;
	SP?: number;
	RA?: number;
};

export class Chip {
	public registers: Map<number, number> = new Map();
	public readonly memory: StackInterface;
	public defines: Map<string, Define> = new Map();
	private ic10Code: string;
	private readonly register_length: number;
	private readonly SP: number;
	private readonly RA: number;

	constructor({ ic10Code = "", register_length = 18, stack_length = 512, SP = 16, RA = 17 }: ChipConstructorType) {
		this.ic10Code = ic10Code ?? "";
		this.register_length = register_length ?? 18;
		this.SP = SP ?? 16;
		this.RA = RA ?? 17;
		this.memory = new Stack(stack_length);
		this.reset();
	}

	reset() {
		this.memory.reset();
		this.defines = new Map();
		this.registers = new Map<number, number>();
		for (let i = 0; i < this.register_length; i++) {
			this.registers.set(i, 0);
		}
		Object.entries(CONSTS).forEach(([key, val]) => {
			this.defines.set(key, new Define("const", val));
		});
		this.defines.set("SP", new Define("alias", this.SP));
		this.defines.set("RA", new Define("alias", this.RA));
	}

	getIc10Code() {
		return this.ic10Code;
	}

	setIc10Code(ic10Code: string) {
		this.ic10Code = ic10Code;
		return this;
	}
}
