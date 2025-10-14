import type { ChipConstructorType } from "@/Core/Chip";
import { Stack, type StackInterface } from "@/Core/Stack";
import {
	Context,
	type ContextConstructor,
	type IDefinesContext,
	type IDevicesByHashAndNameContext,
	type IDevicesByHashContext,
	type IDevicesByIdContext,
	type IDevicesByPinContext,
	type IDevicesSlotContext,
	type IExecutionContext,
	type IMemoryContext,
} from "@/Ic10/Context/Context";
import type { Ic10Error } from "@/Ic10/Errors/Errors";
import type { Define } from "@/Ic10/Instruction/Helpers/Define";
import { SandBoxHousing } from "@/Ic10/SandBox";

// =============================================
// Базовый класс для выполнения в песочнице
// =============================================

abstract class SandboxExecutionBase extends Context implements IExecutionContext {
	public line = 0;
	private jumps_count = 0;

	constructor(params: Pick<ContextConstructor, "name"> & ChipConstructorType) {
		super({
			name: params.name,
			housing: new SandBoxHousing(params),
		});
	}

	override incrementJumpsCount(): void {
		this.jumps_count = this.jumps_count + 1;
	}

	override getJumpsCount(): number {
		return this.jumps_count;
	}

	override getNextLineIndex(): number {
		return this.line;
	}

	override setNextLineIndex(_index?: number): void {
		this.line = this.line + 1;
		this.incrementJumpsCount();
	}
}

// =============================================
// Класс для работы с определениями в песочнице
// =============================================

abstract class SandboxDefinesBase extends SandboxExecutionBase implements IDefinesContext {
	override hasDefines(name: string): boolean {
		return this.chip.defines.has(name);
	}

	override setDefines(name: string, value: Define): void {
		this.chip.defines.set(name, value);
	}

	override getDefines(name: string): Define | undefined {
		return this.chip.defines.get(name);
	}
}

// =============================================
// Класс для работы с регистрами в песочнице
// =============================================

abstract class SandboxMemoryBase extends SandboxDefinesBase implements IMemoryContext {
	override hasRegister(reg: number): boolean {
		return true;
	}

	override getRegister(reg: number): number {
		return 0;
	}

	override setRegister(reg: number, value: number): void {}
}

// =============================================
// Класс для работы с устройствами по пинам в песочнице
// =============================================

abstract class SandboxDevicesByPinBase extends SandboxMemoryBase implements IDevicesByPinContext {
	override isConnectDeviceByPin(pin: number): boolean {
		return true;
	}

	override getDeviceParameterByPin(pin: number, param: number): number {
		return 0;
	}

	override setDeviceParameterByPin(pin: number, param: number, value: number): void {}

	override clearDeviceStackByPin(pin: number): void {
		// Заглушка для песочницы
	}

	override getDeviceStackByPin(pin: number, index: number): number {
		return 0; // Заглушка для песочницы
	}

	override setDeviceStackByPin(pin: number, index: number, value: number): void {}

	override canLoadDeviceParameterByPin(pin: number, prop: number): boolean {
		return true;
	}
	override canStoreDeviceParameterByPin(pin: number, prop: number): boolean {
		return true;
	}
	override getDevicePortChanelByPin(pin: number, port: number, chanel: number): number {
		return 0;
	}
	override setDevicePortChanelByPin(pin: number, port: number, chanel: number, value: number): void {}
}

// =============================================
// Класс для работы с устройствами по хэшу в песочнице
// =============================================

abstract class SandboxDevicesByHashBase extends SandboxDevicesByPinBase implements IDevicesByHashContext {
	override deviceBatchReadByHash(deviceHash: number, param: number, mode: number): number {
		return 0;
	}

	override deviceBatchWriteByHash(deviceHash: number, param: number, value: number): void {}

	override deviceSlotBatchReadByHash(deviceHash: number, slot: number, param: number, mode: number): number {
		return 0;
	}
}

// =============================================
// Класс для работы с устройствами по хэшу и имени в песочнице
// =============================================

abstract class SandboxDevicesByHashAndNameBase
	extends SandboxDevicesByHashBase
	implements IDevicesByHashAndNameContext
{
	override deviceBatchReadByHashAndName(deviceHash: number, deviceName: number, param: number, mode: number): number {
		return 0;
	}

	override deviceBatchWriteByHashAndName(deviceHash: number, deviceName: number, param: number, value: number): void {}
}

// =============================================
// Класс для работы со стеком в песочнице
// =============================================

abstract class SandboxStackBase extends SandboxDevicesByHashAndNameBase {
	override push(value: number): void {
		// Заглушка для песочницы
	}

	override pop(): number {
		return 0;
	}

	override peek(): number {
		return 0;
	}

	override stack(): StackInterface {
		return new Stack(Infinity);
	}
}

abstract class SandboxDevicesByIdBase extends SandboxStackBase implements IDevicesByIdContext {
	override isConnectDeviceById(id: number): boolean {
		return true;
	}
	override clearDeviceStackById(id: number): void {}
	override getDeviceStackById(id: number, index: number): number {
		return 0;
	}
	override setDeviceStackById(id: number, index: number, value): void {}

	override getDeviceParameterById(id: number, prop: number): number {
		return 0;
	}
	override setDeviceParameterById(id: number, prop: number, value: number): void {}
}

abstract class SandboxDevicesSlotBase extends SandboxDevicesByIdBase implements IDevicesSlotContext {
	override getDeviceSlotParameterById(deviceId: number, slot: number, prop: number): number {
		return 0;
	}
	override getDeviceSlotParameterByPin(deviceId: number, slot: number, prop: number): number {
		return 0;
	}
	override getBatchDeviceSlotParameterByHash(deviceHash: number, slot: number, prop: number, mode: number): number {
		return 0;
	}
	override getBatchDeviceSlotParameterByHashAndName(
		deviceHash: number,
		deviceName: number,
		slot: number,
		prop: number,
		mode: number,
	): number {
		return 0;
	}
	override setDeviceSlotParameterById(deviceId: number, slot: number, prop: number, value: number): void {}
	override setDeviceSlotParameterByPin(devicePin: number, slot: number, prop: number, value: number): void {}
	override setBatchDeviceSlotParameterByHash(deviceHash: number, slot: number, prop: number, value: number): void {}
}

// =============================================
// Финальный класс SandboxContext
// =============================================

export class SandboxContext extends SandboxDevicesSlotBase {
	getDeviceReagentByPin(deviceId: number, mode: number, reagent: number): number {
		return 0;
	}
	getDeviceReagentById(devicePin: number, mode: number, reagent: number): number {
		return 0;
	}
	override reset(): void {
		this.$housing.reset();
	}

	override validChip(): boolean {
		return true;
	}

	public override addError(error: Ic10Error): this {
		error.setContext(this);
		if (!this.$errors.has(error.id)) {
			this.$errors.set(error.id, error);
		}
		return this;
	}
}
