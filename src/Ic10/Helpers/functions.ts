import { hashString } from "exact-ic10-math";

export function crc32(str: string) {
	return hashString(str);
}

// Преобразование строки (до 6 ASCII-символов) в числовой код (база 256)
export function stringToCode(str: string): number {
	if (str.length > 6) {
		throw new Error("Максимум 6 символов");
	}

	let code = 0;
	for (let i = 0; i < str.length; i++) {
		const ch = str.charCodeAt(i);
		if (ch > 127) {
			throw new Error("Недопустимый символ: не ASCII");
		}
		code = code * 256 + ch;
	}
	return code;
}

// Преобразование числового кода обратно в строку
export function codeToString(code: number): string {
	if (!Number.isInteger(code) || code < 0) {
		throw new Error("Неверный код");
	}
	if (code === 0) return "";

	const bytes: number[] = [];
	while (code > 0) {
		bytes.push(code % 256);
		code = Math.floor(code / 256);
	}

	if (bytes.length > 6) {
		throw new Error("Код не может быть представлен в 6 символах");
	}

	// Восстанавливаем порядок символов
	let result = "";
	for (let i = bytes.length - 1; i >= 0; i--) {
		const b = bytes[i];
		if (b > 127) {
			// Чтобы вернуть только ASCII символы
			throw new Error("Некорректный распакованный символ");
		}
		result += String.fromCharCode(b);
	}

	return result;
}
