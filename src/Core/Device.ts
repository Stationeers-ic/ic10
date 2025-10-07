import { v4 as uuidv4 } from "uuid";
import { DevicePorts } from "@/Core//Device/DevicePorts";
import { DeviceError } from "@/Core/Device/DeviceError";
import { DeviceMemory } from "@/Core/Device/DeviceMemory";
import { DeviceProps } from "@/Core/Device/DeviceProps";
import { DeviceReagent } from "@/Core/Device/DeviceReagent";
import { DeviceSlots } from "@/Core/Device/DeviceSlots";
import type { Network } from "@/Core/Network";
import type { StackInterface } from "@/Core/Stack";
import DEVICES, { type LogicsType } from "@/Defines/devices";
import { ErrorSeverity, Ic10Error } from "@/Ic10/Errors/Errors";
import { crc32 } from "@/Ic10/Helpers/functions";

export type LogicType = LogicsType[number];

export type DeviceConstructor = {
	hash: number;
	network?: Network;
};

/**
 * Абстрактный класс устройства (Device).
 * Представляет базовую логику для всех устройств в системе.
 */
export abstract class Device {
	// Ссылка на сеть, к которой принадлежит устройство
	// Уникальный хэш устройства (идентификатор типа устройства)
	public readonly hash: number;
	// Сырые данные устройства из DEVICES по хэшу
	public readonly rawData: (typeof DEVICES)[keyof typeof DEVICES];

	private _id: number;

	protected readonly $errors: DeviceError;
	protected readonly $ports: DevicePorts;
	protected readonly $props?: DeviceProps = undefined;
	protected readonly $reagents?: DeviceReagent = undefined;
	protected readonly $memory?: StackInterface = undefined;
	protected readonly $slots?: DeviceSlots = undefined;

	/**
	 * Конструктор устройства.
	 * @param network - сеть, к которой принадлежит устройство
	 * @param hash - хэш типа устройства
	 */
	public constructor({ network, hash }: DeviceConstructor) {
		this._id = crc32(uuidv4()); // Генерация уникального ID
		this.hash = hash;
		this.rawData = DEVICES[this.hash]; // Получение данных устройства по хэшу

		this.$errors = new DeviceError({ device: this });
		this.$ports = new DevicePorts({ device: this });
		if (this.rawData === undefined || this.rawData.tags.includes("HasLogic")) {
			this.$props = new DeviceProps({ device: this });
		}
		if (this.rawData === undefined || this.rawData.tags.includes("HasReagent")) {
			this.$reagents = new DeviceReagent({ device: this });
		}
		if (this.rawData === undefined || this.rawData.tags.includes("HasMemory")) {
			this.$memory = new DeviceMemory({ device: this, stack_length: this.rawData?.memorySize ?? 512 });
		}
		if (this.rawData === undefined || this.rawData.tags.includes("HasSlot")) {
			this.$slots = new DeviceSlots({ device: this });
		}

		this.reset(); // Инициализация свойств и ошибок
		this.$props?.forceWrite("PrefabHash", hash); // Установка свойства PrefabHash
		if (this.rawData === undefined) {
			this.$errors.add(
				new Ic10Error({
					message: `Device with hash ${hash} not found`,
					severity: ErrorSeverity.Weak,
				}),
			);
		}
		if (network) {
			network.apply(this);
		}
	}

	get network(): Network {
		return this.$ports.getNetwork();
	}

	get errors(): DeviceError {
		return this.$errors;
	}

	get ports(): DevicePorts {
		return this.$ports;
	}

	get props(): DeviceProps | undefined {
		if (this.$props) {
			return this.$props;
		}
		this.$errors.add(
			new Ic10Error({
				message: `Device has no props`,
				severity: ErrorSeverity.Weak,
			}),
		);
		return undefined;
	}

	get hasProps(): boolean {
		return this.$props !== undefined;
	}

	get reagents(): DeviceReagent | undefined {
		if (this.$reagents) {
			return this.$reagents;
		}
		this.$errors.add(
			new Ic10Error({
				message: `Device has no reagents`,
				severity: ErrorSeverity.Weak,
			}),
		);
		return undefined;
	}
	get hasReagents(): boolean {
		return this.$reagents !== undefined;
	}

	get memory(): StackInterface | undefined {
		if (this.$memory) {
			return this.$memory;
		}
		this.$errors.add(
			new Ic10Error({
				message: `Device has no memory`,
				severity: ErrorSeverity.Weak,
			}),
		);
		return undefined;
	}
	get hasMemory(): boolean {
		return this.$memory !== undefined;
	}

	get slots(): DeviceSlots | undefined {
		if (this.$slots) {
			return this.$slots;
		}
		this.$errors.add(
			new Ic10Error({
				message: `Device has no memory`,
				severity: ErrorSeverity.Weak,
			}),
		);
		return undefined;
	}

	get hasSlots(): boolean {
		if (this.$slots) {
			return true;
		}
		return false;
	}

	/**
	 * Сброс устройства: инициализация свойств, логики и ошибок.
	 */
	public reset() {
		this.$errors.reset(); // Очистка ошибок
		this.$props?.reset(); // сброс свойств
		this.$reagents?.reset(); // сброс свойств
	}

	/**
	 * Геттер уникального идентификатора устройства.
	 */
	public get id(): number {
		return this._id;
	}

	public set id(id: number) {
		this._id = id;
	}
}

// Абстрактные классы-наследники для разных типов устройств
export abstract class Structure extends Device {}
export abstract class Item extends Device {}
export abstract class Entity extends Device {}
