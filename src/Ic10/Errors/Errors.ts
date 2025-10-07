// Тип конструктора для ошибок

import type { Device } from "@/Core/Device";
import type { Context } from "@/Ic10/Context/Context";
import { crc32 } from "@/Ic10/Helpers/functions";
import type { Argument } from "@/Ic10/Instruction/Helpers/Argument";
import type { Line } from "@/Ic10/Lines/Line";

export type GameLangErrorConstructorType = {
	message: string;
	code?: string;
	severity?: ErrorSeverity;
	context?: Context;
	line?: number;
	start?: number;
	length?: number;
	originalText?: string;
};

export enum ErrorSeverity {
	Weak = "weak", // Ошибка, которая не влияет на работу программы
	Warning = "warning", // Ошибка, которая может привести к ошибкам в работе программы например не оптимизированный код
	Strong = "strong", // Ошибка не позволяющая работать программы
	Critical = "critical", // Ошибка в работе интерпретатора
}

// Базовый класс для всех ошибок игрового языка
export class Ic10Error extends Error {
	public severity: ErrorSeverity;
	public code: string;
	public line?: number;
	public start?: number;
	public length?: number;
	public originalText?: string;

	constructor({
		message,
		code = "GENERIC_ERROR",
		severity = ErrorSeverity.Warning,
		context,
		line,
		start,
		length,
		originalText,
	}: GameLangErrorConstructorType) {
		super(message);
		this.name = this.constructor.name;
		this.severity = severity;
		this.code = code;
		this._context = context;
		this.line = line;
		this.start = start;
		this.length = length;
		this.originalText = originalText;
		Object.setPrototypeOf(this, new.target.prototype);
	}

	private _device?: Device;

	get device() {
		return this._device;
	}

	private _context?: Context;

	get context() {
		return this._context;
	}

	/**
	 * ID ошибки помогает идентифицировать вне зависимости от контекста,
	 * чтобы избежать дублирования ошибок
	 */
	get id(): number {
		return crc32([this.line, this.start, this.length, this.name, this.code, this.device?.id ?? 0].join("|"));
	}

	get sort(): number {
		return (this.line ?? 0) + (this.start ?? 0);
	}

	get formated_message() {
		const parts: string[] = [];

		// Уровень серьёзности (обязательное поле)
		parts.push(`[${this.severity}]`);

		// Контекст выполнения (если есть)
		if (this.context?.name) {
			parts.push(`(${this.context.name})`);
		}

		// Позиция в коде (если есть данные)
		if (this.line !== undefined) {
			const location = this.start !== undefined ? `${this.line}:${this.start}` : `${this.line}`;
			parts.push(`[${location}]`);
			parts.push(`"${this.originalText}"`);
		}
		if (this.device !== undefined) {
			parts.push(`(device: ${this.device.id})`);
		}

		// Код ошибки (обязательное поле)
		parts.push(`${this.code}:`);

		// Основное сообщение (обязательное поле)
		parts.push(this.message);
		parts.push(this.id.toString(16));

		return parts.join(" ");
	}

	setLine(line: Line) {
		this.line = line.position;
		if (!this.start) {
			this.start = 0;
		}
		if (!this.length) {
			this.length = line.originalText.length;
		}
		if (!this.originalText) {
			this.originalText = line.originalText;
		}
		return this;
	}

	setContext(context: Context) {
		this._context = context;
	}

	setDevice(device: Device) {
		this._device = device;
	}
}

// --- Не возможно продолжить работу---
export class FatalIc10Error extends Ic10Error {
	constructor(params: GameLangErrorConstructorType) {
		super({
			...params,
			line: 0,
			originalText: "",
			length: 0,
			start: 0,
			code: params.code ?? "FATAL_ERROR",
			severity: params.severity ?? ErrorSeverity.Critical,
		});
	}
}

// --- Ошибки синтаксиса ---
export class SyntaxIc10Error extends Ic10Error {
	constructor(params: GameLangErrorConstructorType) {
		super({
			...params,
			code: params.code ?? "SYNTAX_ERROR",
			severity: params.severity ?? ErrorSeverity.Strong,
		});
	}
}

// --- Ошибки парсинга ---
export class DeviceIc10Error extends Ic10Error {}

// --- Ошибки аргументов ---
export class ArgumentIc10Error extends Ic10Error {
	constructor(params: GameLangErrorConstructorType) {
		super({
			...params,
			code: params.code ?? "ARGUMENT_ERROR",
			severity: params.severity ?? ErrorSeverity.Strong,
		});
	}

	public setArgument(arg: Argument) {
		this.start = arg.start;
		this.length = arg.length;
		this.originalText = arg.text;
		return this;
	}
}

// --- Ошибки исполнения ---
export class RuntimeIc10Error extends ArgumentIc10Error {
	constructor(params: GameLangErrorConstructorType) {
		super({
			...params,
			code: params.code ?? "RUNTIME_ERROR",
			severity: params.severity ?? ErrorSeverity.Critical,
		});
	}
}

// --- Прочие ошибки ---
export class TypeIc10Error extends ArgumentIc10Error {
	constructor(params: GameLangErrorConstructorType) {
		super({
			...params,
			code: params.code ?? "TYPE_ERROR",
			severity: params.severity ?? ErrorSeverity.Strong,
		});
	}
}

export class ReferenceIc10Error extends ArgumentIc10Error {
	constructor(params: GameLangErrorConstructorType) {
		super({
			...params,
			code: params.code ?? "REFERENCE_ERROR",
			severity: params.severity ?? ErrorSeverity.Critical,
		});
	}
}
