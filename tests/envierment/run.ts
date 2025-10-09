import { Builer } from "@/Envierment/Builder";

const f = await Bun.file(`${__dirname}/test.ic.yml`).text();

const builder = Builer.from(f);
console.log(builder.valueOf());
