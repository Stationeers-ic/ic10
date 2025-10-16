import { Builer } from "@/Envierment/Builder";
import { delay } from "@/helpers";

const f = await Bun.file(`${__dirname}/test.ic.yml`).text();

const builder = Builer.from(f);

builder.init();
while ((await builder.step()) === true) {
	await delay(300);
	console.log(builder.toString());
}

console.log(builder.valueOf());
