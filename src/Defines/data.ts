import { GROUPED_CONSTS } from "@/Defines/consts";
import DEVICES from "@/Defines/devices";
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

export const Reagents = new BiMap<number, string>();
export const Devices = new BiMap<number, string>();
REAGENTS.forEach((reagent) => {
	if (reagent.hash) {
		Reagents.set(reagent.hash, reagent.name);
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
