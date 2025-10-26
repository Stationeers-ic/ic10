import { ValiError } from "valibot";
import { Builer } from "@/Envierment/Builder";
import { Languages } from "@/Languages";
import i18n from "@/Languages/lang";

await i18n
	.init({
		lng: "ru", // язык по умолчанию
		fallbackLng: "en",
		debug: false,
		resources: Languages,
	})
	.then(() => console.log("🟦🟦 Язык загружен 🟦🟦"));

const f = await Bun.file(`${__dirname}/test.ic.json`).text();

try {
	const builder = Builer.from(f);
	await builder.init();
	while ((await builder.step()) === true) {}
	console.log(builder.toJson(true));
} catch (e) {
	if (e instanceof ValiError) {
		console.error(e.message);
	} else {
		console.error(e);
	}
}
// console.table(builder.Runners.get(1).realContext.housing.chip.registers);
