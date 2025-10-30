import { beforeAll } from "bun:test"
import { Languages } from "@/Languages"
import i18n from "@/Languages/lang"

beforeAll(async () => {
	await i18n
		.init({
			lng: "en", // язык по умолчанию
			fallbackLng: "en",
			debug: false,
			resources: Languages,
		})
		.then(() => console.log("🟦🟦 Язык загружен 🟦🟦"))
})
