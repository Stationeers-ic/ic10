import { writeFile } from "node:fs/promises";
import path from "node:path";
import { toJsonSchema } from "@valibot/to-json-schema";
import { EnvSchema } from "@/Schemas/EnvSchema";

const target = path.join(__dirname, "..", "src", "Schemas", "env.schema.json");
const schema = JSON.stringify(toJsonSchema(EnvSchema, { typeMode: "input" }), null, 2);
await writeFile(target, schema);
