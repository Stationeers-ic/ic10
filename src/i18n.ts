import i18next from "i18next";

/**
 * Применяет язык, если перевод уже загружен.
 * @param lng - код языка, например 'en', 'ru'
 * @param data - объект переводов
 * @returns Promise<void>
 */
export async function setLanguage(lng: string, data: Record<string, any>): Promise<void> {
	await i18next.init({
		lng: lng, // if you're using a language detector, do not define the lng option
		debug: false,
		resources: {
			en: {
				translation: data,
			},
		},
	});
	await i18next.changeLanguage(lng);
}

export function t(key: string, params?: Record<string, any>) {
	return i18next.t(key, params) ?? key;
}

export const _ = t;
