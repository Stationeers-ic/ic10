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

const f = await Bun.file(`${__dirname}/test.ic.yml`).text();

const builder = Builer.from(f);
await builder.init();
while ((await builder.step()) === true) {}
console.log(builder.toYaml(true));
console.log(builder.toYaml(false));

console.table(builder.Runners.get(1).realContext.housing.chip.registers);
