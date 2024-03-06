import { DevEnv } from "../DevEnv"
import { Environment, InterpreterIc10 } from "../"
import { icFunction } from "../functions"
import { Err } from "../abstract/Err"

export async function run(code: string, data: { [key: string]: number } = {}): Promise<DevEnv> {
	const mem = new DevEnv(data)
	const a = new InterpreterIc10(mem, code)
	await a.run()
	return mem
}
export async function runCode(code: string, data: { [key: string]: number } = {}): Promise<number> {
	const mem = new DevEnv(data)
	const a = new InterpreterIc10(mem, code)
	await a.run()
	return mem.get("r0")
}

export async function runWithMen(code: string, mem: Environment): Promise<Environment> {
	const a = new InterpreterIc10(mem, code)
	await a.run()
	return mem
}

export async function runFuncJump(
	fn: icFunction,
	args: (string | number)[],
	line: number = 0,
	data: { [key: string]: number } = {},
): Promise<number> {
	const mem = new DevEnv(data)
	mem.setPosition(line)
	await fn(mem, args)
	return mem.getPosition()
}

export async function runThrow(code: string, data: { [key: string]: number } = {}): Promise<Err[]> {
	console.log(code)
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

export async function runFuncWithMem(fn: icFunction, args: (string | number)[], mem: Environment): Promise<number> {
	await fn(mem, args)
	return mem.get("r0")
}

export async function runJal(
	fn: icFunction,
	args: (string | number)[],
	line: number = 0,
	data: { [key: string]: number } = {},
) {
	const mem = new DevEnv(data)
	mem.setPosition(line)
	await fn(mem, args)
	return {
		line: mem.getPosition(),
		r17: mem.get("r17"),
	}
}
