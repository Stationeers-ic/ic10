import type { LogicType } from "@/Core/Device";
import { DeviceScope, type DeviceScopeConstructor } from "@/Core/Device/DeviceScope";
import { Logics } from "@/Defines/data";
import { BiMap } from "@/helpers";
import { ErrorSeverity, Ic10Error } from "@/Ic10/Errors/Errors";
import i18n from "@/Languages/lang";

type prop = number | string;

interface PropIterator
	extends Iterator<{
		logicName: string;
		logicCode: number;
		canRead: boolean;
		canWrite: boolean;
		value: number;
	}> {
	[Symbol.iterator](): PropIterator;
}

export class DeviceProps extends DeviceScope {
	constructor(props: DeviceScopeConstructor) {
		super(props);
		this.initProps();
	}
	// Сырые свойства устройства, хранящиеся по числовым кодам
	#propertiesRaw: Map<number, number> = new Map();
	// BiMap для связи имени логики с кодом
	private logicNameToCode = new BiMap<string, number>();
	// Метаданные логики (права доступа)
	private logicMeta: Map<
		number,
		{
			canWrite: boolean;
			canRead: boolean;
		}
	> = new Map();

	public getRaw() {
		return Object.fromEntries(this.#propertiesRaw);
	}

	public reset() {
		this.#propertiesRaw.clear();
	}

	public read(prop: prop): number {
		const logicCode = this.resolveLogicCode(prop);
		if (logicCode === undefined) {
			this.scope.errors.add(
				new Ic10Error({
					message: i18n.t("error.device_property_not_found", { hash: this.scope.hash, prop }),
					severity: ErrorSeverity.Warning,
				}),
			);
			return 0;
		}

		const meta = this.logicMeta.get(logicCode);
		if (meta?.canRead) {
			return this.#propertiesRaw.get(logicCode) ?? 0;
		} else {
			const logicName = this.logicNameToCode.getByValue(logicCode) ?? String(prop);
			this.scope.errors.add(
				new Ic10Error({
					message: i18n.t("error.device_no_permission_to_read", {
						hash: this.scope.hash,
						logicName,
					}),
					severity: ErrorSeverity.Warning,
				}),
			);
			return 0;
		}
	}

	public write(prop: prop, value: number): void {
		const logicCode = this.resolveLogicCode(prop);
		if (logicCode === undefined) {
			this.scope.errors.add(
				new Ic10Error({
					message: i18n.t("error.device_property_not_found", { hash: this.scope.hash, prop }),
					severity: ErrorSeverity.Strong,
				}),
			);
			return;
		}

		const meta = this.logicMeta.get(logicCode);
		if (meta?.canWrite) {
			this.#propertiesRaw.set(logicCode, value);
		} else {
			const logicName = this.logicNameToCode.getByValue(logicCode) ?? String(prop);
			this.scope.errors.add(
				new Ic10Error({
					message: i18n.t("error.device_no_permission_to_write", {
						hash: this.scope.hash,
						logicName,
					}),
					severity: ErrorSeverity.Strong,
				}),
			);
		}
	}

	/**
	 * Разрешает prop (имя или код) в код логики
	 */
	private resolveLogicCode(prop: prop): number | undefined {
		if (typeof prop === "number") {
			return this.logicNameToCode.hasValue(prop) ? prop : undefined;
		}
		return this.logicNameToCode.getByKey(prop);
	}

	/**
	 * Принудительно установить значение свойства по имени или коду.
	 * @param prop - имя или код свойства
	 * @param value - значение свойства
	 */
	public forceWrite(prop: prop, value: number) {
		const logicCode = this.resolveLogicCode(prop);
		if (logicCode === undefined) {
			throw new Error(i18n.t("error.logic_not_found_in_global", { prop }));
		}
		this.#propertiesRaw.set(logicCode, value);
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
					message: i18n.t("error.device_not_found_in_init", { hash: this.scope.hash }),
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

	/**
	 * Находит код логики по имени или коду из глобального Logics
	 */
	private findLogicCode(prop: prop): number | undefined {
		if (typeof prop === "string") {
			if (!Logics.hasKey(prop)) {
				this.scope.errors.add(
					new Ic10Error({
						message: i18n.t("error.logic_not_found_in_global", { prop }),
						severity: ErrorSeverity.Critical,
					}),
				);
				return undefined;
			}
			return Logics.getByKey(prop);
		}
		if (!Logics.hasValue(prop)) {
			this.scope.errors.add(
				new Ic10Error({
					message: i18n.t("error.logic_code_not_found_in_global", { prop }),
					severity: ErrorSeverity.Critical,
				}),
			);
			return undefined;
		}
		return prop;
	}

	/**
	 * Добавление логики (свойства с правами) в устройство.
	 * @param logic - объект логики с именем и разрешениями
	 */
	private addLogic(logic: LogicType) {
		const code = this.findLogicCode(logic.name);
		if (code !== undefined) {
			this.logicNameToCode.set(logic.name, code);
			this.logicMeta.set(code, {
				canRead: logic.permissions.includes("Read"),
				canWrite: logic.permissions.includes("Write"),
			});
		}
	}

	public canLoad(prop: prop): boolean {
		const logicCode = this.resolveLogicCode(prop);
		if (logicCode === undefined) return false;
		return this.logicMeta.get(logicCode)?.canRead ?? false;
	}

	public canStore(prop: prop): boolean {
		const logicCode = this.resolveLogicCode(prop);
		if (logicCode === undefined) return false;
		return this.logicMeta.get(logicCode)?.canWrite ?? false;
	}

	[Symbol.iterator](): PropIterator {
		const entries = Array.from(this.#propertiesRaw);
		let i = 0;

		return {
			[Symbol.iterator]() {
				return this;
			},
			next: (): IteratorResult<{
				logicName: string;
				logicCode: number;
				canRead: boolean;
				canWrite: boolean;
				value: number;
			}> => {
				while (i < entries.length) {
					const [logicCode, value] = entries[i++];
					const logicName = this.logicNameToCode.getByValue(logicCode);
					const meta = this.logicMeta.get(logicCode);

					if (logicName && meta) {
						return {
							done: false,
							value: {
								logicName,
								logicCode,
								canRead: meta.canRead,
								canWrite: meta.canWrite,
								value,
							},
						};
					}
				}
				return { value: undefined, done: true };
			},
		};
	}
}
