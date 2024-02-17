import { Err } from "../abstract/Err.js"

export class BitWarn extends Err {
	constructor(
		message: string,
		level: "error" | "warn" | "info" | "debug" = "warn",
		public lineStart?: number,
		public lineEnd?: number,
		charStart: number = 0,
		charEnd: number = 0,
	) {
		super(message, level, lineStart, lineEnd, charStart, charEnd)
		this.name = "BitWarn"
	}
}
