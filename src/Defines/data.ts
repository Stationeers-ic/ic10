import { GROUPED_CONSTS } from "@/Defines/consts";
import { BiMap } from "@/helpers";

// Типы с readonly для большей точности
export type LogicConstType = typeof GROUPED_CONSTS.LogicType;
export type LogicSlotConstType = typeof GROUPED_CONSTS.LogicSlotType;
export type LogicBatchMethodType = typeof GROUPED_CONSTS.LogicBatchMethod;

export const Logics = new BiMap<keyof LogicConstType, LogicConstType[keyof LogicConstType]>();
export const LogicSlot = new BiMap<keyof LogicSlotConstType, LogicSlotConstType[keyof LogicSlotConstType]>();
export const LogicBatchMethod = new BiMap<
	keyof LogicBatchMethodType,
	LogicBatchMethodType[keyof LogicBatchMethodType]
>();

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

export default { Logics, LogicSlot };
