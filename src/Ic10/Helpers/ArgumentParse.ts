import CONSTS, { GROUPED_CONSTS } from "@/Defines/consts";
import type { Context } from "@/Ic10/Context/Context";
import { TypeIc10Error } from "@/Ic10/Errors/Errors";
import { crc32, stringToCode } from "@/Ic10/Helpers/functions";
import type { Argument } from "@/Ic10/Instruction/Helpers/Argument";

// Регулярные выражения для парсинга
export const singleRegister = /^r(?<reg>\d+)$/;
export const recursiveRegister = /^(?<count>r{2,})(?<reg>\d+)$/;
export const singleDevice = /^d(?<reg>\d+)$/;
export const recursiveDevice = /^d(?<count>r+)(?<reg>\d+)$/;
export const singleDeviceWithPort = /^d(?<reg>\d+):(?<port>\d+)$/;
export const recursiveDeviceWithPort = /^d(?<count>r+)(?<reg>\d+):(?<port>\d+)$/;
export const hash = /^HASH\("(?<hash>.+)"\)$/;
export const str = /^STR\("(?<str>.+)"\)$/;

/**
 * Обрабатывает специальные числовые значения JavaScript
 */
export function jsThing(value: number): number {
	if (Object.is(value, -0)) return 0;
	if (Object.is(value, -Infinity)) return Infinity;
	return value;
}

/**
 * Получает константу по имени
 */
export function getConst(argument: Argument, group?: string): number | false {
	if (group === undefined) {
		return argument.text in CONSTS ? CONSTS[argument.text] : false;
	}
	return argument.text in GROUPED_CONSTS[group] ? GROUPED_CONSTS[group][argument.text] : false;
}

/**
 * Парсит аргумент в число, используя все доступные методы парсинга
 */
export function parseArgumentAnyNumber(context: Context, argument: Argument): number | false {
	const parsers = [
		() => parseSimpleNumber(argument.text),
		() => parseHash(argument.text),
		() => parseStr(context, argument),
		() => parseHex(argument.text),
		() => parseBin(argument.text),
		() => getConst(argument),
		() => parseRegister(context, argument),
	];

	for (const parser of parsers) {
		const result = parser();
		if (result !== false) return jsThing(result);
	}

	return false;
}

/**
 * Парсит простое число
 */
function parseSimpleNumber(text: string): number | false {
	const value = parseFloat(text);
	return !Number.isNaN(value) ? value : false;
}

/**
 * Парсит шестнадцатеричное число (начинается с $)
 */
export function parseHex(text: string): number | false {
	return text.startsWith("$") ? parseInt(text.slice(1), 16) : false;
}

/**
 * Парсит двоичное число (начинается с %)
 */
export function parseBin(text: string): number | false {
	return text.startsWith("%") ? parseInt(text.slice(1), 2) : false;
}

/**
 * Парсит хеш-выражение HASH("text")
 */
export function parseHash(text: string): number | false {
	const match = hash.exec(text);
	return match?.groups?.hash ? crc32(match.groups.hash) : false;
}

/**
 * Парсит строковое выражение STR("text")
 */
export function parseStr(context: Context, argument: Argument): number | false {
	const match = str.exec(argument.text);

	if (!match?.groups?.str) return false;

	try {
		return stringToCode(match.groups.str);
	} catch (error) {
		context.addError(
			new TypeIc10Error({
				message: error.message,
			}).setArgument(argument),
		);
		return 0;
	}
}

/**
 * Парсит значение регистра
 */
export function parseRegister(context: Context, argument: Argument): number | false {
	const regNum = getRegister(context, argument.text);
	return regNum !== false ? context.getRegister(regNum) : false;
}

/**
 * Получает номер регистра из текста (с поддержкой рекурсивных ссылок)
 */
export function getRegister(context: Context, text: string): number | false {
	// Прямой регистр (rN)
	const singleMatch = singleRegister.exec(text);
	if (singleMatch) {
		return parseInt(singleMatch.groups?.reg ?? "0", 10);
	}

	// Рекурсивный регистр (rr...rN)
	const recursiveMatch = recursiveRegister.exec(text);
	if (recursiveMatch) {
		return resolveRecursiveReference(context, recursiveMatch, -1);
	}

	return false;
}

/**
 * Получает номер пина устройства из текста
 */
export function getDevicePin(context: Context, text: string): number | false | [number, number] {
	// Специальный случай для db и db:port
	if (text === "db") return -1;

	const dbWithPort = /^db:(?<port>\d+)$/;
	const dbPortMatch = dbWithPort.exec(text);
	if (dbPortMatch) {
		const port = parseInt(dbPortMatch.groups?.port ?? "0", 10);
		return [-1, port];
	}

	// Устройство с портом: dN:port
	const singleWithPortMatch = singleDeviceWithPort.exec(text);
	if (singleWithPortMatch) {
		const pin = parseInt(singleWithPortMatch.groups?.reg ?? "0", 10);
		const port = parseInt(singleWithPortMatch.groups?.port ?? "0", 10);
		return [pin, port];
	}

	// Рекурсивное устройство с портом: dr...rN:port
	const recursiveWithPortMatch = recursiveDeviceWithPort.exec(text);
	if (recursiveWithPortMatch) {
		const pin = resolveRecursiveReference(context, recursiveWithPortMatch);
		const port = parseInt(recursiveWithPortMatch.groups?.port ?? "0", 10);
		return [pin, port];
	}

	// Прямое устройство (dN)
	const singleMatch = singleDevice.exec(text);
	if (singleMatch) {
		return parseInt(singleMatch.groups?.reg ?? "0", 10);
	}

	// Рекурсивное устройство (dr...rN)
	const recursiveMatch = recursiveDevice.exec(text);
	if (recursiveMatch) {
		return resolveRecursiveReference(context, recursiveMatch);
	}

	return false;
}

/**
 * Разрешает рекурсивные ссылки на регистры/устройства
 */
function resolveRecursiveReference(context: Context, match: RegExpExecArray, offeset: number = 0): number {
	const rCount = (match.groups?.count ?? "").length;
	let currentReg = parseInt(match.groups?.reg ?? "0", 10);

	// Цепочка переходов: количество переходов = rCount - 1
	for (let i = 0; i < rCount + offeset; i++) {
		currentReg = context.getRegister(currentReg);
	}

	return currentReg;
}
