import i18next from "i18next";
import { Devices, LogicBatchMethod, LogicReagentMode, LogicSlot, Logics, Reagents } from "@/Defines/data";
import type { Context } from "@/Ic10/Context/Context";
import { ErrorSeverity, TypeIc10Error } from "@/Ic10/Errors/Errors";
import { getDevicePin, getRegister, parseArgumentAnyNumber } from "@/Ic10/Helpers/ArgumentParse";
import type { Argument } from "@/Ic10/Instruction/Helpers/Argument";
import type { InstructionArgument } from "@/Ic10/Instruction/Helpers/Instruction";

// Вспомогательные функции для обработки ошибок и проверок
const ErrorHandlers = {
	handleError: (
		context: Context,
		argument: Argument,
		message: string,
		severity: ErrorSeverity = ErrorSeverity.Strong,
	) => {
		context.addError(new TypeIc10Error({ message, severity }).setArgument(argument));
		return 0;
	},

	validateDeviceConnection: (
		context: Context,
		pin: number | [number, number],
		argument: Argument,
		severity: ErrorSeverity = ErrorSeverity.Strong,
	): number | [number, number] => {
		const pins = Array.isArray(pin) ? pin : [pin];

		for (const singlePin of pins) {
			if (!context.isConnectDeviceByPin(singlePin.valueOf())) {
				context.addError(
					new TypeIc10Error({
						message: i18next.t("error.device_pin_not_connected", { pin }),
						severity: severity,
					}).setArgument(argument),
				);
				break;
			}
		}
		return pin;
	},
};

// Базовые конфигурации для разных типов аргументов
const BaseConfigs = {
	numberLike: {
		canBeLabel: true,
		canBeDefine: true,
		canBeConst: true,
		canBeAlias: true,
	},
	register: {
		canBeLabel: false,
		canBeDefine: false,
		canBeConst: false,
		canBeAlias: true,
	},
	device: {
		canBeLabel: false,
		canBeAlias: true,
		canBeConst: false,
		canBeDefine: false,
	},
	Enum: {
		canBeLabel: false,
		canBeAlias: false,
		canBeConst: true,
		canBeDefine: false,
	},
};

export type calculateDevicePinOrIdResult = {
	pin?: number;
	port?: number;
	id?: number;
	error?: number;
};

// Вспомогательные функции для работы с результатами
const ResultHelpers = {
	isValidPinResult: (result: number | [number, number] | number): result is number | [number, number] => {
		return typeof result === "number" || Array.isArray(result);
	},

	isValidIdResult: (result: calculateDevicePinOrIdResult): result is { id: number } => {
		return result.id !== undefined;
	},

	formatPinResult: (pinResult: number | [number, number]): calculateDevicePinOrIdResult => {
		if (Array.isArray(pinResult)) {
			return {
				pin: pinResult[0],
				port: pinResult[1],
			};
		}
		return { pin: pinResult };
	},
};

// Основные калькуляторы значений
const ValueCalculators = {
	calculateNumberLike: (context: Context, argument: Argument) => {
		const value = parseArgumentAnyNumber(context, argument);
		return value !== false
			? value
			: ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_number_or_register_or_const"));
	},

	calculateRegister: (context: Context, argument: Argument) => {
		const reg = getRegister(context, argument.text);
		return reg !== false
			? reg
			: ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_register"));
	},

	calculateDevicePin: (context: Context, argument: Argument) => {
		const pin = getDevicePin(context, argument.text);
		if (pin === false) {
			return ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_device_pin"));
		}
		return ErrorHandlers.validateDeviceConnection(context, pin, argument);
	},

	calculateDeviceId: (context: Context, argument: Argument): calculateDevicePinOrIdResult => {
		const value = parseArgumentAnyNumber(context, argument);
		if (value !== false && context.isConnectDeviceById(value)) {
			return {
				id: value,
			};
		}
		return {
			error: ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_device_id")),
		};
	},

	calculateDevicePinOrId: (context: Context, argument: Argument): calculateDevicePinOrIdResult => {
		// Сначала пробуем обработать как пин устройства
		const pinResult = ValueCalculators.calculateDevicePin(context, argument);

		// Если получили валидный результат для пина (не число с ошибкой)
		if (ResultHelpers.isValidPinResult(pinResult)) {
			return ResultHelpers.formatPinResult(pinResult);
		}

		// Если не сработало как пин, пробуем как ID устройства
		const idResult = ValueCalculators.calculateDeviceId(context, argument);

		// Если получили ID без ошибки
		if (ResultHelpers.isValidIdResult(idResult)) {
			return idResult;
		}

		// Если оба варианта не сработали, возвращаем ошибку
		return {
			error: ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_device_pin_or_id")),
		};
	},

	calculateLogic: (context: Context, argument: Argument) => {
		if (Logics.hasKey(argument.text)) {
			return Logics.getByKey(argument.text);
		}

		const prop = parseArgumentAnyNumber(context, argument);
		if (Logics.hasValue(prop)) {
			return prop;
		}

		return ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_valid_device_property"));
	},

	calculateLogicSlot: (context: Context, argument: Argument) => {
		if (LogicSlot.hasKey(argument.text)) {
			return LogicSlot.getByKey(argument.text);
		}

		const slot = parseArgumentAnyNumber(context, argument);
		if (LogicSlot.hasValue(slot)) {
			return slot;
		}

		return ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_valid_logic_slot"));
	},

	calculateLogicBatchMethod: (context: Context, argument: Argument) => {
		if (LogicBatchMethod.hasKey(argument.text)) {
			return LogicBatchMethod.getByKey(argument.text);
		}

		const method = parseArgumentAnyNumber(context, argument);
		if (LogicBatchMethod.hasValue(method)) {
			return method;
		}

		return ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_valid_logic_batch_method"));
	},
	calculateLogicReagentMode: (context: Context, argument: Argument) => {
		if (LogicReagentMode.hasKey(argument.text)) {
			return LogicReagentMode.getByKey(argument.text);
		}

		const mode = parseArgumentAnyNumber(context, argument);
		if (LogicReagentMode.hasValue(mode)) {
			return mode;
		}

		return ErrorHandlers.handleError(context, argument, i18next.t("error.invalid_argument_valid_logic_reagent_mode"));
	},
	calculateReagentHash: (context: Context, argument: Argument) => {
		const value = parseArgumentAnyNumber(context, argument);
		if (Reagents.hasKey(value)) {
			return value;
		}
		return ErrorHandlers.handleError(
			context,
			argument,
			"error:invalid_argument_valid_reagent_hash",
			ErrorSeverity.Weak,
		);
	},
	calculateDeviceHash: (context: Context, argument: Argument) => {
		const value = parseArgumentAnyNumber(context, argument);
		if (Devices.hasKey(value)) {
			return value;
		}
		return ErrorHandlers.handleError(
			context,
			argument,
			i18next.t("error.invalid_argument_valid_device_hash"),
			ErrorSeverity.Weak,
		);
	},
};

/**
 * Список стандартных аргументов для переиспользования
 */
export const ArgumentCalculators = {
	anyNumber: (name?: string) => ({
		name,
		...BaseConfigs.numberLike,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateNumberLike(context, argument),
	}),

	registerLink: (name?: string) => ({
		name,
		...BaseConfigs.register,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateRegister(context, argument),
	}),

	jumpTarget: (name?: string) => ({
		name,
		...BaseConfigs.numberLike,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateNumberLike(context, argument),
	}),

	devicePin: (name?: string) => ({
		name,
		...BaseConfigs.device,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateDevicePin(context, argument),
	}),

	deviceId: (name?: string) => ({
		name,
		...BaseConfigs.device,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateDeviceId(context, argument),
	}),

	devicePinOrId: (name?: string) => ({
		name,
		...BaseConfigs.device,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateDevicePinOrId(context, argument),
	}),

	logic: (name?: string) => ({
		name,
		...BaseConfigs.Enum,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateLogic(context, argument),
	}),

	logicSlot: (name?: string) => ({
		name,
		...BaseConfigs.Enum,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateLogicSlot(context, argument),
	}),

	logicBatchMethod: (name?: string) => ({
		name,
		...BaseConfigs.Enum,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateLogicBatchMethod(context, argument),
	}),

	logicReagentMode: (name?: string) => ({
		name,
		...BaseConfigs.Enum,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateLogicReagentMode(context, argument),
	}),
	reagentHash: (name?: string) => ({
		name,
		...BaseConfigs.numberLike,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateReagentHash(context, argument),
	}),
	deviceHash: (name?: string) => ({
		name,
		...BaseConfigs.numberLike,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateDeviceHash(context, argument),
	}),
} satisfies { [key: string]: (name?: string) => InstructionArgument };
