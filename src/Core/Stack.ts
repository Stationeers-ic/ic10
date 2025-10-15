import { ErrorSeverity, Ic10Error } from "@/Ic10/Errors/Errors";
import i18n from "@/Languages/lang";

export interface StackInterface {
	get(index: number): number;
	set(index: number, value: number): void;
	delete(index: number): void;
	push(value: number): void;
	pop(): number;
	reset(): void;
	get length(): number;
	toArray(): number[];
}

export class Stack implements StackInterface {
	protected readonly $stack: Map<number, number> = new Map();

	constructor(public readonly $stack_length: number = 512) {}

	public get(index: number): number {
		if (index >= this.$stack_length) {
			throw new Ic10Error({
				message: i18n.t("error.stack_access_out_of_bounds", { index }),
				severity: ErrorSeverity.Strong,
			});
		}
		return this.$stack.get(index) ?? 0;
	}

	public set(index: number, value: number): void {
		if (this.$stack.size >= this.$stack_length) {
			throw new Ic10Error({
				message: i18n.t("error.stack_overflow"),
				severity: ErrorSeverity.Strong,
			});
		}
		this.$stack.set(index, value);
	}

	public delete(index: number): void {
		if (this.$stack.has(index)) {
			this.$stack.delete(index);
		}
	}

	public push(value: number): void {
		if (this.$stack.size >= this.$stack_length) {
			throw new Ic10Error({
				message: i18n.t("error.stack_overflow"),
				severity: ErrorSeverity.Strong,
			});
		}
		this.$stack.set(this.$stack.size, value);
	}

	public pop(): number {
		if (this.$stack.size > 0) {
			const value = this.$stack.get(this.$stack.size - 1);
			this.$stack.delete(this.$stack.size - 1);
			return value;
		} else {
			return 0;
		}
	}

	public reset(): void {
		this.$stack.clear();
	}

	get length(): number {
		return this.$stack.size;
	}

	toArray(): number[] {
		// Найти максимальный индекс, который был записан
		const maxIndex = Math.max(...this.$stack.keys(), 0);

		// Собрать значения от 0 до maxIndex
		const arr: number[] = [];
		for (let i = 0; i <= maxIndex; i++) {
			arr.push(this.$stack.get(i) ?? 0);
		}

		// Удалить хвостовые нули
		let lastNonZero = arr.length - 1;
		while (lastNonZero >= 0 && arr[lastNonZero] === 0) {
			lastNonZero--;
		}

		return arr.slice(0, lastNonZero + 1);
	}
}
