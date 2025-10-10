import { DeviceScope, type DeviceScopeConstructor } from "@/Core/Device/DeviceScope";
import { LogicSlot } from "@/Defines/data";
import type { SlotsType } from "@/Defines/devices";
import { BiMap } from "@/helpers";

export class ItemEntity {
	private _propertiesRaw: Map<number, number> = new Map();
	private _count: number = 0;
	constructor(
		public readonly hash: number,
		count: number = 1,
	) {
		this._count = count;
	}

	get count(): number {
		return this._count;
	}
	set count(value: number) {
		if (value >= 0) {
			this._count = value;
			this.setProp("Quantity", value);
		}
	}

	public setProp(prop: number | string, value: number): void {
		// Тройная проверка: распознаём по ключу, либо по значению
		let propCode: number | undefined;
		if (LogicSlot.hasKey(prop)) {
			const code = LogicSlot.getByKey(prop);
			if (typeof code === "number") propCode = code;
		} else if (LogicSlot.hasValue(prop)) {
			propCode = prop as number;
		}
		if (propCode !== undefined) {
			this._propertiesRaw.set(propCode, value);
		}
		// иначе игнорируем неизвестную пропертy (или можно выбросить исключение)
	}

	public getProp(prop: number | string): number {
		let propCode: number | undefined;
		if (LogicSlot.hasKey(prop)) {
			const code = LogicSlot.getByKey(prop);
			if (typeof code === "number") propCode = code;
		} else if (LogicSlot.hasValue(prop)) {
			propCode = prop as number;
		}
		if (propCode !== undefined) {
			return this._propertiesRaw.get(propCode) ?? 0;
		}
		return 0;
	}
}

export class Slot {
	private ITEM: ItemEntity | null = null;
	private logicNameToCode = new BiMap<string, number>();

	constructor(public slot: SlotsType[number]) {
		// Заполняем двунаправленный мэппинг только валидные коды
		slot.logic.forEach((l) => {
			if (LogicSlot.hasKey(l)) {
				const c = LogicSlot.getByKey(l);
				if (typeof c === "number") {
					this.logicNameToCode.set(l, c);
				}
			}
		});
	}

	public getProp(prop: number | string): number {
		if (this.ITEM === null) {
			return 0;
		}
		let propCode: number | undefined;
		// Ищем по ключу/значению в BiMap
		if (this.logicNameToCode.hasKey(prop as string)) {
			propCode = this.logicNameToCode.getByKey(prop as string);
		} else if (this.logicNameToCode.hasValue(prop as number)) {
			propCode = prop as number;
		}
		if (propCode !== undefined) {
			return this.ITEM.getProp(propCode);
		}
		return 0;
	}

	public moveItem(newSlot: Slot): void {
		if (this.ITEM !== null) {
			newSlot.putItem(this.ITEM);
			this.removeItem();
		}
	}

	public putItem(item: ItemEntity): void {
		if (this.ITEM !== null) {
			throw new Error("Slot is not empty");
		}
		this.ITEM = item;
	}

	public addItem(count: number = 1): void {
		if (this.ITEM === null) {
			throw new Error("Cannot add item: slot is empty");
		}
		this.ITEM.count += count;
	}

	public removeItem(count: number = -1): void {
		if (this.ITEM === null) {
			return;
		}
		if (count < 0) {
			// Удаляем всё содержание слота
			this.ITEM = null;
			return;
		}
		this.ITEM.count -= count;
		if (this.ITEM.count <= 0) {
			this.ITEM = null;
		}
	}

	public hasItem(): boolean {
		return this.ITEM !== null;
	}

	public getItem(): ItemEntity | null {
		return this.ITEM ?? null;
	}
}

export class DeviceSlots extends DeviceScope {
	private slots: Map<number, Slot> = new Map();

	constructor({ device }: DeviceScopeConstructor) {
		super({ device });
		device?.rawData?.slots?.forEach((slot) => {
			if (slot) {
				this.slots.set(slot.SlotIndex, new Slot(slot));
			}
		});
	}

	public hasSlot(slotIndex: number): boolean {
		return this.slots.has(slotIndex);
	}

	public getSlot(slotIndex: number): Slot | undefined {
		return this.slots.get(slotIndex);
	}
}
