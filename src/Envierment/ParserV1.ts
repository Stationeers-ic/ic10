import { stringify } from "yaml";
import { Chip } from "@/Core/Chip";
import type { Device } from "@/Core/Device";
import { ItemEntity } from "@/Core/Device/DeviceSlots";
import { Housing } from "@/Core/Housing";
import { Network } from "@/Core/Network";
import { Items, Logics, Reagents } from "@/Defines/data";
import { DeviceClassesByBase, DevicesByPrefabName } from "@/Devices";
import type { Builer } from "@/Envierment/Builder";
import { Ic10Runner } from "@/Ic10/Ic10Runner";
import type { DeviceSchema, EnvSchema, NetworkSchema, PortSchema, PropsSchema } from "@/Schemas/EnvSchema";

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

		const data: EnvSchema = {
			version: 1,
			devices: devices,
			networks: networks,
		};

		return stringify(data);
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
			data.code = device.chip.getIc10Code();
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
	private serializeDeviceSlots(device: Device): Array<{ index: number; item: string; amount: number }> | undefined {
		if (!device.hasSlots) return undefined;

		const slotsData: Array<{ index: number; item: string; amount: number }> = [];

		for (const [slotIndex, slot] of device.slots) {
			if (slot.hasItem()) {
				const item = slot.getItem();
				if (item) {
					// Здесь нужно преобразовать hash в имя предмета
					// Предполагается, что есть какой-то mapping для этого
					const itemName = this.getItemNameByHash(item.hash);
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
	private serializeDeviceReagents(device: Device): Array<{ name: string; amount: number }> | undefined {
		if (!device.hasReagents) return undefined;

		const reagentsData: Array<{ name: string; amount: number }> = [];

		for (const reagent of device.reagents) {
			if (reagent.count > 0) {
				reagentsData.push({
					name: reagent.name,
					amount: reagent.count,
				});
			}
		}

		return reagentsData.length > 0 ? reagentsData : undefined;
	}

	/**
	 * Вспомогательный метод для получения имени предмета по hash
	 */
	private getItemNameByHash(hash: number): string {
		if (Items.hasKey(hash)) {
			return Items.getByKey(hash);
		}
		throw new Error(`Unknown item hash: ${hash}`);
	}
}

// ============================================================================
// DESERIALIZER - Дополненная версия с поддержкой слотов и реагентов
// ============================================================================

class DeserializerV1 {
	constructor(private readonly builer: Builer) {}

	public parse(data: EnvSchema): void {
		this.builer.reset();
		this.parseNetworks(data);
		this.parseDevices(data);
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
		const code = deviceSchema.code || "";
		const chip = new Chip({ ic10Code: code });

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
				const itemHash = this.getItemHashByName(slotData.item);
				const item = new ItemEntity(itemHash, slotData.amount);
				slot.putItem(item);
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
			if (Reagents.hasKey(reagentData.name)) {
				const reagentHash = Reagents.getByKey(reagentData.name);
				device.reagents.set(reagentHash, reagentData.amount);
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

	/**
	 * Вспомогательный метод для получения hash предмета по имени
	 */
	private getItemHashByName(itemName: string): number {
		if (Items.hasKey(itemName)) {
			return Items.getByValue(itemName);
		}
		throw new Error(`Item ${itemName} not found`);
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
