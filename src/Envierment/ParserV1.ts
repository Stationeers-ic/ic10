import { stringify } from "yaml";
import { Chip } from "@/Core/Chip";
import type { Device } from "@/Core/Device";
import { Housing } from "@/Core/Housing";
import { Network } from "@/Core/Network";
import { Logics } from "@/Defines/data";
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

/**
 * Сериализатор версии 1 - преобразует окружение в YAML схему
 */
class SerializerV1 {
	constructor(private readonly builer: Builer) {}

	/**
	 * Сериализует текущее состояние окружения в YAML строку
	 * @returns YAML строка с полной схемой окружения
	 */
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

	/**
	 * Сериализует все сети в массив схем
	 * @returns Массив схем сетей
	 */
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

	/**
	 * Сериализует каналы сети в массив пар имя-значение
	 * @param network - Сеть для сериализации
	 * @returns Массив свойств каналов
	 */
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

	/**
	 * Сериализует все устройства в массив схем
	 * @returns Массив схем устройств
	 */
	private stringifyDevices(): DeviceSchema[] {
		return this.builer.Devices.values()
			.map((device: Device) => this.serializeDevice(device))
			.toArray();
	}

	/**
	 * Сериализует одно устройство в схему
	 * @param device - Устройство для сериализации
	 * @returns Схема устройства
	 */
	private serializeDevice(device: Device): DeviceSchema {
		const data: DeviceSchema = {
			id: device.id,
			PrefabName: device.rawData.PrefabName,
			ports: this.serializeDevicePorts(device),
			props: this.serializeDeviceProps(device),
		};

		// Housing устройства содержат IC10 код
		if (device instanceof Housing) {
			data.code = device.chip.getIc10Code();
		}

		return data;
	}

	/**
	 * Сериализует порты устройства
	 * @param device - Устройство с портами
	 * @returns Массив описаний портов
	 */
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

	/**
	 * Сериализует свойства устройства
	 * @param device - Устройство со свойствами
	 * @returns Массив свойств
	 */
	private serializeDeviceProps(device: Device): PropsSchema[] | undefined {
		const data: PropsSchema[] = [];
		for (const element of device.props) {
			if (element.value && element.logicName !== "PrefabHash") {
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
}

// ============================================================================
// DESERIALIZER - Парсинг схемы в окружение
// ============================================================================

/**
 * Десериализатор версии 1 - загружает схему в окружение
 */
class DeserializerV1 {
	constructor(private readonly builer: Builer) {}

	/**
	 * Парсит схему окружения и загружает её в builder
	 * @param data - Схема окружения для загрузки
	 */
	public parse(data: EnvSchema): void {
		this.builer.reset();
		this.parseNetworks(data);
		this.parseDevices(data);
	}

	/**
	 * Парсит и создаёт все сети из схемы
	 * @param data - Схема окружения
	 */
	private parseNetworks(data: EnvSchema): void {
		data.networks.forEach((networkSchema) => {
			const network = this.createNetwork(networkSchema);
			this.builer.Networks.set(networkSchema.id, network);
		});
	}

	/**
	 * Создаёт сеть из схемы
	 * @param networkSchema - Схема сети
	 * @returns Созданная сеть
	 */
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

	/**
	 * Применяет значения каналов к сети
	 * @param network - Сеть для настройки
	 * @param props - Массив свойств каналов
	 */
	private applyNetworkChannels(network: Network, props: Array<{ name: string; value: any }>): void {
		for (const { name, value } of props) {
			if (!Logics.hasKey(name)) {
				throw new Error(`Unknown logic channel name: ${name}`);
			}

			network.chanels.set(Logics.getByKey(name), value);
		}
	}

	/**
	 * Парсит и создаёт все устройства из схемы
	 * @param data - Схема окружения
	 */
	private parseDevices(data: EnvSchema): void {
		for (const deviceSchema of data.devices) {
			this.parseDevice(deviceSchema);
		}
	}

	/**
	 * Парсит и создаёт одно устройство
	 * Housing устройства обрабатываются особым образом (с IC10 кодом)
	 * @param deviceSchema - Схема устройства
	 */
	private parseDevice(deviceSchema: DeviceSchema): void {
		const device = this.isHousing(deviceSchema.PrefabName)
			? this.createHousingDevice(deviceSchema)
			: this.createRegularDevice(deviceSchema);

		this.connectDevicePorts(device, deviceSchema);
		this.connectDeviceProps(device, deviceSchema);
		this.builer.Devices.set(deviceSchema.id, device);

		// Для Housing устройств создаём runner для выполнения IC10 кода
		if (device instanceof Housing) {
			this.builer.Runners.set(deviceSchema.id, new Ic10Runner({ housing: device }));
		}
	}

	/**
	 * Создаёт обычное устройство (не Housing)
	 * @param deviceSchema - Схема устройства
	 * @returns Созданное устройство
	 */
	private createRegularDevice(deviceSchema: DeviceSchema): Device {
		const DeviceClass = this.findDeviceClass(deviceSchema.PrefabName);
		return new DeviceClass({ id: deviceSchema.id });
	}

	/**
	 * Создаёт Housing устройство с IC10 кодом
	 * @param deviceSchema - Схема устройства
	 * @returns Созданное Housing устройство
	 */
	private createHousingDevice(deviceSchema: DeviceSchema): Housing {
		const HousingClass = this.findHousingClass(deviceSchema.PrefabName);
		const code = deviceSchema.code || "";
		const chip = new Chip({ ic10Code: code });

		return new HousingClass({ chip: chip, id: deviceSchema.id });
	}

	/**
	 * Подключает порты устройства к сетям согласно схеме
	 * @param device - Устройство для подключения
	 * @param deviceSchema - Схема с описанием портов
	 */
	private connectDevicePorts(device: Device, deviceSchema: DeviceSchema): void {
		if (!deviceSchema.ports) {
			return;
		}

		for (const { port, network: networkId } of deviceSchema.ports) {
			const network = this.getNetwork(networkId);
			this.connectPort(device, network, port);
		}
	}

	/**
	 * Подключает свойства устройства согласно схеме
	 * @param device - Устройство для настройки
	 * @param deviceSchema - Схема со свойствами
	 */
	private connectDeviceProps(device: Device, deviceSchema: DeviceSchema): void {
		if (!deviceSchema.props) {
			return;
		}

		for (const { name, value } of deviceSchema.props) {
			device.props.forceWrite(name, value);
		}
	}

	/**
	 * Получает сеть по ID или выбрасывает ошибку
	 * @param networkId - ID сети
	 * @returns Найденная сеть
	 */
	private getNetwork(networkId: string): Network {
		if (!this.builer.Networks.has(networkId)) {
			throw new Error(`Network ${networkId} not found`);
		}

		return this.builer.Networks.get(networkId);
	}

	/**
	 * Подключает порт устройства к сети
	 * @param device - Устройство
	 * @param network - Сеть для подключения
	 * @param port - Имя порта или "default"
	 */
	private connectPort(device: Device, network: Network, port: PortSchema["port"]): void {
		// Если порт не "default", проверяем возможность подключения
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

	/**
	 * Проверяет, является ли prefab name валидным именем устройства
	 * @param prefabName - Имя для проверки
	 * @returns true если это валидное имя устройства
	 */
	private isDevice(prefabName: any): prefabName is PrefabName {
		return typeof DevicesByPrefabName[prefabName] !== "undefined";
	}

	/**
	 * Проверяет, является ли устройство Housing устройством
	 * @param prefabName - Имя устройства
	 * @returns true если это Housing устройство
	 */
	private isHousing(prefabName: any): prefabName is HousingName {
		return typeof DeviceClassesByBase.Housing[prefabName] !== "undefined";
	}

	/**
	 * Находит класс Housing устройства по имени
	 * @param prefabName - Имя устройства
	 * @returns Класс Housing устройства
	 */
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

	/**
	 * Находит класс устройства по имени
	 * @param prefabName - Имя устройства
	 * @returns Класс устройства
	 */
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
