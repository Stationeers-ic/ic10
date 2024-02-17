export abstract class Err extends Error {
	protected constructor(
		message: string,
		public level: "error" | "warn" | "info" | "debug" = "error",
		public lineStart?: number,
		public lineEnd?: number,
		charStart: number = 0,
		charEnd: number = 0,
	) {
		super(message)
	}
}
