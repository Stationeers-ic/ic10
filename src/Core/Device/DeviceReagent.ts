import { DeviceScope } from "@/Core/Device/DeviceScope";
import { Reagents } from "@/Defines/data";

export type ReagentIterator = {
	hash: number;
	name: string;
	count: number;
};

export class DeviceReagent extends DeviceScope {
	#reagents: Map<number, number> = new Map();

	public get(reagentHash: number): number {
		if (this.#reagents.has(reagentHash)) {
			return this.#reagents.get(reagentHash)!;
		} else {
			return 0;
		}
	}

	public set(reagentHash: number, count: number): void {
		if (count > 0) {
			this.#reagents.set(reagentHash, count);
		} else {
			this.#reagents.delete(reagentHash);
		}
	}

	public reset(): void {
		this.#reagents.clear();
	}
	public getReagents(): Map<number, number> {
		return { ...this.#reagents };
	}

	[Symbol.iterator](): IterableIterator<ReagentIterator> {
		const result: ReagentIterator[] = [];
		for (const [hash, count] of this.#reagents) {
			if (Reagents.hasKey(hash)) {
				const name = Reagents.getByKey(hash) ?? "";
				result.push({ hash, count, name });
			}
		}
		return result[Symbol.iterator]();
	}
}
