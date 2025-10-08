import { Random } from "exact-ic10-math";
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
	public readonly contextSwitcher: ContextSwitcher;
	public readonly randomGenerator: Random;
	public readonly comment: string;

	public constructor({ contextSwitcher, position, originalText, comment = "", randomSeed }: LineConstructorType) {
		this.position = position;
		this.originalText = originalText;
		this.contextSwitcher = contextSwitcher;
		this.comment = comment;

		this.randomGenerator = this.initializeRandomGenerator(randomSeed);
	}

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

		return new Random(this.position);
	}

	/**
	 * Извлекает значение сида из комментария используя регулярное выражение.
	 * Возвращает null если значение не найдено или невалидно.
	 */
	private extractSeedFromComment(comment: string): number | null {
		const match = comment.match(/seed:(\d+)/);
		const extractedValue = match?.[1];

		if (!extractedValue) {
			return null;
		}

		const seed = parseInt(extractedValue, 10);
		return Number.isNaN(seed) ? null : seed;
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
