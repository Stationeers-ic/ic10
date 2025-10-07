import { GROUPED_CONSTS } from "@/Defines/consts";
import { BiMap } from "@/helpers";

// Типы с readonly для большей точности
export type LogicConstType = typeof GROUPED_CONSTS.LogicType;
export type LogicSlotConstType = typeof GROUPED_CONSTS.LogicSlotType;

export const Logics = new BiMap<keyof LogicConstType, LogicConstType[keyof LogicConstType]>();
export const LogicSlot = new BiMap<keyof LogicSlotConstType, LogicSlotConstType[keyof LogicSlotConstType]>();

// Типобезопасное заполнение
Object.entries(GROUPED_CONSTS.LogicType).forEach(([key, val]) => {
	Logics.set(key as keyof LogicConstType, val as LogicConstType[keyof LogicConstType]);
});

Object.entries(GROUPED_CONSTS.LogicSlotType).forEach(([key, val]) => {
	LogicSlot.set(key as keyof LogicSlotConstType, val as LogicSlotConstType[keyof LogicSlotConstType]);
});

export default { Logics, LogicSlot };
