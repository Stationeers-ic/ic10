import { Logics } from "@/Defines/data";
import type { Context } from "@/Ic10/Context/Context";
import { ErrorSeverity, TypeIc10Error } from "@/Ic10/Errors/Errors";
import { getDevicePin, getRegister, parseArgumentAnyNumber } from "@/Ic10/Helpers/ArgumentParse";
import type { Argument } from "@/Ic10/Instruction/Helpers/Argument";
import type { InstructionArgument } from "@/Ic10/Instruction/Helpers/Instruction";

// Вспомогательные функции для обработки ошибок и проверок
const ErrorHandlers = {
	handleError: (context: Context, argument: Argument, message: string) => {
		context.addError(new TypeIc10Error({ message }).setArgument(argument));
		return 0;
	},

	validateDeviceConnection: (
		context: Context,
		pin: number | [number, number],
		argument: Argument,
	): number | [number, number] => {
		const pins = Array.isArray(pin) ? pin : [pin];

		for (const singlePin of pins) {
			if (!context.isConnectDeviceByPin(singlePin.valueOf())) {
				context.addError(
					new TypeIc10Error({
						message: `Device port ${pin} is not connected`,
						severity: ErrorSeverity.Strong,
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
	deviceProp: {
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

// Основные калькуляторы значений
const ValueCalculators = {
	calculateNumberLike: (context: Context, argument: Argument) => {
		const value = parseArgumentAnyNumber(context, argument);
		return value !== false
			? value
			: ErrorHandlers.handleError(context, argument, "Invalid argument must be number or register or const");
	},

	calculateRegister: (context: Context, argument: Argument) => {
		const reg = getRegister(context, argument.text);
		return reg !== false ? reg : ErrorHandlers.handleError(context, argument, "Invalid argument must be register");
	},

	calculateDevicePin: (context: Context, argument: Argument) => {
		const pin = getDevicePin(context, argument.text);
		if (pin === false) {
			return ErrorHandlers.handleError(context, argument, "Invalid argument must be device port");
		}
		return ErrorHandlers.validateDeviceConnection(context, pin, argument);
	},

	calculateDevicePinOrId: (context: Context, argument: Argument): calculateDevicePinOrIdResult => {
		const pin = getDevicePin(context, argument.text);

		if (pin !== false) {
			const result = ErrorHandlers.validateDeviceConnection(context, pin, argument);
			if (typeof result === "number") {
				return {
					pin: result,
				};
			}
			if (Array.isArray(result)) {
				return {
					pin: result[0],
					port: result[1],
				};
			}
		}

		const value = parseArgumentAnyNumber(context, argument);
		if (value !== false && context.isConnectDeviceById(value)) {
			return {
				id: value,
			};
		}

		return { error: ErrorHandlers.handleError(context, argument, "Invalid argument must be device port or id") };
	},

	calculateDeviceProp: (context: Context, argument: Argument) => {
		if (Logics.hasKey(argument.text)) {
			return Logics.getByKey(argument.text);
		}

		const prop = parseInt(argument.text, 10);
		if (!Number.isNaN(prop)) {
			return prop;
		}

		return ErrorHandlers.handleError(context, argument, "Invalid argument must be valid device Property");
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

	devicePinOrId: (name?: string) => ({
		name,
		...BaseConfigs.device,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateDevicePinOrId(context, argument),
	}),

	deviceProp: (name?: string) => ({
		name,
		...BaseConfigs.deviceProp,
		calculate: (context: Context, argument: Argument) => ValueCalculators.calculateDeviceProp(context, argument),
	}),
} satisfies { [key: string]: (name?: string) => InstructionArgument };
