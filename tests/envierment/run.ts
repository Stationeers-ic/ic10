import { Builer } from "@/Envierment/Builder";

const f = await Bun.file(`${__dirname}/test.ic.yml`).text();

const builder = Builer.from(f);

await builder.init();
while ((await builder.step()) === true) {
	console.log(builder.toString());
}

console.log(builder.valueOf());
