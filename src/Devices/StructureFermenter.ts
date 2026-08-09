/* Auto-generated. Do not edit. */
import { Housing, type SocketDeviceConstructor } from "@/Core/Housing";
export class StructureFermenter extends Housing {
	constructor({ ...args }: Omit<SocketDeviceConstructor, "hash" | "pin_count">) {
		super({ ...args, pin_count: 0, hash: 1103525139 });
	}
}
