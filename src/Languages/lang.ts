import i18next from "i18next";

export const i18n = i18next.createInstance();
const oldT = i18n.t;

const newT = (...args: Parameters<typeof i18n.t>): ReturnType<typeof i18n.t> => {
	if (!i18n.isInitialized) {
		return `WARN: init i18n | ${args[0]}` as string;
	}
	return oldT.call(i18n, ...args);
};

// Копируем все свойства, включая бренд
Object.assign(newT, oldT);

i18n.t = newT as typeof i18n.t;

// Экспорт singleton
export default i18n;
