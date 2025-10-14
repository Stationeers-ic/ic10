import { GROUPED_CONSTS } from "@/Defines/consts";
import DEVICES from "@/Defines/devices";
import ITEMS from "@/Defines/items";
import REAGENTS from "@/Defines/reagents";
import { BiMap } from "@/helpers";

// Типы с readonly для большей точности
export type LogicConstType = typeof GROUPED_CONSTS.LogicType;
export type LogicSlotConstType = typeof GROUPED_CONSTS.LogicSlotType;
export type LogicBatchMethodType = typeof GROUPED_CONSTS.LogicBatchMethod;
export type LogicReagentModeType = typeof GROUPED_CONSTS.LogicReagentMode;

export const Logics = new BiMap<keyof LogicConstType, LogicConstType[keyof LogicConstType]>();
export const LogicSlot = new BiMap<keyof LogicSlotConstType, LogicSlotConstType[keyof LogicSlotConstType]>();
export const LogicReagentMode = new BiMap<
	keyof LogicReagentModeType,
	LogicReagentModeType[keyof LogicReagentModeType]
>();
export const LogicBatchMethod = new BiMap<
	keyof LogicBatchMethodType,
	LogicBatchMethodType[keyof LogicBatchMethodType]
>();

// Если хотите получить точные union types всех возможных значений
type ReagentHash = (typeof REAGENTS)[number] extends { hash: infer H } ? H : never;
type ReagentName = (typeof REAGENTS)[number]["name"];

type ItemHash = (typeof ITEMS)[number] extends { PrefabHash: infer H } ? H : never;
type ItemName = (typeof ITEMS)[number]["PrefabName"];

type DeviceHash = {
	[K in keyof typeof DEVICES]: (typeof DEVICES)[K] extends { PrefabHash: infer H } ? H : never;
}[keyof typeof DEVICES];

type DeviceName = (typeof DEVICES)[keyof typeof DEVICES]["PrefabName"];

// Использование
export const Reagents = new BiMap<ReagentHash, ReagentName>();
export const Devices = new BiMap<DeviceHash, DeviceName>();
export const Items = new BiMap<ItemHash, ItemName>();
REAGENTS.forEach((reagent) => {
	if (reagent.hash) {
		Reagents.set(reagent.hash, reagent.name);
	}
});
ITEMS.forEach((item) => {
	if (item.PrefabHash) {
		Items.set(item.PrefabHash, item.PrefabName);
	}
});
Object.entries(DEVICES).forEach(([_, device]) => {
	if (device.PrefabHash) {
		Devices.set(device.PrefabHash, device.PrefabName);
	}
});

// Типобезопасное заполнение
Object.entries(GROUPED_CONSTS.LogicType).forEach(([key, val]) => {
	Logics.set(key as keyof LogicConstType, val as LogicConstType[keyof LogicConstType]);
});

Object.entries(GROUPED_CONSTS.LogicSlotType).forEach(([key, val]) => {
	LogicSlot.set(key as keyof LogicSlotConstType, val as LogicSlotConstType[keyof LogicSlotConstType]);
});

Object.entries(GROUPED_CONSTS.LogicBatchMethod).forEach(([key, val]) => {
	LogicBatchMethod.set(key as keyof LogicBatchMethodType, val as LogicBatchMethodType[keyof LogicBatchMethodType]);
});
Object.entries(GROUPED_CONSTS.LogicReagentMode).forEach(([key, val]) => {
	LogicReagentMode.set(key as keyof LogicReagentModeType, val as LogicReagentModeType[keyof LogicReagentModeType]);
});

export default { Logics, LogicSlot, LogicReagentMode, LogicBatchMethod, Reagents };
