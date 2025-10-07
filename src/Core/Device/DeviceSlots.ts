import { DeviceScope, type DeviceScopeConstructor } from "@/Core/Device/DeviceScope";
import type { SlotsType } from "@/Defines/devices";

export class Slot {
	constructor(public slot: SlotsType[keyof SlotsType]) {}
}

export class DeviceSlots extends DeviceScope {
	private slots: Map<number, Slot> = new Map();

	constructor({ device }: DeviceScopeConstructor) {
		super({ device });
		device?.rawData?.slots?.forEach((slot, index) => {
			if (slot) {
				this.slots.set(slot.SlotIndex, new Slot(slot));
			}
		});
	}

	getSlot(slotIndex: number): Slot | undefined {
		if (this.slots.has(slotIndex)) {
			return this.slots.get(slotIndex);
		}
	}
}
