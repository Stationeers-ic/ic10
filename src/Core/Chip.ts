import { ItemEntity } from "@/Core/Device/DeviceSlots";
import { Stack, type StackInterface } from "@/Core/Stack";
import CONSTS from "@/Defines/consts";
import { Define } from "@/Ic10/Instruction/Helpers/Define";

export type ChipConstructorType = {
	id: number;
	chipHash?: number;
	ic10Code?: string;
	register_length?: number;
	stack_length?: number;
	SP?: number;
	RA?: number;
};

export class Chip extends ItemEntity {
	public registers: Map<number, number> = new Map();
	public readonly id: number;
	public readonly memory: StackInterface;
	public defines: Map<string, Define> = new Map();
	private ic10Code: string;
	private readonly register_length: number;
	private readonly SP: number;
	private readonly RA: number;

	constructor({
		id,
		chipHash,
		ic10Code = "",
		register_length = 18,
		stack_length = 512,
		SP = 16,
		RA = 17,
	}: ChipConstructorType) {
		super(chipHash ?? -744098481, 1);
		this.id = id;
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
