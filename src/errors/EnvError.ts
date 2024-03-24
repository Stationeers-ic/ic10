import Err from "../abstract/Err"

export class EnvError extends Err {
	public readonly name: string

	constructor(
		message: string,
		public level: "error" | "warn" | "info" | "debug" = "error",
	) {
		super(message, level)
		this.name = "EnvError"
	}
}

export default EnvError
