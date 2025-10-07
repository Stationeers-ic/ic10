import { DeviceScope } from "@/Core/Device/DeviceScope";
import type { Ic10Error } from "@/Ic10/Errors/Errors";

export class DeviceError extends DeviceScope {
	protected $errors: Map<number, Ic10Error> = new Map();

	/**
	 * Геттер массива ошибок устройства.
	 */
	public get(): Ic10Error[] {
		// Преобразование Map в массив
		return this.$errors.values().toArray();
	}

	/**
	 * Очистка всех ошибок устройства.
	 */
	public reset(): void {
		this.$errors.clear();
	}

	/**
	 * Добавление ошибки к устройству.
	 * @param error - объект ошибки
	 */
	public add(error: Ic10Error): void {
		error.setDevice(this.scope); // Связываем ошибку с устройством
		this.$errors.set(error.id, error);
	}
}
