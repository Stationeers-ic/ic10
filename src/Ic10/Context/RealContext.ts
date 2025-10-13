import i18next from "i18next";
import type { Device } from "@/Core/Device";
import type { StackInterface } from "@/Core/Stack";
import { LogicBatchMethod, LogicReagentMode, Logics } from "@/Defines/data";
import {
	Context,
	type IDefinesContext,
	type IDevicesByHashAndNameContext,
	type IDevicesByHashContext,
	type IDevicesByIdContext,
	type IDevicesByPinContext,
	type IDevicesReagentContext,
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
					message: i18next.t("error.ra_not_found"),
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
					message: i18next.t("error.register_not_found", { reg }),
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
					message: i18next.t("error.register_not_found", { reg }),
				}),
			);
			return;
		}
		this.chip.registers.set(reg, value);
	}
}

// =============================================
// Вспомогательные методы для работы с устройствами
// =============================================

abstract class DeviceHelpers extends MemoryBase {
	protected createDeviceNotFoundError(identifier: string | number, type: string): RuntimeIc10Error {
		return new RuntimeIc10Error({
			message: i18next.t("error.device_not_found", { identifier, type }),
			line: this.getNextLineIndex(),
			severity: ErrorSeverity.Strong,
		});
	}

	protected createNoSlotsError(identifier: string | number, type: string): RuntimeIc10Error {
		return new RuntimeIc10Error({
			message: i18next.t("error.device_no_slots"),
			line: this.getNextLineIndex(),
			severity: ErrorSeverity.Strong,
		});
	}

	protected clearDeviceStack(device: Device | undefined): void {
		if (device?.memory) {
			device.memory.reset();
		}
	}

	protected getDeviceStack(device: Device | undefined, index: number): number {
		if (device?.memory) {
			return device.memory.get(index);
		}
		return 0;
	}

	protected setDeviceStack(device: Device | undefined, index: number, value: number): void {
		if (device?.memory) {
			device.memory.set(index, value);
		}
	}

	protected getDeviceParameter(device: Device | undefined, prop: number): number {
		if (device?.props) {
			return device.props.read(prop);
		}
		return 0;
	}

	protected setDeviceParameter(device: Device | undefined, prop: number, value: number): void {
		if (device?.props) {
			device.props.write(prop, value);
		}
	}

	protected getDeviceSlotParameter(
		device: Device | undefined,
		slot: number,
		prop: number,
		identifier: string | number,
		type: string,
	): number {
		if (device) {
			if (!device.hasSlots) {
				this.addError(this.createNoSlotsError(identifier, type));
				return 0;
			}
			return device.slots.getSlot(slot).getProp(prop);
		}
		return 0;
	}

	protected calculateBatchResult(values: number[], mode: number): number {
		if (values.length === 0) return 0;

		if (!LogicBatchMethod.hasValue(mode)) {
			this.addError(
				new RuntimeIc10Error({
					message: i18next.t("error.invalid_mode", { mode }),
					line: this.getNextLineIndex(),
					severity: ErrorSeverity.Strong,
				}),
			);
			return 0;
		}

		switch (LogicBatchMethod.getByValue(mode)) {
			case "Average":
				return values.reduce((a, b) => a + b) / values.length;
			case "Maximum":
				return Math.max(...values);
			case "Minimum":
				return Math.min(...values);
			case "Sum":
				return values.reduce((a, b) => a + b);
			default:
				return 0;
		}
	}

	protected getDevicesByHashAndName(deviceHash: number, deviceName: number): Device[] {
		return this.housing.network.devices
			.entries()
			.map(([, device]) => device)
			.toArray()
			.filter((device) => device.hash === deviceHash && device.name.valueOf() === deviceName);
	}

	protected getDevicesByHash(deviceHash: number): Device[] {
		return this.housing.network.devices
			.entries()
			.map(([, device]) => device)
			.toArray()
			.filter((device) => device.hash === deviceHash);
	}
}

// =============================================
// Класс для работы с устройствами по пинам
// =============================================

abstract class DevicesByPinBase extends DeviceHelpers implements IDevicesByPinContext {
	protected getDeviceByPin(pin: number): Device | undefined {
		if (pin < 0) {
			return this.housing;
		} else {
			const device = this.housing.getConnectedDevices(pin);
			if (device) {
				return device;
			}
			this.addError(this.createDeviceNotFoundError(pin, "on pin"));
		}
	}

	override isConnectDeviceByPin(pin: number): boolean {
		if (pin < 0) {
			return true;
		}
		return Boolean(this.housing.getConnectedDevices(pin));
	}

	override getDeviceParameterByPin(pin: number, prop: number): number {
		return this.getDeviceParameter(this.getDeviceByPin(pin), prop);
	}

	override setDeviceParameterByPin(pin: number, prop: number, value: number): void {
		this.setDeviceParameter(this.getDeviceByPin(pin), prop, value);
	}

	override clearDeviceStackByPin(pin: number): void {
		this.clearDeviceStack(this.getDeviceByPin(pin));
	}

	override getDeviceStackByPin(pin: number, index: number): number {
		return this.getDeviceStack(this.getDeviceByPin(pin), index);
	}

	override setDeviceStackByPin(pin: number, index: number, value: number): void {
		this.setDeviceStack(this.getDeviceByPin(pin), index, value);
	}

	override canLoadDeviceParameterByPin(pin: number, prop: number): boolean {
		const device = this.getDeviceByPin(pin);
		return device?.props.canLoad(prop) ?? false;
	}

	override canStoreDeviceParameterByPin(pin: number, prop: number): boolean {
		const device = this.getDeviceByPin(pin);
		return device?.props.canStore(prop) ?? false;
	}

	override getDevicePortChanelByPin(pin: number, port: number, chanel: number): number {
		const device = this.getDeviceByPin(pin);
		return device?.ports.getPortChanel(port, chanel) ?? 0;
	}

	override setDevicePortChanelByPin(pin: number, port: number, chanel: number, value: number): void {
		const device = this.getDeviceByPin(pin);
		device?.ports.setPortChanel(port, chanel, value);
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
		const devices = this.housing.network.devicesByHash(deviceHash);
		const values = devices.map((device) => device.props.read(prop));
		return this.calculateBatchResult(values, mode);
	}

	override deviceBatchWriteByHash(deviceHash: number, prop: number, value: number): void {
		const devices = this.housing.network.devicesByHash(deviceHash);
		devices.forEach((device) => device.props.write(prop, value));
	}

	override deviceSlotBatchReadByHash(deviceHash: number, slot: number, param: number, mode: number): number {
		const devices = this.housing.network.devicesByHash(deviceHash);
		const values = devices
			.filter((device) => device.hasSlots)
			.map((device) => device.slots.getSlot(slot).getProp(param));
		return this.calculateBatchResult(values, mode);
	}
}

abstract class DevicesByHashAndNameBase extends DevicesByHashBase implements IDevicesByHashAndNameContext {
	override deviceBatchReadByHashAndName(deviceHash: number, deviceName: number, param: number, mode: number): number {
		const devices = this.getDevicesByHashAndName(deviceHash, deviceName);
		const values = devices.map((device) => device.props.read(param));
		return this.calculateBatchResult(values, mode);
	}

	override deviceBatchWriteByHashAndName(deviceHash: number, deviceName: number, param: number, value: number): void {
		const devices = this.getDevicesByHashAndName(deviceHash, deviceName);
		devices.forEach((device) => device.props.write(param, value));
	}
}

abstract class DevicesByIdBase extends DevicesByHashAndNameBase implements IDevicesByIdContext {
	override isConnectDeviceById(id: number): boolean {
		const device = this.housing.network.deviceById(id);
		return typeof device !== "undefined";
	}

	protected getDeviceById(id: number): Device | undefined {
		const device = this.housing.network.deviceById(id);
		if (device) {
			return device;
		}
		this.addError(this.createDeviceNotFoundError(id, "with id"));
	}

	override clearDeviceStackById(id: number): void {
		this.clearDeviceStack(this.getDeviceById(id));
	}

	override getDeviceStackById(id: number, index: number): number {
		return this.getDeviceStack(this.getDeviceById(id), index);
	}

	override setDeviceStackById(id: number, index: number, value: number): void {
		this.setDeviceStack(this.getDeviceById(id), index, value);
	}

	override getDeviceParameterById(id: number, prop: number): number {
		return this.getDeviceParameter(this.getDeviceById(id), prop);
	}

	override setDeviceParameterById(id: number, prop: number, value: number): void {
		this.setDeviceParameter(this.getDeviceById(id), prop, value);
	}
}

abstract class DevicesSlotBase extends DevicesByIdBase implements IDevicesSlotContext {
	override getDeviceSlotParameterById(deviceId: number, slot: number, prop: number): number {
		const device = this.getDeviceById(deviceId);
		return this.getDeviceSlotParameter(device, slot, prop, deviceId, "with id");
	}

	override getDeviceSlotParameterByPin(devicePin: number, slot: number, prop: number): number {
		const device = this.getDeviceByPin(devicePin);
		return this.getDeviceSlotParameter(device, slot, prop, devicePin, "on pin");
	}

	override getBatchDeviceSlotParameterByHash(deviceHash: number, slot: number, prop: number, mode: number): number {
		const devices = this.getDevicesByHash(deviceHash);
		const values = devices.map((device) => this.getDeviceSlotParameter(device, slot, prop, device.hash, "on hash"));
		return this.calculateBatchResult(values, mode);
	}

	override getBatchDeviceSlotParameterByHashAndName(
		deviceHash: number,
		deviceName: number,
		slot: number,
		prop: number,
		mode: number,
	): number {
		const devices = this.getDevicesByHashAndName(deviceHash, deviceName);
		const values = devices.map((device) =>
			this.getDeviceSlotParameter(device, slot, prop, device.id, "on hash and name"),
		);
		return this.calculateBatchResult(values, mode);
	}
}

abstract class DevicesReagentBase extends DevicesSlotBase implements IDevicesReagentContext {
	getDeviceReagentByPin(devicePin: number, mode: number, reagent: number): number {
		const device = this.getDeviceByPin(devicePin);
		if (device && LogicReagentMode.hasValue(mode)) {
			return this.getReagent(device, reagent, mode);
		}
		return 0;
	}
	getDeviceReagentById(deviceId: number, mode: number, reagent: number): number {
		const device = this.getDeviceById(deviceId);
		if (device && LogicReagentMode.hasValue(mode)) {
			return this.getReagent(device, reagent, mode);
		}
		return 0;
	}
	private getReagent(device: Device, reagent: number, mode): number {
		switch (LogicReagentMode.getByValue(mode)) {
			case "Contents":
				return device.reagents.get(reagent);
			case "Recipe":
				//TODO: implement
				break;
			case "Required":
				//TODO: implement
				break;
			case "TotalContents": {
				let c = 0;
				for (const reagent of device.reagents) {
					c += reagent.count;
				}
				return c;
			}
		}
		return 0;
	}
}

// =============================================
// Финальный класс RealContext
// =============================================

export class RealContext extends DevicesReagentBase {
	override reset(): void {
		this.$housing.reset();
	}

	override validChip(): boolean {
		const l = this.$housing.chip?.getIc10Code()?.length;
		return typeof l === "number" && l > 0;
	}
}
