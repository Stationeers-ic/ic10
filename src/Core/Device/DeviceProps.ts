import type { LogicType } from "@/Core/Device";
import { DeviceScope, type DeviceScopeConstructor } from "@/Core/Device/DeviceScope";
import { Logics } from "@/Defines/data";
import { ErrorSeverity, Ic10Error } from "@/Ic10/Errors/Errors";

type prop = number | string;

export class DeviceProps extends DeviceScope {
	constructor(props: DeviceScopeConstructor) {
		super(props);
		this.initProps();
	}
	// Сырые свойства устройства, хранящиеся по числовым кодам
	#propertiesRaw: Map<number, number> = new Map();
	// Прокси-свойства устройства, доступные по имени или коду
	public logic: Map<
		prop,
		{
			name: string;
			code: number;
			canWrite: boolean;
			canRead: boolean;
		}
	> = new Map();

	public getRaw() {
		return { ...this.#propertiesRaw };
	}

	public reset() {
		this.#propertiesRaw.clear();
	}

	public read(prop: prop): number {
		const l = this.getLogic(prop);
		if (l?.canRead) {
			return this.#propertiesRaw[l.code];
		} else {
			this.scope.errors.add(
				new Ic10Error({
					message: `Device ${this.scope.hash} has not permission to read ${l?.name ?? prop}`,
					severity: ErrorSeverity.Warning,
				}),
			);
			return 0;
		}
	}

	public write(prop: prop, value: number): void {
		const l = this.getLogic(prop);
		if (l?.canWrite) {
			this.#propertiesRaw[l.code] = value;
		} else {
			this.scope.errors.add(
				new Ic10Error({
					message: `Device ${this.scope.hash} has not permission to write ${l?.name ?? prop}`,
					severity: ErrorSeverity.Strong,
				}),
			);
		}
	}

	private getLogic(prop: prop) {
		const l = this.logic.get(prop);
		if (typeof l === "undefined") {
			const a = this.findLogic(prop);
			this.scope.errors.add(
				new Ic10Error({
					message: `Device ${this.scope.hash} has not logic ${a.name}`,
					severity: ErrorSeverity.Warning,
				}),
			);
		}
		return l;
	}

	/**
	 * Принудительно установить значение свойства по имени или коду.
	 * @param prop - имя или код свойства
	 * @param value - значение свойства
	 */
	public forceWrite(prop: prop, value: number) {
		const l = this.getLogic(prop);
		this.#propertiesRaw[l.code] = value;
	}

	/**
	 * Инициализация свойств и логики устройства.
	 * Если устройство не найдено в DEVICES, добавляется предупреждение.
	 */
	public initProps() {
		if (typeof this.scope.rawData === "undefined") {
			// Устройство не найдено
			this.scope.errors.add(
				new Ic10Error({
					message: `Device ${this.scope.hash} not found`,
					severity: ErrorSeverity.Warning,
				}),
			);
			// Добавляем логику по умолчанию для всех LogicType из CONSTS
			for (const [key, _value] of Logics) {
				this.addLogic({
					name: key,
					permissions: ["Read", "Write"],
				});
			}
		} else {
			// Если данные устройства есть, инициализируем логику из rawData
			const l = this.scope.rawData?.logics;
			if (l) {
				l.forEach((logic) => {
					this.addLogic(logic);
				});
			}
		}
	}

	private findLogic(prop: prop): {
		name: string;
		code: number;
	} {
		try {
			if (typeof prop === "string") {
				if (!Logics.hasKey(prop)) {
					throw new Error(`Logic ${prop} not found`);
				}
				return {
					name: prop,
					code: Logics.getByKey(prop),
				};
			}
			if (!Logics.hasValue(prop)) {
				throw new Error(`Logic ${prop} not found`);
			}
			return {
				name: Logics.getByValue(prop), // ключ из найденной записи
				code: prop,
			};
		} catch (e) {
			this.scope.errors.add(
				new Ic10Error({
					message: `Property ${prop} not found`,
					severity: ErrorSeverity.Critical,
				}),
			);
			return {
				name: "",
				code: 0,
			};
		}
	}

	/**
	 * Добавление логики (свойства с правами) в устройство.
	 * @param logic - объект логики с именем и разрешениями
	 */
	private addLogic(logic: LogicType) {
		const code = this.findLogic(logic.name).code;
		if (typeof code !== "undefined") {
			const data = {
				name: logic.name,
				code: code,
				canRead: logic.permissions.includes("Read"),
				canWrite: logic.permissions.includes("Write"),
			};
			// Добавляем логику по имени и по коду для удобства доступа
			this.logic.set(logic.name, data);
			this.logic.set(code, data);
		}
	}

	public canLoad(prop: prop) {
		try {
			const l = this.getLogic(prop);
			return l.canRead;
		} catch (e) {
			return false;
		}
	}

	public canStore(prop: prop) {
		try {
			const l = this.getLogic(prop);
			return l.canWrite;
		} catch (e) {
			return false;
		}
	}
}
