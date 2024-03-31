import type Environment from "./Environment"
import { z } from "zod"

const stop = z.union([
	//!
	z.literal("ERR"),
	z.literal("safeGuard"),
	z.literal("STOP"),
	z.literal("EOF"),
])

export type StopType = z.infer<typeof stop>

export function isStop(key: any): key is StopType {
	return stop.safeParse(key).success
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
