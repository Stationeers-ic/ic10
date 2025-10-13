import i18next from "i18next";
import resources from "@/lang";

// Тип для доступных языков
export type Language = keyof typeof resources;

// Инициализация i18next
i18next
	.init({
		lng: "en", // язык по умолчанию
		fallbackLng: "en",
		debug: true,
		resources,
	})
	.catch(console.error);

export const langs = {
	// Получить текущий язык
	get current(): Language {
		return i18next.language as Language;
	},

	// Сменить язык
	set: async (lng: Language): Promise<void> => {
		if (typeof resources[lng] === "undefined") {
			throw new Error(`${lng} is not supported`);
		}
		await i18next.changeLanguage(lng);
	},

	// Доступ к переводам (опционально)
	t: i18next.t,
};

export default langs;
