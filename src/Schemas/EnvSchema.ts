import {
	array,
	type InferOutput,
	number,
	object,
	optional,
	picklist,
	pipe,
	regex,
	strictObject,
	string,
	union,
} from "valibot";
import { GROUPED_CONSTS } from "@/Defines/consts";
import { type ItemName, Items, type ReagentName, Reagents } from "@/Defines/data";
import { DevicesByPrefabName } from "@/Devices";

// --- Вспомогательные функции для создания union из ключей ---
function unionLiterals<T extends string>(array: IterableIterator<T> | T[]) {
	const un: T[] = [];
	for (const k of array) {
		if (!un.includes(k)) {
			un.push(k);
		}
	}
	return picklist(un);
}
function unionFromKeys<T extends Record<string, unknown>>(obj: T, filter?: (key: string) => boolean) {
	const keys = Object.keys(obj).filter(filter ?? (() => true));
	return picklist(keys);
}

// --- PrefabName ---
export const PrefabNameSchema = unionFromKeys(DevicesByPrefabName);

// --- Props ---
export const PropsSchema = strictObject({
	name: unionFromKeys(GROUPED_CONSTS.LogicType, (l) => !l.startsWith("Channel")),
	value: number(),
});

// --- ChannelProps ---
export const ChannelPropsSchema = strictObject({
	name: unionFromKeys(GROUPED_CONSTS.LogicType, (l) => l.startsWith("Channel")),
	value: number(),
});

// --- Port ---
export const PortSchema = object({
	port: picklist([
		"default",
		"Chute Input",
		"Chute Output",
		"Chute Output 2",
		"Connection",
		"Data Input",
		"Data Output",
		"Landing Pad Input",
		"Pipe Input",
		"Pipe Input 2",
		"Pipe Liquid Input",
		"Pipe Liquid Input 2",
		"Pipe Liquid Output",
		"Pipe Liquid Output 2",
		"Pipe Output",
		"Pipe Output 2",
		"Pipe Waste",
		"Power Input",
		"Power Output",
		"Power and Data Input",
		"Power and Data Output",
	]),
	network: string(),
});
export const PinSchema = strictObject({
	pin: pipe(union([string(), picklist(["d0", "d2", "d3", "d4", "d5"])]), regex(/^d\d+$/)),
	device: number(),
});

// --- Slot ---
export const SlotSchema = strictObject({
	index: number(),
	item: unionLiterals<ItemName>(Items.values()),
	amount: number(),
});

// --- Reagent ---
export const ReagentSchema = strictObject({
	name: unionLiterals<ReagentName>(Reagents.values()),
	amount: number(),
});

// --- Register ---
export const RegisterSchema = strictObject({
	name: pipe(string(), regex(/^r\d+$/)),
	value: number(),
});

// --- Chip ---
export const ChipSchema = object({
	id: number(),
	register_length: optional(number()),
	stack_length: optional(number()),
	SP: optional(number()),
	RA: optional(number()),
	registers: optional(array(RegisterSchema)),
	stack: optional(array(number())),
	code: optional(string()),
	lineNumber: optional(number()),
});

// --- Device ---
export const DeviceSchema = object({
	id: number(),
	PrefabName: PrefabNameSchema,
	name: optional(string()),
	chip: optional(number()),
	ports: optional(array(PortSchema)),
	pins: optional(array(PinSchema)),
	props: optional(array(PropsSchema)),
	slots: optional(array(SlotSchema)),
	reagents: optional(array(ReagentSchema)),
});

// --- NetworkType ---
const networkTypes = ["data", "power", "chute", "pipe", "wireless", "landing"] as const;
export const NetworkTypeSchema = picklist(networkTypes);

// --- Network ---
export const NetworkSchema = strictObject({
	id: string(),
	type: NetworkTypeSchema,
	props: optional(array(ChannelPropsSchema)),
});

// --- Env ---
export const EnvSchema = object({
	version: picklist([1]),
	chips: array(ChipSchema),
	devices: array(DeviceSchema),
	networks: array(NetworkSchema),
});

// --- Тип вывода ---
export type EnvSchema = InferOutput<typeof EnvSchema>;
export type PortSchema = InferOutput<typeof PortSchema>;
export type PropsSchema = InferOutput<typeof PropsSchema>;
export type SlotSchema = InferOutput<typeof SlotSchema>;
export type ReagentSchema = InferOutput<typeof ReagentSchema>;
export type RegisterSchema = InferOutput<typeof RegisterSchema>;
export type ChipSchema = InferOutput<typeof ChipSchema>;
export type DeviceSchema = InferOutput<typeof DeviceSchema>;
export type NetworkSchema = InferOutput<typeof NetworkSchema>;
