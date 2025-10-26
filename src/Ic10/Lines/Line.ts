import { Random } from "@stationeers-ic/exact-ic10-math";
import type { ContextSwitcher } from "@/Ic10/Context/ContextSwitcher";

export type LineConstructorType = {
	contextSwitcher: ContextSwitcher;
	position: number;
	originalText: string;
	comment?: string;
	randomSeed?: number;
};

export abstract class Line {
	public readonly position: number;
	public readonly originalText: string;
	public readonly text: string;
	public readonly contextSwitcher: ContextSwitcher;
	public readonly randomGenerator: Random;
	public comment: string = "";
	public readonly commnetFunctions: RegExpExecArray[];

	public constructor({ contextSwitcher, position, originalText, comment = "", randomSeed }: LineConstructorType) {
		this.position = position;
		this.originalText = originalText;
		this.text = originalText.replace(/#.*$/, "").trim();
		this.contextSwitcher = contextSwitcher;
		this.comment = comment;
		this.commnetFunctions = Array.from(originalText.matchAll(this.regex));
		this.randomGenerator = this.initializeRandomGenerator(randomSeed);
	}
	private regex = /#(?<fn>\w+):(?<arg>[^;]+);/gm;

	public runCommentBeforeRun(): void | Promise<void> {
		for (const match of this.commnetFunctions) {
			if (!match.groups) continue;

			const { fn, arg } = match.groups;
		}
	}
	public runCommentAfterRun(): void | Promise<void> {}

	/**
	 * Инициализирует генератор случайных чисел с учетом приоритета источников:
	 * 1. Явно переданный randomSeed
	 * 2. Значение из комментария в формате "seed:ЧИСЛО"
	 * 3. Позиция линии как fallback-значение
	 */
	private initializeRandomGenerator(randomSeed?: number): Random {
		if (typeof randomSeed !== "undefined") {
			return new Random(randomSeed);
		}

		const seedFromComment = this.extractSeedFromComment(this.comment);
		if (seedFromComment !== null) {
			return new Random(seedFromComment);
		}

		return new Random();
	}

	/**
	 * Извлекает значение сида из комментария используя регулярное выражение.
	 * Возвращает null если значение не найдено или невалидно.
	 */
	private extractSeedFromComment(comment: string): number | null {
		for (const match of this.commnetFunctions) {
			if (!match.groups) continue;

			const { fn, arg } = match.groups;
			if (fn === "seed") {
				const seed = parseInt(arg, 10);
				return Number.isNaN(arg) ? null : seed;
			}
		}
		return null;
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

	toString(customComment?: string): string {
		if (this.comment || customComment) {
			const comment = `${this.comment} ${customComment}`.trim();
			if (this.text) {
				return `${this.text} #${comment}`;
			}
			return `#${comment}`;
		}
		return this.originalText;
	}
}
