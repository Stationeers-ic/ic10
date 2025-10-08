import { Builer } from "@/Envierment/Builder";

const f = await Bun.file(`${__dirname}/ic.env.yml`).text();

const builder = Builer.from(f);
console.log(builder);
