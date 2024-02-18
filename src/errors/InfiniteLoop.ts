import { Err } from "../abstract/Err"
import SyntaxError from "./SyntaxError"

export class InfiniteLoop extends Err {
	constructor(
		message: string,
		public level: "error" | "warn" | "info" | "debug" = "error",
		public lineStart?: number,
		public lineEnd?: number,
		public charStart?: number,
		public charEnd?: number,
	) {
		super(message, level, lineStart, lineEnd, charStart, charEnd)
		this.name = "InfiniteLoop"
	}
}

export default InfiniteLoop
