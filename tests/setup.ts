import { beforeAll } from "bun:test";
import i18n from "@/Languages/lang";

beforeAll(async () => {
	await i18n.init().then(() => console.log("🟦🟦 Язык загружен 🟦🟦"));
});
