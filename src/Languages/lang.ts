import i18next, { type i18n as I18nInstance } from "i18next";

class Lang {
	private static _instance: Lang;
	private instanse: I18nInstance;

	private constructor() {
		this.instanse = i18next.createInstance();
	}

	async init(...args: Parameters<I18nInstance["init"]>): ReturnType<I18nInstance["init"]> {
		return this.instanse.init(...args);
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
		if (!this.instanse.isInitialized) {
			return `WARN: init i18n | ${args[0]}` as string;
		}
		return this.instanse.t(...args);
	}
}

// Экспорт singleton
export const i18n = Lang.getInstance();

export default i18n;
