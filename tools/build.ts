const esm = Bun.file("./dist/esm/package.json")
const cjs = Bun.file("./dist/cjs/package.json")

await Bun.write(esm, JSON.stringify({ type: "module" }))
await Bun.write(cjs, JSON.stringify({ type: "commonjs" }))

export {}
