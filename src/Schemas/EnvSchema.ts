import * as v from "valibot";

// Определяем схемы
export const PortSchema = v.object({
	port: v.string(),
	network: v.string(),
});

export const PropSchema = v.object({
	name: v.string(),
	value: v.string(),
});

export const DeviceSchema = v.object({
	id: v.string(),
	PrefabName: v.string(),
	ports: v.array(PortSchema),
	props: v.array(PropSchema),
});

// Перечисление сетей через union
export const NetworkTypeSchema = v.union([
	v.literal("data"),
	v.literal("power"),
	v.literal("chute"),
	v.literal("pipe"),
	v.literal("wireless"),
	v.literal("landing"),
]);

export const NetworkSchema = v.object({
	id: v.string(),
	type: NetworkTypeSchema,
});

export const EnvSchema = v.object({
	version: v.string(),
	devices: v.array(DeviceSchema),
	networks: v.array(NetworkSchema),
});
