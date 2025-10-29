import {
	array,
	type InferOutput,
	type Literal,
	literal,
	minLength,
	minValue,
	number,
	object,
	optional,
	pipe,
	regex,
	strictObject,
	string,
	union,
} from "valibot";
import { GROUPED_CONSTS } from "@/Defines/consts";
import { type ItemName, Items, type ReagentName, Reagents } from "@/Defines/data";
import { DeviceClassesByBase, DevicesByPrefabName } from "@/Devices";

function picklist<T extends Literal>(values: T[]) {
	return union(values.map((value) => literal(value)));
}

// --- Вспомогательные функции для создания union из ключей ---

/**
 * Создает picklist из массива или итератора с удалением дубликатов
 */
function unionLiterals<T extends string>(items: IterableIterator<T> | T[]) {
	const uniqueItems = Array.from(new Set(items));
	return picklist(uniqueItems);
}

/**
 * Создает picklist из ключей объекта с опциональной фильтрацией
 */
function unionFromKeys<T extends Record<string, unknown>>(obj: T, filter?: (key: string) => boolean) {
	const keys = Object.keys(obj).filter(filter ?? (() => true));
	return picklist(keys);
}

// --- PrefabName Schemas ---

export const PrefabNameSchema = unionFromKeys(DevicesByPrefabName);

export const PrefabNameDeviceSchema = unionFromKeys(
	Object.assign(DeviceClassesByBase.Structure, DeviceClassesByBase.Item),
);

export const PrefabNameHousingSchema = unionFromKeys(DeviceClassesByBase.Housing);

// --- Props Schemas ---

export const PropsSchema = strictObject({
	name: unionFromKeys(GROUPED_CONSTS.LogicType, (key) => !key.startsWith("Channel")),
	value: number(),
});

export const ChannelPropsSchema = strictObject({
	name: unionFromKeys(GROUPED_CONSTS.LogicType, (key) => key.startsWith("Channel")),
	value: number(),
});

// --- Port Schema ---

const PORT_TYPES = [
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
];

export const PortSchema = strictObject({
	port: picklist(PORT_TYPES),
	network: pipe(string(), minLength(1)),
});

// --- Pin Schema ---

const PIN_SHORTCUTS = ["d0", "d2", "d3", "d4", "d5"];

export const PinSchema = strictObject({
	pin: pipe(union([picklist(PIN_SHORTCUTS), pipe(string(), regex(/^d\d+$/))])),
	device: pipe(number(), minValue(0)),
});

// --- Slot Schema ---

export const SlotSchema = strictObject({
	index: pipe(number(), minValue(0)),
	item: unionLiterals<ItemName>(Items.values()),
	amount: pipe(number(), minValue(1)),
});

// --- Reagent Schema ---

export const ReagentSchema = strictObject({
	name: unionLiterals<ReagentName>(Reagents.values()),
	amount: pipe(number(), minValue(1)),
});

// --- Register Schema ---

export const RegisterSchema = strictObject({
	name: pipe(string(), regex(/^r\d+$/)),
	value: number(),
});

// --- Chip Schema ---

export const ChipSchema = strictObject({
	id: pipe(number(), minValue(0)),
	register_length: optional(pipe(number(), minValue(0))),
	stack_length: optional(pipe(number(), minValue(0))),
	SP: optional(number()),
	RA: optional(number()),
	registers: optional(array(RegisterSchema)),
	stack: optional(array(number())),
	code: optional(string()),
	lineNumber: optional(pipe(number(), minValue(0))),
});

// --- Device Schemas ---

const BaseDeviceSchema = {
	id: pipe(number(), minValue(0)),
	name: optional(pipe(string(), minLength(1))),
	ports: optional(array(PortSchema)),
	props: optional(array(PropsSchema)),
	slots: optional(array(SlotSchema)),
	reagents: optional(array(ReagentSchema)),
};

export const HousingSchema = strictObject({
	...BaseDeviceSchema,
	PrefabName: PrefabNameHousingSchema,
	chip: optional(pipe(number(), minValue(0))),
	pins: optional(array(PinSchema)),
});

export const DeviceSchema = strictObject({
	...BaseDeviceSchema,
	PrefabName: PrefabNameDeviceSchema,
});

// --- Network Schemas ---

const NETWORK_TYPES = ["data", "power", "chute", "pipe", "wireless", "landing"];

export const NetworkTypeSchema = picklist(NETWORK_TYPES);

export const NetworkSchema = strictObject({
	id: pipe(string(), minLength(1)),
	type: NetworkTypeSchema,
	props: optional(array(ChannelPropsSchema)),
});

// --- Environment Schema ---
const semVerPattern =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const ProjectSchema = object({
	name: optional(pipe(string(), minLength(1))),
	author: optional(pipe(string(), minLength(1))),
	description: optional(pipe(string(), minLength(1))),
	version: optional(pipe(string(), regex(semVerPattern, "Must be SemVer eg: (1.0.0)"))),
	tags: optional(pipe(array(string()), minLength(1))),
});
export const EnvSchema = object({
	version: picklist([1]),
	project: optional(ProjectSchema),
	chips: array(ChipSchema),
	devices: array(union([DeviceSchema, HousingSchema])),
	networks: array(NetworkSchema),
});

// --- Exported Types ---

export type ProjectSchema = InferOutput<typeof ProjectSchema>;
export type EnvSchema = InferOutput<typeof EnvSchema>;
export type PortSchema = InferOutput<typeof PortSchema>;
export type PropsSchema = InferOutput<typeof PropsSchema>;
export type ChannelPropsSchema = InferOutput<typeof ChannelPropsSchema>;
export type SlotSchema = InferOutput<typeof SlotSchema>;
export type ReagentSchema = InferOutput<typeof ReagentSchema>;
export type RegisterSchema = InferOutput<typeof RegisterSchema>;
export type ChipSchema = InferOutput<typeof ChipSchema>;
export type DeviceSchema = InferOutput<typeof DeviceSchema>;
export type HousingSchema = InferOutput<typeof HousingSchema>;
export type NetworkSchema = InferOutput<typeof NetworkSchema>;
export type NetworkTypeSchema = InferOutput<typeof NetworkTypeSchema>;
export type PinSchema = InferOutput<typeof PinSchema>;
export type PrefabName = InferOutput<typeof PrefabNameSchema>;
