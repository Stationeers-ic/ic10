import * as v from "valibot";
import { Chip } from "@/Core/Chip";
import type { Device } from "@/Core/Device";
import { ItemEntity } from "@/Core/Device/DeviceSlots";
import { Housing } from "@/Core/Housing";
import { Network } from "@/Core/Network";
import { type ItemHash, type ItemName, Items, Logics, Reagents } from "@/Defines/data";
import { DeviceClassesByBase, DevicesByPrefabName } from "@/Devices";
import type { Builer } from "@/Envierment/Builder";
import { Ic10Runner } from "@/Ic10/Ic10Runner";
import i18n from "@/Languages/lang";
import {
	type ChipSchema,
	type DeviceSchema,
	EnvSchema,
	type HousingSchema,
	type NetworkSchema,
	type PortSchema,
	type PropsSchema,
	type ReagentSchema,
	type RegisterSchema,
	type SlotSchema,
} from "@/Schemas/EnvSchema";

/**
 * Параметры конструктора парсера
 */
export type ParserConstructorType = {
	builer: Builer;
};

/**
 * Абстрактный базовый класс для парсеров окружения
 */
export abstract class Parser {
	protected readonly builer: Builer;

	constructor({ builer }: ParserConstructorType) {
		this.builer = builer;
	}

	/**
	 * Парсит данные и загружает их в окружение
	 */
	abstract parse(data: any): void;

	/**
	 * Сериализует текущее состояние окружения в строку
	 */
	abstract stringify(): string;
	abstract toData(): EnvSchema;
}

type Constructor<T = any> = new (...args: any[]) => T;

type PrefabName = Extract<keyof typeof DevicesByPrefabName, string>;
type HousingName = Extract<keyof typeof DeviceClassesByBase.Housing, string>;

type DevicesByPrefabNameType = typeof DevicesByPrefabName;
type DeviceClass = DevicesByPrefabNameType[PrefabName] extends Constructor
	? DevicesByPrefabNameType[PrefabName]
	: never;

type DeviceClassesByBaseHousingType = typeof DeviceClassesByBase.Housing;
type HousingClass = DeviceClassesByBaseHousingType[HousingName] extends Constructor
	? DeviceClassesByBaseHousingType[HousingName]
	: never;

// ============================================================================
// SERIALIZER - Сериализация окружения в схему
// ============================================================================

// ============================================================================
// SERIALIZER - Дополненная версия с поддержкой слотов и реагентов
// ============================================================================
class SerializerV1 {
	constructor(private readonly builer: Builer) {}

	private debug = false;

	public toData(debug: boolean = false): EnvSchema {
		this.debug = debug;
		const networks = this.stringifyNetworks();
		const devices = this.stringifyDevices();
		const chips = this.stringifyChips();

		const data: EnvSchema = {
			version: 1,
			chips: chips,
			devices: devices,
			networks: networks,
		};

		return this.removeUndefinedKeys(data);
	}

	private removeUndefinedKeys<T>(obj: T): T {
		if (obj === null || typeof obj !== "object") {
			return obj;
		}

		if (Array.isArray(obj)) {
			return obj.map((item) => this.removeUndefinedKeys(item)) as any;
		}

		const cleanedObj = {} as T;

		for (const [key, value] of Object.entries(obj)) {
			if (value === undefined) {
				continue;
			}

			(cleanedObj as any)[key] = this.removeUndefinedKeys(value);
		}

		return cleanedObj;
	}

	public stringify(debug: boolean = false, minify: boolean = false): string {
		if (minify) {
			return JSON.stringify(this.toData(debug));
		}
		return JSON.stringify(this.toData(debug), null, 2);
	}
	private stringifyChips(): ChipSchema[] {
		const chips: ChipSchema[] = [];
		this.builer.Chips.forEach((chip: Chip) => {
			const registers: RegisterSchema[] = [];
			for (const register of chip.registers) {
				if (register[1] !== 0) {
					registers.push({
						name: `r${register[0]}`,
						value: register[1],
					} satisfies RegisterSchema);
				}
			}
			const data = {
				id: chip.id,
				RA: chip.RA === 17 ? undefined : chip.RA,
				SP: chip.SP === 16 ? undefined : chip.SP,
				register_length: chip.register_length === 18 ? undefined : chip.register_length,
				stack_length: chip.stack_length === 512 ? undefined : chip.stack_length,
				registers: registers.length > 0 ? registers : undefined,
				stack: chip.memory.length > 0 ? chip.memory.toArray() : undefined,
				code: chip.housing?.runner ? this.stringifyCode(chip.housing.runner).join("\n") : (chip?.getIc10Code() ?? ""),
				lineNumber: this.debug ? (chip?.housing?.props?.read("LineNumber") ?? 0) : undefined,
			} satisfies ChipSchema;
			chips.push(data);
		});
		return chips;
	}

	private stringifyCode(runner: Ic10Runner): string[] {
		const code: string[] = [];
		let lines = runner.lines;
		if (lines.length === 0) {
			lines = runner.lexer(runner.context.getIc10Code());
		}
		for (const line of lines) {
			if (!line.comment.includes("seed:") && this.debug) {
				code.push(line.toString(`seed:${line.randomGenerator.seed}`));
			} else {
				code.push(line.toString());
			}
		}
		return code;
	}

	private stringifyNetworks(): NetworkSchema[] {
		return this.builer.Networks.values()
			.map((network: Network) => {
				const props = this.serializeNetworkChannels(network);

				return {
					id: network.id,
					type: network.type,
					props: props,
				};
			})
			.toArray();
	}

	private serializeNetworkChannels(network: Network): Array<{ name: string; value: any }> | undefined {
		const props: Array<{ name: string; value: any }> = [];

		for (const [key, value] of network.chanels) {
			if (!Logics.hasValue(key)) {
				throw new Error(i18n.t("error.unknown_logic_channel_value", { value: key }));
			}

			props.push({
				name: Logics.getByValue(key),
				value,
			});
		}
		if (props.length === 0) {
			return undefined;
		}
		return props;
	}

	private stringifyDevices(): DeviceSchema[] {
		return this.builer.Devices.values()
			.map((device: Device) => this.serializeDevice(device))
			.toArray();
	}

	private serializeDevice(device: Device): HousingSchema | DeviceSchema {
		const data: any = {
			id: device.id,
			PrefabName: device.rawData.PrefabName,
			name: device.name.toString(),
			ports: this.serializeDevicePorts(device),
			props: this.serializeDeviceProps(device),
		};

		// Housing устройства содержат IC10 код
		if (device instanceof Housing) {
			//data is HousingSchema
			data.chip = device?.chip?.id;
			if (device.connectedDevices.size > 0) {
				data.pins = [];
				device.connectedDevices.forEach((device, key) => {
					data.pins.push({
						pin: `d${key}`,
						device: device.id,
					});
				});
			}
		} else {
			//data is DeviceSchema
		}

		// Сериализация слотов
		const slots = this.serializeDeviceSlots(device);
		if (slots && slots.length > 0) {
			data.slots = slots;
		}

		// Сериализация реагентов
		const reagents = this.serializeDeviceReagents(device);
		if (reagents && reagents.length > 0) {
			data.reagents = reagents;
		}

		return data satisfies HousingSchema | DeviceSchema;
	}

	private serializeDevicePorts(device: Device): PortSchema[] | undefined {
		const data: PortSchema[] = [];
		for (const element of device.ports) {
			data.push({
				port: element.isDefault ? "default" : element.port,
				network: element.network.id,
			} satisfies PortSchema);
		}
		if (data.length === 0) {
			return undefined;
		}
		return data;
	}

	private serializeDeviceProps(device: Device): PropsSchema[] | undefined {
		const data: PropsSchema[] = [];
		const ignoredProps = ["PrefabHash", "LineNumber"];
		for (const element of device.props) {
			if (element.value && !ignoredProps.includes(element.logicName)) {
				data.push({
					name: element.logicName,
					value: element.value,
				} satisfies PropsSchema);
			}
		}
		if (data.length === 0) {
			return undefined;
		}
		return data;
	}

	/**
	 * Сериализует слоты устройства
	 */
	private serializeDeviceSlots(device: Device): SlotSchema[] | undefined {
		if (!device.hasSlots) return undefined;

		const slotsData: SlotSchema[] = [];

		for (const [slotIndex, slot] of device.slots) {
			if (slot.hasItem()) {
				const item = slot.getItem();
				if (item) {
					let itemName: ItemName;
					if (Items.hasValue(item.hash)) {
						itemName = item.hash;
					}
					if (Items.hasKey(item.hash)) {
						itemName = Items.getByKey(item.hash);
					}
					slotsData.push({
						index: slotIndex,
						item: itemName,
						amount: item.count,
					});
				}
			}
		}

		return slotsData.length > 0 ? slotsData : undefined;
	}

	/**
	 * Сериализует реагенты устройства
	 */
	private serializeDeviceReagents(device: Device): ReagentSchema[] | undefined {
		if (!device.hasReagents) return undefined;

		const reagentsData: ReagentSchema[] = [];

		for (const reagent of device.reagents) {
			if (reagent.count > 0) {
				if (Reagents.hasValue(reagent.name)) {
					reagentsData.push({
						name: reagent.name,
						amount: reagent.count,
					});
				} else {
					throw new Error(i18n.t("error.unknown_reagent_name", { name: reagent.name }));
				}
			}
		}

		return reagentsData.length > 0 ? reagentsData : undefined;
	}
}

// ============================================================================
// DESERIALIZER - Дополненная версия с поддержкой слотов и реагентов
// ============================================================================

class DeserializerV1 {
	constructor(private readonly builer: Builer) {}

	public parse(data: EnvSchema): void {
		data = v.parse(EnvSchema, data);
		this.builer.reset();
		this.parseChips(data);
		this.parseNetworks(data);
		this.parseDevices(data);
	}

	private parseChips(data: EnvSchema) {
		data.chips.forEach((chipSchema) => {
			const chip = new Chip({
				id: chipSchema.id,
				ic10Code: chipSchema.code || undefined,
				register_length: chipSchema.register_length || undefined,
				stack_length: chipSchema.stack_length || undefined,
				SP: chipSchema.SP || undefined,
				RA: chipSchema.RA || undefined,
			});

			if (typeof chipSchema.registers !== "undefined") {
				for (const reg of chipSchema.registers) {
					const registerNumber = parseInt(reg.name.slice(1), 10);
					if (Number.isNaN(registerNumber)) {
						throw new Error(
							i18n.t("error.parser.invalid_register_name", {
								register: reg.name,
								chip: chipSchema.id,
							}),
						);
					}
					chip.registers.set(registerNumber, reg.value);
				}
			}

			if (typeof chipSchema.stack !== "undefined") {
				for (const reg of chipSchema.stack) {
					chip.memory.push(reg);
				}
				chip.registers.set(chip.SP, chip.memory.length);
			}

			this.builer.Chips.set(chipSchema.id, chip);
		});
	}

	private parseNetworks(data: EnvSchema): void {
		data.networks.forEach((networkSchema) => {
			const network = this.createNetwork(networkSchema);
			this.builer.Networks.set(networkSchema.id, network);
		});
	}

	private createNetwork(networkSchema: NetworkSchema): Network {
		const network = new Network({
			id: networkSchema.id,
			networkType: networkSchema.type as any,
		});

		if (networkSchema.props) {
			this.applyNetworkChannels(network, networkSchema.props);
		}

		return network;
	}

	private applyNetworkChannels(network: Network, props: Array<{ name: string; value: any }>): void {
		for (const { name, value } of props) {
			if (!Logics.hasKey(name)) {
				throw new Error(
					i18n.t("error.parser.unknown_logic_channel", {
						channel: name,
						network: network.id,
						available_channels: Array.from(Logics.keys()).join(", "),
					}),
				);
			}

			network.chanels.set(Logics.getByKey(name), value);
		}
	}

	private parseDevices(data: EnvSchema): void {
		// Первый проход - создание устройств
		for (const deviceSchema of data.devices) {
			this.parseDevice(deviceSchema);
		}

		// Второй проход - подключение пинов для Housing устройств
		for (const deviceSchema of data.devices) {
			if (this.isHousing(deviceSchema)) {
				this.connectPins(deviceSchema);
			}
		}
	}

	private connectPins(housingSchema: HousingSchema) {
		if (housingSchema.pins?.length > 0) {
			housingSchema.pins.forEach((pin) => this.connectPin(pin, housingSchema));
		}
	}

	private connectPin(pin: HousingSchema["pins"][number], housingSchema: HousingSchema) {
		if (!this.builer.Devices.has(pin.device)) {
			throw new Error(
				i18n.t("error.parser.device_not_found_for_pin", {
					device_id: pin.device,
					pin: pin.pin,
					housing: housingSchema.id,
				}),
			);
		}

		if (!this.builer.Devices.has(housingSchema.id)) {
			throw new Error(
				i18n.t("error.parser.housing_not_found", {
					housing_id: housingSchema.id,
				}),
			);
		}

		const housing = this.builer.Devices.get(housingSchema.id);
		const device = this.builer.Devices.get(pin.device);

		if (housing.network.id !== device.network.id) {
			throw new Error(
				i18n.t("error.parser.network_mismatch", {
					housing_network: housing.network.id,
					device_network: device.network.id,
					housing: housingSchema.id,
					device: pin.device,
					pin: pin.pin,
				}),
			);
		}

		if (!(housing instanceof Housing)) {
			throw new Error(
				i18n.t("error.parser.device_not_housing", {
					device_id: housingSchema.id,
					device_type: housing.constructor.name,
				}),
			);
		}

		const pinNumber = parseInt(pin.pin.slice(1), 10);
		if (Number.isNaN(pinNumber)) {
			throw new Error(
				i18n.t("error.parser.invalid_pin_format", {
					pin: pin.pin,
					housing: housingSchema.id,
				}),
			);
		}

		housing.connectDevices(pinNumber, device);
	}

	private parseDevice(deviceSchema: DeviceSchema | HousingSchema): void {
		const isHousing = this.isHousing(deviceSchema);
		const device = isHousing ? this.createHousingDevice(deviceSchema) : this.createRegularDevice(deviceSchema);

		this.connectDevicePorts(device, deviceSchema);
		this.connectDeviceProps(device, deviceSchema);
		this.connectDeviceSlots(device, deviceSchema);
		this.connectDeviceReagents(device, deviceSchema);

		this.builer.Devices.set(deviceSchema.id, device);

		if (deviceSchema.name) {
			device.name = deviceSchema.name;
		}

		if (device instanceof Housing) {
			this.builer.Runners.set(deviceSchema.id, new Ic10Runner({ housing: device }));
		}
	}

	private createRegularDevice(deviceSchema: DeviceSchema): Device {
		const DeviceClass = this.findDeviceClass(deviceSchema.PrefabName);
		return new DeviceClass({ id: deviceSchema.id });
	}

	private createHousingDevice(deviceSchema: HousingSchema): Housing {
		const HousingClass = this.findHousingClass(deviceSchema.PrefabName);
		let chip: Chip | undefined;
		if (deviceSchema.chip) {
			chip = this.builer.Chips.get(deviceSchema.chip);
			if (!chip) {
				throw new Error(
					i18n.t("error.parser.chip_not_found_for_housing", {
						chip_id: String(deviceSchema.chip),
						housing: deviceSchema.id,
						prefab: deviceSchema.PrefabName,
						available_chips: Array.from(this.builer.Chips.keys()).join(", "),
					}),
				);
			}
		}
		return new HousingClass({ chip: chip, id: deviceSchema.id });
	}

	private connectDevicePorts(device: Device, deviceSchema: DeviceSchema): void {
		if (!deviceSchema.ports) {
			return;
		}

		for (const { port, network: networkId } of deviceSchema.ports) {
			const network = this.getNetwork(networkId);
			this.connectPort(device, network, port);
		}
	}

	private connectDeviceProps(device: Device, deviceSchema: DeviceSchema): void {
		if (!deviceSchema.props) {
			return;
		}

		for (const { name, value } of deviceSchema.props) {
			try {
				device.props.forceWrite(name, value);
			} catch (error) {
				throw new Error(
					i18n.t("error.parser.failed_to_set_property", {
						property: name,
						device: deviceSchema.id,
						value: value,
						error: error.message,
					}),
				);
			}
		}
	}

	private connectDeviceSlots(device: Device, deviceSchema: DeviceSchema): void {
		if (!deviceSchema.slots || !device.hasSlots) {
			return;
		}

		for (const slotData of deviceSchema.slots) {
			const slot = device.slots.getSlot(slotData.index);
			if (!slot) {
				throw new Error(
					i18n.t("error.parser.slot_not_found", {
						slot_index: slotData.index,
						device: deviceSchema.id,
						prefab: deviceSchema.PrefabName,
					}),
				);
			}

			let itemHash: ItemHash;
			if (Items.hasValue(slotData.item)) {
				itemHash = Items.getByValue(slotData.item);
			} else {
				throw new Error(
					i18n.t("error.parser.unknown_item", {
						item: slotData.item,
						slot: slotData.index,
						device: deviceSchema.id,
						available_items: Array.from(Items.values()).join(", "),
					}),
				);
			}

			try {
				const item = new ItemEntity(itemHash, slotData.amount);
				slot.putItem(item, true);
			} catch (error) {
				throw new Error(
					i18n.t("error.parser.failed_to_put_item_in_slot", {
						item: slotData.item,
						slot: slotData.index,
						device: deviceSchema.id,
						error: error.message,
					}),
				);
			}
		}
	}

	private connectDeviceReagents(device: Device, deviceSchema: DeviceSchema): void {
		if (!deviceSchema.reagents || !device.hasReagents) {
			return;
		}

		for (const reagentData of deviceSchema.reagents) {
			if (!Reagents.hasValue(reagentData.name)) {
				throw new Error(
					i18n.t("error.parser.unknown_reagent", {
						reagent: reagentData.name,
						device: deviceSchema.id,
						available_reagents: Array.from(Reagents.values()).join(", "),
					}),
				);
			}

			try {
				const reagentHash = Reagents.getByValue(reagentData.name);
				device.reagents.set(reagentHash, reagentData.amount);
			} catch (error) {
				throw new Error(
					i18n.t("error.parser.failed_to_set_reagent", {
						reagent: reagentData.name,
						device: deviceSchema.id,
						amount: reagentData.amount,
						error: error.message,
					}),
				);
			}
		}
	}

	private getNetwork(networkId: string): Network {
		if (!this.builer.Networks.has(networkId)) {
			throw new Error(
				i18n.t("error.parser.network_not_found", {
					network_id: networkId,
					available_networks: Array.from(this.builer.Networks.keys()).join(", "),
				}),
			);
		}

		return this.builer.Networks.get(networkId);
	}

	private connectPort(device: Device, network: Network, port: PortSchema["port"]): void {
		if (port !== "default") {
			if (!device.ports.canConnect(network.type, port)) {
				throw new Error(
					i18n.t("error.parser.port_connection_failed", {
						port: port,
						network_type: String(network.type),
						device: device.id,
						device_type: device.constructor.name,
					}),
				);
			}
			network.apply(device, port);
		} else {
			network.apply(device);
		}
	}

	private isDevice(prefabName: any): prefabName is PrefabName {
		return typeof DevicesByPrefabName[prefabName] !== "undefined";
	}

	private isHousing(device: DeviceSchema): device is HousingSchema {
		return typeof DeviceClassesByBase.Housing[device.PrefabName] !== "undefined";
	}

	private findHousingClass(prefabName: string): HousingClass {
		if (!this.isDevice(prefabName)) {
			throw new Error(
				i18n.t("error.parser.unknown_device_prefab", {
					prefab: prefabName,
					available_prefabs: Object.keys(DevicesByPrefabName).join(", "),
				}),
			);
		}

		const housingClass = DeviceClassesByBase.Housing[prefabName];
		if (!housingClass) {
			throw new Error(
				i18n.t("error.parser.device_not_housing_type", {
					prefab: prefabName,
					housing_prefabs: Object.keys(DeviceClassesByBase.Housing).join(", "),
				}),
			);
		}

		return housingClass;
	}

	private findDeviceClass(prefabName: string): DeviceClass {
		if (!this.isDevice(prefabName)) {
			throw new Error(
				i18n.t("error.parser.unknown_device_prefab", {
					prefab: prefabName,
					available_prefabs: Object.keys(DevicesByPrefabName).join(", "),
				}),
			);
		}

		const deviceClass = DevicesByPrefabName[prefabName];
		if (!deviceClass) {
			throw new Error(
				i18n.t("error.parser.device_class_not_found", {
					prefab: prefabName,
				}),
			);
		}

		return deviceClass;
	}
}
// ============================================================================
// PARSER V1 - Объединяет сериализацию и десериализацию
// ============================================================================

/**
 * Парсер версии 1 для загрузки и сохранения окружения
 * Поддерживает устройства, сети и IC10 код для Housing устройств
 */
export class ParserV1 extends Parser {
	private readonly serializer: SerializerV1;
	private readonly deserializer: DeserializerV1;

	constructor(params: ParserConstructorType) {
		super(params);
		this.serializer = new SerializerV1(this.builer);
		this.deserializer = new DeserializerV1(this.builer);
	}

	/**
	 * Парсит схему окружения и загружает её в builder
	 * @param data - Схема окружения для загрузки
	 */
	public parse(data: EnvSchema): void {
		this.deserializer.parse(data);
	}

	/**
	 * Сериализует текущее состояние окружения в YAML строку
	 * @returns YAML строка с полной схемой окружения
	 */
	public stringify(debug: boolean = false, minify: boolean = false): string {
		return this.serializer.stringify(debug, minify);
	}

	toData(debug: boolean = false): EnvSchema {
		return this.serializer.toData(debug);
	}
}
