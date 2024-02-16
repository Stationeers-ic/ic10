import { DevEnv } from "../DevEnv"
import { InterpreterIc10 } from "../main"
import { icFunction } from "../functions"

export async function run(code: string, data: { [key: string]: number } = {}): Promise<number> {
	const mem = new DevEnv(data)
	const a = new InterpreterIc10(mem, code)
	await a.run()
	return mem.get("r0")
}

export async function runFunc(
	fn: icFunction,
	args: (string | number)[],
	data: { [key: string]: number } = {},
): Promise<number> {
	const mem = new DevEnv(data)
	await fn(mem, args)
	return mem.get("r0")
}
