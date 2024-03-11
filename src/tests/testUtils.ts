import DevEnv from "../core/DevEnv"
import { Environment, Err, InterpreterIc10 } from "../"
import { icPartialFunction } from "../functions"

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
	fn: icPartialFunction,
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
	return mem.getErrors()
}

export async function runFunc(
	fn: icPartialFunction,
	args: (string | number)[],
	data: { [key: string]: number } = {},
): Promise<number> {
	const mem = new DevEnv(data)
	await fn(mem, args)
	return mem.get("r0")
}

export async function runFuncWithMem(
	fn: icPartialFunction,
	args: (string | number)[],
	mem: Environment,
): Promise<number> {
	await fn(mem, args)
	return mem.get("r0")
}

export async function runJal(
	fn: icPartialFunction,
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
