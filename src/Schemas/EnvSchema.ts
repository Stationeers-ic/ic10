import { array, type InferOutput, literal, number, object, optional, string, union } from "valibot";
import { GROUPED_CONSTS } from "@/Defines/consts";
import { DevicesByPrefabName } from "@/Devices";

export const PrefabNameSchema = union(Object.keys(DevicesByPrefabName).map((l) => literal(l)));

export const PropsSchema = object({
	name: union(
		Object.keys(GROUPED_CONSTS.LogicType)
			.filter((l) => !l.startsWith("Channel"))
			.map((l) => literal(l)),
	),
	value: number(),
});

export const ChannelPropsSchema = object({
	name: union(
		Object.keys(GROUPED_CONSTS.LogicType)
			.filter((l) => l.startsWith("Channel"))
			.map((l) => literal(l)),
	),
	value: number(),
});

// Определяем схемы
export const PortSchema = object({
	port: string(),
	network: string(),
});

export const DeviceSchema = object({
	id: string(),
	PrefabName: PrefabNameSchema,
	code: optional(string()),
	ports: array(PortSchema),
	props: optional(array(PropsSchema)),
});

// Перечисление сетей через union
export const NetworkTypeSchema = union([
	literal("data"),
	literal("power"),
	literal("chute"),
	literal("pipe"),
	literal("wireless"),
	literal("landing"),
]);

export const NetworkSchema = object({
	id: string(),
	type: NetworkTypeSchema,
	props: optional(array(ChannelPropsSchema)),
});

export const EnvSchema = object({
	version: number(),
	devices: array(DeviceSchema),
	networks: array(NetworkSchema),
});

export type EnvSchema = InferOutput<typeof EnvSchema>;
