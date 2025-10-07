/* Auto-generated. Do not edit. */
import { Housing, type SocketDeviceConstructor } from "@/Core/Housing";
export class StructureCircuitHousing extends Housing {
	constructor({ ...args }: Omit<SocketDeviceConstructor, "hash" | "pin_count">) {
		super({ ...args, pin_count: 6, hash: -128473777 });
	}
}
