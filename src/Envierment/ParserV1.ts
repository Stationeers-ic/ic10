import { stringify } from "yaml";
import { Chip } from "@/Core/Chip";
import type { Device } from "@/Core/Device";
import { ItemEntity } from "@/Core/Device/DeviceSlots";
import { Housing } from "@/Core/Housing";
import { Network } from "@/Core/Network";
import { type ItemHash, type ItemName, Items, Logics, Reagents } from "@/Defines/data";
import { DeviceClassesByBase, DevicesByPrefabName } from "@/Devices";
import type { Builer } from "@/Envierment/Builder";
import { Ic10Runner } from "@/Ic10/Ic10Runner";
import type {
	ChipSchema,
	DeviceSchema,
	EnvSchema,
	NetworkSchema,
	PortSchema,
	PropsSchema,
	ReagentSchema,
	RegisterSchema,
	SlotSchema,
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
}

type Constructor<T = any> = new (...args: any[]) => T;

type PrefabName = Extract<keyof typeof DevicesByPrefabName, string>;
type HousingName = Extract<keyof typeof DeviceClassesByBase.Housing, string>;

type DevicesByPrefabNameType = typeof DevicesByPrefabName;
type DeviceClass = {
	[K in PrefabName]: DevicesByPrefabNameType[K] extends Constructor ? DevicesByPrefabNameType[K] : never;
}[PrefabName];

type DeviceClassesByBaseHousingType = typeof DeviceClassesByBase.Housing;
type HousingClass = {
	[K in HousingName]: DeviceClassesByBaseHousingType[K] extends Constructor ? DeviceClassesByBaseHousingType[K] : never;
}[HousingName];

// ============================================================================
// SERIALIZER - Сериализация окружения в схему
// ============================================================================

// ============================================================================
// SERIALIZER - Дополненная версия с поддержкой слотов и реагентов
// ============================================================================
class SerializerV1 {
	constructor(private readonly builer: Builer) {}

	public stringify(): string {
		const networks = this.stringifyNetworks();
		const devices = this.stringifyDevices();
		const chips = this.stringifyChips();

		const data: EnvSchema = {
			version: 1,
			chips: chips,
			devices: devices,
			networks: networks,
		};

		return stringify(data);
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
				code: chip.getIc10Code(),
			} satisfies ChipSchema;

			chips.push(data);
		});
		return chips;
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
				throw new Error(`Unknown logic channel value: ${key}`);
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

	private serializeDevice(device: Device): DeviceSchema {
		const data: DeviceSchema = {
			id: device.id,
			PrefabName: device.rawData.PrefabName,
			name: device.name.toString(),
			ports: this.serializeDevicePorts(device),
			props: this.serializeDeviceProps(device),
		};

		// Housing устройства содержат IC10 код
		if (device instanceof Housing) {
			data.chip = device.chip.id;
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

		return data;
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
		for (const element of device.props) {
			if (element.value && !["PrefabHash", "LineNumber"].includes(element.logicName)) {
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
					throw new Error(`Unknown reagent name: ${reagent.name}`);
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
					chip.registers.set(parseInt(reg.name.slice(1), 10), reg.value);
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
				throw new Error(`Unknown logic channel name: ${name}`);
			}

			network.chanels.set(Logics.getByKey(name), value);
		}
	}

	private parseDevices(data: EnvSchema): void {
		for (const deviceSchema of data.devices) {
			this.parseDevice(deviceSchema);
		}
	}

	private parseDevice(deviceSchema: DeviceSchema): void {
		const device = this.isHousing(deviceSchema.PrefabName)
			? this.createHousingDevice(deviceSchema)
			: this.createRegularDevice(deviceSchema);

		this.connectDevicePorts(device, deviceSchema);
		this.connectDeviceProps(device, deviceSchema);
		this.connectDeviceSlots(device, deviceSchema);
		this.connectDeviceReagents(device, deviceSchema);

		this.builer.Devices.set(deviceSchema.id, device);

		if (deviceSchema.name) {
			device.name = deviceSchema.name;
		}

		// Для Housing устройств создаём runner для выполнения IC10 кода
		if (device instanceof Housing) {
			this.builer.Runners.set(deviceSchema.id, new Ic10Runner({ housing: device }));
		}
	}

	private createRegularDevice(deviceSchema: DeviceSchema): Device {
		const DeviceClass = this.findDeviceClass(deviceSchema.PrefabName);
		return new DeviceClass({ id: deviceSchema.id });
	}

	private createHousingDevice(deviceSchema: DeviceSchema): Housing {
		const HousingClass = this.findHousingClass(deviceSchema.PrefabName);
		const chip = this.builer.Chips.get(deviceSchema.chip);
		if (!chip) {
			throw new Error(`Chip ${deviceSchema.chip} not found for housing device ${deviceSchema.PrefabName}`);
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
			device.props.forceWrite(name, value);
		}
	}

	/**
	 * Подключает слоты устройства согласно схеме
	 */
	private connectDeviceSlots(device: Device, deviceSchema: DeviceSchema): void {
		if (!deviceSchema.slots || !device.hasSlots) {
			return;
		}

		for (const slotData of deviceSchema.slots) {
			const slot = device.slots.getSlot(slotData.index);
			if (slot) {
				let itemHash: ItemHash;
				if (Items.hasKey(slotData.item)) {
					itemHash = slotData.item;
				}
				if (Items.hasValue(slotData.item)) {
					itemHash = Items.getByValue(slotData.item);
				}
				const item = new ItemEntity(itemHash, slotData.amount);
				slot.putItem(item, true);
			}
		}
	}

	/**
	 * Подключает реагенты устройства согласно схеме
	 */
	private connectDeviceReagents(device: Device, deviceSchema: DeviceSchema): void {
		if (!deviceSchema.reagents || !device.hasReagents) {
			return;
		}

		for (const reagentData of deviceSchema.reagents) {
			if (Reagents.hasValue(reagentData.name)) {
				const reagentHash = Reagents.getByValue(reagentData.name);
				device.reagents.set(reagentHash, reagentData.amount);
			} else {
				throw new Error(`Unknown reagent name: ${reagentData.name}`);
			}
		}
	}

	private getNetwork(networkId: string): Network {
		if (!this.builer.Networks.has(networkId)) {
			throw new Error(`Network ${networkId} not found`);
		}

		return this.builer.Networks.get(networkId);
	}

	private connectPort(device: Device, network: Network, port: PortSchema["port"]): void {
		if (port !== "default") {
			if (!device.ports.canConnect(network.type, port)) {
				throw new Error(
					`Port ${port} cannot connect to network type ${network.type} in device ${device.constructor.name}`,
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

	private isHousing(prefabName: any): prefabName is HousingName {
		return typeof DeviceClassesByBase.Housing[prefabName] !== "undefined";
	}

	private findHousingClass(prefabName: string): HousingClass {
		if (!this.isDevice(prefabName)) {
			throw new Error(`Unknown device prefab name: ${prefabName}`);
		}

		const housingClass = DeviceClassesByBase.Housing[prefabName];
		if (!housingClass) {
			throw new Error(`Device ${prefabName} is not a Housing device`);
		}

		return housingClass;
	}

	private findDeviceClass(prefabName: string): DeviceClass {
		if (!this.isDevice(prefabName)) {
			throw new Error(`Unknown device prefab name: ${prefabName}`);
		}

		const deviceClass = DevicesByPrefabName[prefabName];
		if (!deviceClass) {
			throw new Error(`Device class not found for prefab: ${prefabName}`);
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
	public stringify(): string {
		return this.serializer.stringify();
	}
}
