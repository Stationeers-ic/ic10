import { array, type InferOutput, literal, number, object, optional, string, union } from "valibot";
import { GROUPED_CONSTS } from "@/Defines/consts";
import { type ItemName, Items, type ReagentName, Reagents } from "@/Defines/data";
import { DevicesByPrefabName } from "@/Devices";

// --- Вспомогательные функции для создания union из ключей ---
function unionLiterals<T extends string | number | symbol>(array: IterableIterator<T> | T[]) {
	const un: T[] = [];
	for (const k of array) {
		if (!un.includes(k)) {
			un.push(k);
		}
	}
	return union(un.map((k) => literal(k)));
}
function unionFromKeys<T extends Record<string, unknown>>(obj: T, filter?: (key: string) => boolean) {
	const keys = Object.keys(obj).filter(filter ?? (() => true));
	return union(keys.map((k) => literal(k)));
}

// --- PrefabName ---
export const PrefabNameSchema = unionFromKeys(DevicesByPrefabName);

// --- Props ---
export const PropsSchema = object({
	name: unionFromKeys(GROUPED_CONSTS.LogicType, (l) => !l.startsWith("Channel")),
	value: number(),
});

// --- ChannelProps ---
export const ChannelPropsSchema = object({
	name: unionFromKeys(GROUPED_CONSTS.LogicType, (l) => l.startsWith("Channel")),
	value: number(),
});

// --- Port ---
export const PortSchema = object({
	port: union([
		literal("default"),
		literal("Chute Input"),
		literal("Chute Output"),
		literal("Chute Output 2"),
		literal("Connection"),
		literal("Data Input"),
		literal("Data Output"),
		literal("Landing Pad Input"),
		literal("Pipe Input"),
		literal("Pipe Input 2"),
		literal("Pipe Liquid Input"),
		literal("Pipe Liquid Input 2"),
		literal("Pipe Liquid Output"),
		literal("Pipe Liquid Output 2"),
		literal("Pipe Output"),
		literal("Pipe Output 2"),
		literal("Pipe Waste"),
		literal("Power Input"),
		literal("Power Output"),
		literal("Power and Data Input"),
		literal("Power and Data Output"),
	]),
	network: string(),
});

// --- Slot ---
export const SlotSchema = object({
	index: number(),
	item: unionLiterals<ItemName>(Items.values()),
	amount: number(),
});

// --- Reagent ---
export const ReagentSchema = object({
	name: unionLiterals<ReagentName>(Reagents.values()),
	amount: number(),
});

// --- Register ---
export const RegisterSchema = object({
	name: string(),
	value: number(),
});

// --- Chip ---
export const ChipSchema = object({
	id: number(),
	register_length: number(),
	stack_length: number(),
	SP: number(),
	RA: number(),
	register: optional(array(RegisterSchema)),
	stack: optional(array(number())),
	code: optional(string()),
});

// --- Device ---
export const DeviceSchema = object({
	id: number(),
	PrefabName: PrefabNameSchema,
	name: optional(string()),
	chip: optional(number()),
	ports: optional(array(PortSchema)),
	props: optional(array(PropsSchema)),
	slots: optional(array(SlotSchema)),
	reagents: optional(array(ReagentSchema)),
});

// --- NetworkType ---
const networkTypes = ["data", "power", "chute", "pipe", "wireless", "landing"] as const;
export const NetworkTypeSchema = union(networkTypes.map(literal));

// --- Network ---
export const NetworkSchema = object({
	id: string(),
	type: NetworkTypeSchema,
	props: optional(array(ChannelPropsSchema)),
});

// --- Env ---
export const EnvSchema = object({
	version: union([literal(1)]),
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
