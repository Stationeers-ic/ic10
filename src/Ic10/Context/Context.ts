import type { Chip } from "@/Core/Chip";
import type { Housing } from "@/Core/Housing";
import type { StackInterface } from "@/Core/Stack";
import { ErrorSeverity, FatalIc10Error, type Ic10Error } from "@/Ic10/Errors/Errors";
import type { Define } from "@/Ic10/Instruction/Helpers/Define";
import type { Line } from "@/Ic10/Lines/Line";

export type ContextConstructor = {
	/** Человекочитаемое имя контекста (для логов/отладки) */
	name: string;
	/** Устройство-владелец (Housing), предоставляющее доступ к сети, чипу и пр. */
	housing: Housing;
};

// =============================================
// Интерфейсы для логических групп
// =============================================

/** Интерфейс для управления выполнением кода */
export interface IExecutionContext {
	/** Получить количество прыжков */
	getJumpsCount(): number;
	/** Увеличить счетчик прыжков */
	incrementJumpsCount(): void;
	/** Получить индекс следующей строки */
	getNextLineIndex(): number;
	/** Установить индекс следующей строки */
	setNextLineIndex(index?: number, writeRA?: boolean): void;
	/** Установить текущую выполняемую строку */
	setExecuteLine(line: Line): void;
}

/** Интерфейс для работы с алиасами и константами */
export interface IDefinesContext {
	/** Проверить наличие Define по имени */
	hasDefines(name: string): boolean;
	/** Установить значение Define */
	setDefines(name: string, value: Define): void;
	/** Получить Define по имени */
	getDefines(name: string): Define | undefined;
}

/** Интерфейс для работы с памятью/регистрами */
export interface IMemoryContext {
	/** Проверить существование регистра */
	hasRegister(reg: number): boolean;
	/** Получить значение регистра */
	getRegister(reg: number): number;
	/** Установить значение регистра */
	setRegister(reg: number, value: number): void;
}

/** Интерфейс для работы с устройствами по пинам */
export interface IDevicesByPinContext {
	/** Проверить подключение устройства к пину */
	isConnectDeviceByPin(pin: number): boolean;
	/** Получить параметр устройства по пину */
	getDeviceParameterByPin(pin: number, prop: number): number;
	/** Установить параметр устройства по пину */
	setDeviceParameterByPin(pin: number, prop: number, value: number): void;
	/** Очистить стек устройства по пину */
	clearDeviceStackByPin(pin: number): void;
	/** Получить значение из стека устройства по пину */
	getDeviceStackByPin(pin: number, index: number): number;
	/** Установить значение в стек устройства по пину */
	setDeviceStackByPin(pin: number, index: number, value: number): void;

	canLoadDeviceParameterByPin(pin: number, prop: number): boolean;
	canStoreDeviceParameterByPin(pin: number, prop: number): boolean;

	getDevicePortChanelByPin(pin: number, port: number, chanel: number): number;
	/** Установить параметр устройства по пину */
	setDevicePortChanelByPin(pin: number, port: number, chanel: number, value: number): void;
}

/** Интерфейс для пакетных операций с устройствами по хэшу */
export interface IDevicesByHashContext {
	/** Пакетное чтение параметра устройства по хэшу */
	deviceBatchReadByHash(deviceHash: number, prop: number, mode: number): number;
	/** Пакетная запись параметра устройства по хэшу */
	deviceBatchWriteByHash(deviceHash: number, prop: number, value: number): void;
	/** Пакетное чтение параметра слота устройства по хэшу */
	deviceSlotBatchReadByHash(deviceHash: number, slot: number, param: number, mode: number): number;
}

/** Интерфейс для пакетных операций с устройствами по хэшу и имени */
export interface IDevicesByHashAndNameContext {
	/** Пакетное чтение параметра устройства по хэшу и имени */
	deviceBatchReadByHashAndName(deviceHash: number, deviceName: number, param: number, mode: number): number;
	/** Пакетная запись параметра устройства по хэшу и имени */
	deviceBatchWriteByHashAndName(deviceHash: number, deviceName: number, param: number, value: number): void;
}

/** Интерфейс для работы со стеком */
export interface IStackContext {
	/** Положить значение в стек */
	push(value: number): void;
	/** Извлечь значение из стека */
	pop(): number;
	/** Посмотреть значение на вершине стека */
	peek(): number;
	/** Получить стек */
	stack(): StackInterface;
}

/** Интерфейс для базовых операций контекста */
export interface IBaseContext {
	/** Полный сброс контекста */
	reset(): void;
	/** Проверить валидность чипа */
	validChip(): boolean;
	/** Собрать ошибки из сети */
	collectErrors(): void;
	/** Добавить ошибку */
	addError(error: Ic10Error): this;

	sleep(seconds: number): Promise<void>;
	yield(): void;
	hcf(): void;
}

export interface IDevicesByIdContext {
	isConnectDeviceById(id: number): boolean;
	clearDeviceStackById(id: number): void;
	getDeviceStackById(id: number, index: number): number;
	setDeviceStackById(id: number, index: number, value): void;
	getDeviceParameterById(id: number, prop: number): number;
	setDeviceParameterById(id: number, prop: number, value: number): void;
}

export interface IDevicesSlotContext {
	getDeviceSlotParameterById(deviceId: number, slot: number, prop: number): number;
	getDeviceSlotParameterByPin(devicePin: number, slot: number, prop: number): number;
	getBatchDeviceSlotParameterByHash(deviceHash: number, slot: number, prop: number, mode: number): number;
	getBatchDeviceSlotParameterByHashAndName(
		deviceHash: number,
		deviceName: number,
		slot: number,
		prop: number,
		mode: number,
	): number;

	setDeviceSlotParameterById(deviceId: number, slot: number, prop: number, value: number): void;
	setDeviceSlotParameterByPin(devicePin: number, slot: number, prop: number, value: number): void;
	setBatchDeviceSlotParameterByHash(deviceHash: number, slot: number, prop: number, value: number): void;
}

export interface IDevicesReagentContext {
	getDeviceReagentByPin(deviceId: number, mode: number, reagent: number): number;
	getDeviceReagentById(devicePin: number, mode: number, reagent: number): number;
}

/**
 * Класс дает простое API для Инструкций с доступом к элементам Network, Housing ...
 */
export abstract class Context
	implements
		IBaseContext,
		IExecutionContext,
		IDefinesContext,
		IMemoryContext,
		IDevicesByPinContext,
		IDevicesByHashContext,
		IDevicesByHashAndNameContext,
		IStackContext,
		IDevicesByIdContext,
		IDevicesSlotContext,
		IDevicesReagentContext
{
	/** Имя контекста (используется в отладке/логировании) */
	public readonly name: string;

	/** Локальный пул ошибок, собранных за итерацию/тик (уникализирован по id) */
	public $errors: Map<number, Ic10Error> = new Map();

	/** Ссылка на устройство-владелец, через которое доступны чип, сеть и т.п. */
	public readonly $housing: Housing;
	public $executeLine?: Line;
	public $criticalError?: Ic10Error = undefined;

	/**
	 * Создает новый контекст.
	 * @param name Имя контекста
	 * @param housing Устройство-владелец, предоставляющее доступ к чипу и сети
	 */
	constructor({ name, housing }: ContextConstructor) {
		this.name = name;
		this.$housing = housing;
	}
	abstract sleep(seconds: number): Promise<void>;
	abstract yield(): void;
	abstract hcf(): void;

	get executeLine(): Line {
		return this.$executeLine!;
	}

	get currentLinePosition(): number {
		return this.$executeLine!.position;
	}

	/**
	 * Возвращает текущий список накопленных ошибок (без дубликатов).
	 * Обратите внимание: ошибки уникализируются по id.
	 */
	get errors() {
		return this.$errors.values().toArray();
	}

	/**
	 * Удобный доступ к чипу, закрепленному за данным Housing.
	 * Предполагается, что чип существует к моменту вызова.
	 */
	public get chip(): Chip {
		return this.$housing.chip!;
	}

	/**
	 * Доступ к Housing для наследников.
	 */
	public get housing() {
		return this.$housing;
	}

	public get network() {
		return this.$housing.network;
	}

	public get criticalError(): Ic10Error | false {
		if (this.$criticalError) {
			return this.$criticalError;
		} else {
			return false;
		}
	}

	// =============================================
	// IBaseContext implementation
	// =============================================

	abstract reset(): void;
	abstract validChip(): boolean;

	public collectErrors(): void {
		this.$housing.network.devices.forEach((device) => {
			device.errors.get().forEach((error: Ic10Error) => {
				if (this.$executeLine) {
					error.setLine(this.$executeLine);
				}
				this.addError(error);
			});
			device.errors.reset();
		});
	}

	public addError(error: Ic10Error): this {
		error.setContext(this);
		if (this.$executeLine) {
			error.setLine(this.$executeLine);
		}
		if (error.device === undefined) {
			error.setDevice(this.housing);
		}
		if (error.severity === ErrorSeverity.Critical) {
			this.$criticalError = error;
		}
		if (!this.$errors.has(error.id)) {
			this.$errors.set(error.id, error);
		}
		return this;
	}

	/**
	 * Возвращает исходный код IC10, загруженный в чип.
	 * Перед получением проверяет валидность чипа. Если чип невалиден,
	 * регистрирует (и, вероятно, выбросит) FatalIc10Error.
	 * @throws FatalIc10Error Когда чип невалиден
	 */
	public getIc10Code(): string {
		if (!this.validChip()) {
			this.addError(new FatalIc10Error({ message: "Chip not valid" }));
		}
		return this.chip.getIc10Code();
	}

	// =============================================
	// IExecutionContext implementation
	// =============================================

	abstract getJumpsCount(): number;
	abstract incrementJumpsCount(): void;
	abstract getNextLineIndex(): number;
	abstract setNextLineIndex(index?: number, writeRA?: boolean): void;

	public setExecuteLine(line: Line): void {
		this.$executeLine = line;
	}

	// =============================================
	// IDefinesContext implementation
	// =============================================

	abstract hasDefines(name: string): boolean;
	abstract setDefines(name: string, value: Define): void;
	abstract getDefines(name: string): Define | undefined;

	// =============================================
	// IMemoryContext implementation
	// =============================================

	abstract hasRegister(reg: number): boolean;
	abstract getRegister(reg: number): number;
	abstract setRegister(reg: number, value: number): void;

	// =============================================
	// IDevicesByPinContext implementation
	// =============================================

	abstract isConnectDeviceByPin(pin: number): boolean;
	abstract getDeviceParameterByPin(pin: number, prop: number): number;
	abstract setDeviceParameterByPin(pin: number, prop: number, value: number): void;
	abstract clearDeviceStackByPin(pin: number): void;
	abstract getDeviceStackByPin(pin: number, index: number): number;
	abstract setDeviceStackByPin(pin: number, index: number, value: number): void;
	abstract canLoadDeviceParameterByPin(pin: number, prop: number): boolean;
	abstract canStoreDeviceParameterByPin(pin: number, prop: number): boolean;
	abstract getDevicePortChanelByPin(pin: number, port: number, chanel: number): number;
	abstract setDevicePortChanelByPin(pin: number, port: number, chanel: number, value: number): void;

	// =============================================
	// IDevicesByIDContext implementation
	// =============================================

	abstract isConnectDeviceById(pin: number): boolean;
	abstract clearDeviceStackById(id: number): void;
	abstract getDeviceStackById(id: number, index: number): number;
	abstract setDeviceStackById(id: number, index: number, value): void;
	abstract getDeviceParameterById(id: number, prop: number): number;
	abstract setDeviceParameterById(id: number, prop: number, value: number): void;

	// =============================================
	// IDevicesSlotContext implementation
	// =============================================
	abstract getDeviceSlotParameterById(deviceId: number, slot: number, prop: number): number;
	abstract getDeviceSlotParameterByPin(deviceId: number, slot: number, prop: number): number;
	abstract getBatchDeviceSlotParameterByHash(deviceHash: number, slot: number, prop: number, mode: number): number;
	abstract getBatchDeviceSlotParameterByHashAndName(
		deviceHash: number,
		deviceName: number,
		slot: number,
		prop: number,
		mode: number,
	): number;
	abstract setDeviceSlotParameterById(deviceId: number, slot: number, prop: number, value: number): void;
	abstract setDeviceSlotParameterByPin(devicePin: number, slot: number, prop: number, value: number): void;
	abstract setBatchDeviceSlotParameterByHash(deviceHash: number, slot: number, prop: number, value: number): void;

	// =============================================
	// IDevicesByHashContext implementation
	// =============================================

	abstract deviceBatchReadByHash(deviceHash: number, prop: number, mode: number): number;
	abstract deviceBatchWriteByHash(deviceHash: number, prop: number, value: number): void;
	abstract deviceSlotBatchReadByHash(deviceHash: number, slot: number, param: number, mode: number): number;

	// =============================================
	// IDevicesByHashAndNameContext implementation
	// =============================================

	abstract deviceBatchReadByHashAndName(deviceHash: number, deviceName: number, param: number, mode: number): number;
	abstract deviceBatchWriteByHashAndName(deviceHash: number, deviceName: number, param: number, value: number): void;

	// =============================================
	// IStackContext implementation
	// =============================================

	abstract push(value: number): void;
	abstract pop(): number;
	abstract peek(): number;
	abstract stack(): StackInterface;

	// =============================================
	// IDevicesReagentContext implementation
	// =============================================
	abstract getDeviceReagentByPin(deviceId: number, mode: number, reagent: number): number;
	abstract getDeviceReagentById(devicePin: number, mode: number, reagent: number): number;
}
