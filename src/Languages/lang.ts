import i18next, { type i18n as I18nInstance } from "i18next";
import resources from "@/Languages";

// Тип для доступных языков
export type Language = keyof typeof resources;

class Lang {
	private static _instance: Lang;
	private instanse: I18nInstance;

	private constructor() {
		this.instanse = i18next.createInstance();
	}

	async init() {
		await this.instanse.init({
			lng: "en", // язык по умолчанию
			fallbackLng: "en",
			debug: typeof __VITE_ENV !== "undefined" && __VITE_ENV === "development",
			resources,
		});
		return this;
	}

	// Singleton instance getter
	public static getInstance(): Lang {
		if (!Lang._instance) {
			Lang._instance = new Lang();
		}
		return Lang._instance;
	}

	// Применить язык
	async setLanguage(lang: Language) {
		await this.instanse.changeLanguage(lang);
	}

	/**
	 * Автоматически применяет язык.
	 * @param userLang - язык пользователя (например, из параметров приложения)
	 */
	async detectLanguage(userLang?: string) {
		let lang: Language = "en";
		if (userLang && resources[userLang as Language]) {
			lang = userLang as Language;
		}
		await this.setLanguage(lang);
	}

	t(...args: Parameters<I18nInstance["t"]>): ReturnType<I18nInstance["t"]> {
		return this.instanse.t(...args);
	}
}

// Экспорт singleton
export const i18n = Lang.getInstance();

export default i18n;
