import { array, type InferOutput, literal, number, object, optional, string, union } from "valibot";
import { GROUPED_CONSTS } from "@/Defines/consts";
import { DevicesByPrefabName } from "@/Devices";

// --- Вспомогательные функции для создания union из ключей ---
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
	port: string(),
	network: string(),
});

// --- Device ---
export const DeviceSchema = object({
	id: string(),
	PrefabName: PrefabNameSchema,
	code: optional(string()),
	ports: array(PortSchema),
	props: optional(array(PropsSchema)),
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
	version: number(),
	devices: array(DeviceSchema),
	networks: array(NetworkSchema),
});

// --- Тип вывода ---
export type EnvSchema = InferOutput<typeof EnvSchema>;
