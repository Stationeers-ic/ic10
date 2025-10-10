import type { Device } from "@/Core/Device";
import type { StackInterface } from "@/Core/Stack";
import { LogicBatchMethod, Logics } from "@/Defines/data";
import {
	Context,
	type IDefinesContext,
	type IDevicesByHashAndNameContext,
	type IDevicesByHashContext,
	type IDevicesByIdContext,
	type IDevicesByPinContext,
	type IDevicesSlotContext,
	type IExecutionContext,
	type IMemoryContext,
	type IStackContext,
} from "@/Ic10/Context/Context";
import { ErrorSeverity, RuntimeIc10Error } from "@/Ic10/Errors/Errors";
import type { Define } from "@/Ic10/Instruction/Helpers/Define";

// =============================================
// Базовый класс с основной логикой выполнения
// =============================================

abstract class ExecutionBase extends Context implements IExecutionContext {
	private line = 0;
	private jumps_count = 0;

	override getJumpsCount(): number {
		return this.jumps_count;
	}

	override incrementJumpsCount(): void {
		this.jumps_count = this.jumps_count + 1;
	}

	override getNextLineIndex(): number {
		return this.line;
	}

	override setNextLineIndex(index?: number, writeRA: boolean = false): void {
		if (writeRA) {
			const originalLine = this.line;
			const RA = parseInt(this.getDefines("RA")?.value, 10);
			if (RA && !Number.isNaN(RA)) {
				this.setRegister(RA, originalLine);
			} else {
				throw new RuntimeIc10Error({
					message: `RA not found`,
					line: originalLine,
				});
			}
		}
		if (typeof index !== "undefined") {
			if (index < 0) {
				index = 0;
			}
			this.line = index;
			this.incrementJumpsCount();
		} else {
			this.line = this.line + 1;
		}

		this.setDeviceParameterByPin(-1, Logics.getByKey("LineNumber"), this.line);
	}
}

// =============================================
// Класс для работы с определениями (defines)
// =============================================

abstract class DefinesBase extends ExecutionBase implements IDefinesContext {
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
// Класс для работы с регистрами
// =============================================

abstract class MemoryBase extends DefinesBase implements IMemoryContext {
	override hasRegister(reg: number): boolean {
		reg = reg.valueOf();
		return this.chip.registers.has(reg);
	}

	override getRegister(reg: number): number {
		reg = reg.valueOf();
		if (!this.hasRegister(reg)) {
			this.addError(
				new RuntimeIc10Error({
					message: `Register ${reg} not found`,
				}),
			);
			return 0;
		}
		return this.chip.registers.get(reg) ?? 0;
	}

	override setRegister(reg: number, value: number): void {
		reg = reg.valueOf();
		if (!this.hasRegister(reg)) {
			this.addError(
				new RuntimeIc10Error({
					message: `Register ${reg} not found`,
				}),
			);
			return;
		}
		this.chip.registers.set(reg, value);
	}
}

// =============================================
// Класс для работы с устройствами по пинам
// =============================================

abstract class DevicesByPinBase extends MemoryBase implements IDevicesByPinContext {
	protected getDeviceByPin(pin: number): Device | undefined {
		if (pin < 0) {
			return this.housing;
		} else {
			const deivice = this.housing.getConnectedDevices(pin);
			if (deivice) {
				return deivice;
			}
			this.addError(
				new RuntimeIc10Error({
					message: `Device on pin ${pin} not found`,
					line: this.getNextLineIndex(),
					severity: ErrorSeverity.Strong,
				}),
			);
		}
	}

	override isConnectDeviceByPin(pin: number): boolean {
		if (pin < 0) {
			return true;
		}
		return Boolean(this.housing.getConnectedDevices(pin));
	}

	override getDeviceParameterByPin(pin: number, prop: number): number {
		const device = this.getDeviceByPin(pin);
		if (device) {
			return device.props.read(prop);
		}
		return 0;
	}

	override setDeviceParameterByPin(pin: number, prop: number, value: number): void {
		const device = this.getDeviceByPin(pin);
		if (device) {
			device.props.write(prop, value);
		}
	}

	override clearDeviceStackByPin(pin: number): void {
		const device = this.getDeviceByPin(pin);
		if (device) {
			if (device.memory) {
				device.memory.reset();
			}
		}
	}

	override getDeviceStackByPin(pin: number, index: number): number {
		const device = this.getDeviceByPin(pin);
		if (device) {
			if (device.memory) {
				return device.memory.get(index);
			}
		}
		return 0;
	}

	override setDeviceStackByPin(pin: number, index: number, value: number): void {
		const device = this.getDeviceByPin(pin);
		if (device) {
			if (device.memory) {
				device.memory.set(index, value);
			}
		}
	}
	override canLoadDeviceParameterByPin(pin: number, prop: number): boolean {
		const device = this.getDeviceByPin(pin);
		return device.props.canLoad(prop);
	}
	override canStoreDeviceParameterByPin(pin: number, prop: number): boolean {
		const device = this.getDeviceByPin(pin);
		return device.props.canStore(prop);
	}

	override getDevicePortChanelByPin(pin: number, port: number, chanel: number): number {
		const device = this.getDeviceByPin(pin);
		return device.ports.getPortChanel(port, chanel);
	}
	override setDevicePortChanelByPin(pin: number, port: number, chanel: number, value: number): void {
		const device = this.getDeviceByPin(pin);
		device.ports.setPortChanel(port, chanel, value);
	}
}

// =============================================
// Класс для работы со стеком
// =============================================

abstract class StackBase extends DevicesByPinBase implements IStackContext {
	override push(value: number): void {
		this.stack().push(value);
	}

	override pop(): number {
		const stack = this.stack();
		return stack.length > 0 ? stack.pop()! : 0;
	}

	override peek(): number {
		const stack = this.stack();
		return stack.length > 0 ? stack.get(stack.length - 1) : 0;
	}

	override stack(): StackInterface {
		return this.housing.$memory;
	}
}

abstract class DevicesByHashBase extends StackBase implements IDevicesByHashContext {
	override deviceBatchReadByHash(deviceHash: number, prop: number, mode: number): number {
		if (!LogicBatchMethod.hasValue(mode)) {
			this.addError(
				new RuntimeIc10Error({
					message: `Invalid mode ${mode}`,
					line: this.getNextLineIndex(),
					severity: ErrorSeverity.Strong,
				}),
			);
			return;
		}
		const device = this.housing.network.devicesByHash(deviceHash);
		const values = device.map((device) => device.props.read(prop));
		switch (LogicBatchMethod.getByValue(mode)) {
			case "Average":
				if (values.length > 0) {
					return values.reduce((a, b) => a + b) / values.length;
				}
				break;
			case "Maximum":
				if (values.length > 0) {
					return Math.max(...values);
				}
				break;
			case "Minimum":
				if (values.length > 0) {
					return Math.min(...values);
				}
				break;
			case "Sum":
				if (values.length > 0) {
					return values.reduce((a, b) => a + b);
				}
				break;
		}
		return 0;
	}

	override deviceBatchWriteByHash(deviceHash: number, prop: number, value: number): void {
		throw new Error("Method not implemented.");
	}

	override deviceSlotBatchReadByHash(deviceHash: number, slot: number, param: number, mode: number): number {
		throw new Error("Method not implemented.");
	}
}

abstract class DevicesByHashAndNameBase extends DevicesByHashBase implements IDevicesByHashAndNameContext {
	override deviceBatchReadByHashAndName(deviceHash: number, deviceName: number, param: number, mode: number): number {
		throw new Error("Method not implemented.");
	}

	override deviceBatchWriteByHashAndName(deviceHash: number, deviceName: number, param: number, value: number): void {
		throw new Error("Method not implemented.");
	}
}

abstract class DevicesByIdBase extends DevicesByHashAndNameBase implements IDevicesByIdContext {
	override isConnectDeviceById(id: number): boolean {
		const deivice = this.housing.network.deviceById(id);
		return typeof deivice !== "undefined";
	}

	protected getDeviceById(id: number): Device | undefined {
		const deivice = this.housing.network.deviceById(id);
		if (deivice) {
			return deivice;
		}
		this.addError(
			new RuntimeIc10Error({
				message: `Device with id ${id} not found`,
				line: this.getNextLineIndex(),
				severity: ErrorSeverity.Strong,
			}),
		);
	}

	override clearDeviceStackById(id: number): void {
		const device = this.getDeviceById(id);
		if (device) {
			if (device.memory) {
				device.memory.reset();
			}
		}
	}
	override getDeviceStackById(id: number, index: number): number {
		const device = this.getDeviceById(id);
		if (device) {
			if (device.memory) {
				return device.memory.get(index);
			}
		}
	}
	override setDeviceStackById(id: number, index: number, value): void {
		const device = this.getDeviceById(id);
		if (device) {
			if (device.memory) {
				device.memory.set(index, value);
			}
		}
	}
	override getDeviceParameterById(id: number, prop: number): number {
		const device = this.getDeviceById(id);
		if (device) {
			if (device.props) {
				return device.props.read(prop);
			}
		}
	}
	override setDeviceParameterById(id: number, prop: number, value: number): void {
		const device = this.getDeviceById(id);
		if (device) {
			if (device.props) {
				device.props.write(prop, value);
			}
		}
	}
}

abstract class DevicesSlotBase extends DevicesByIdBase implements IDevicesSlotContext {
	override getDeviceSlotParameterById(deviceId: number, slot: number, prop: number): number {
		const deivice = this.getDeviceById(deviceId);
		if (deivice) {
			if (!deivice.hasSlots) {
				this.addError(
					new RuntimeIc10Error({
						message: `Device with id ${deviceId} has no slots`,
						line: this.getNextLineIndex(),
						severity: ErrorSeverity.Strong,
					}),
				);
			}
			return deivice.slots.getSlot(slot).getProp(prop);
		}
	}
	override getDeviceSlotParameterByPin(devicePin: number, slot: number, prop: number): number {
		const deivice = this.getDeviceByPin(devicePin);
		if (deivice) {
			if (!deivice.hasSlots) {
				this.addError(
					new RuntimeIc10Error({
						message: `Device on pin ${devicePin} has no slots`,
						line: this.getNextLineIndex(),
						severity: ErrorSeverity.Strong,
					}),
				);
			}
			return deivice.slots.getSlot(slot).getProp(prop);
		}
	}
}

// =============================================
// Финальный класс RealContext
// =============================================

export class RealContext extends DevicesSlotBase {
	override reset(): void {
		this.$housing.reset();
	}

	override validChip(): boolean {
		const l = this.$housing.chip?.getIc10Code()?.length;
		return typeof l === "number" && l > 0;
	}
}
