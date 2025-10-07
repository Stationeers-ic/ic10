import type { ContextSwitcher } from "@/Ic10/Context/ContextSwitcher";

export type LineConstructorType = {
	contextSwitcher: ContextSwitcher;
	position: number;
	originalText: string;
};

export abstract class Line {
	public readonly position: number;
	public readonly originalText: string;
	public readonly contextSwitcher: ContextSwitcher;

	public constructor({ contextSwitcher, position, originalText }: LineConstructorType) {
		this.position = position;
		this.originalText = originalText;
		this.contextSwitcher = contextSwitcher;
	}

	public get context() {
		return this.contextSwitcher.context;
	}

	/**
	 * запуск строки
	 */
	abstract run(): void | Promise<void>;

	/**
	 * действие после запуска строки. Обычно перевод каретки на следующий шаг
	 */
	abstract end(): void;
}
