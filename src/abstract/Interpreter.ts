import type Environment from "./Environment"

enum stop {
	"ERR",
	"safeGuard",
	"STOP",
	"EOF",
}

export type StopType = keyof typeof stop

export function isStop(key: any): key is StopType {
	return Object.values(stop).includes(key)
}

export abstract class Interpreter {
	public abstract setCode(code: string): this

	public abstract getCode(): string

	public abstract setEnv(env: Environment): this

	public abstract getEnv(): Environment

	public abstract parseCode(): this

	public abstract step(): Promise<StopType | boolean>

	public abstract run(): Promise<StopType>

	public abstract stop(): this | Promise<this>
}

export default Interpreter
