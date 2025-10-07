import { DeviceScope } from "@/Core/Device/DeviceScope";

export class DeviceReagent extends DeviceScope {
	#reagents: Map<number, number> = new Map();

	public get(reagentHash): number {
		if (this.#reagents.has(reagentHash)) {
			return this.#reagents.get(reagentHash);
		} else {
			return 0;
		}
	}

	public set(reagentHash, count): void {
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
}
