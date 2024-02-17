import { DevEnv } from "../DevEnv"
import { InterpreterIc10 } from "../main"
import { icFunction } from "../functions"
import { Err } from "../abstract/Err"

export async function run(code: string, data: { [key: string]: number } = {}): Promise<DevEnv> {
	const mem = new DevEnv(data)
	const a = new InterpreterIc10(mem, code)
	await a.run()
	return mem
}

export async function runThrow(code: string, data: { [key: string]: number } = {}): Promise<Err[]> {
	const mem = new DevEnv(data)
	const a = new InterpreterIc10(mem, code)
	await a.run()
	return mem.errors
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
