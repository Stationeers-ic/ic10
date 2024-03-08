abstract class Err extends Error {
	protected constructor(
		message: string,
		public level: "error" | "warn" | "info" | "debug" = "error",
		public lineStart?: number,
		public lineEnd?: number,
		public charStart?: number,
		public charEnd?: number,
	) {
		super(message)
	}

	format(): string {
		if (this.lineStart === undefined) return `${this.level}: ${this.message}`
		if (this.charStart === undefined) return `${this.level}: ${this.message} at ${this.lineStart}`
		return `${this.level}: ${this.message} at ${this.lineStart}:${this.charStart + 1}`
	}

	position(): {
		start: { line: number; char: number }
		end: { line: number; char: number }
	} {
		return {
			start: { line: this.lineStart ?? -1, char: this.charStart ?? -1 },
			end: { line: this.lineEnd ?? -1, char: this.charEnd ?? -1 },
		}
	}
}

export default Err
