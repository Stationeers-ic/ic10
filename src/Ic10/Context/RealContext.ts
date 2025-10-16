// RealContext.ts
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
import i18n from "@/Languages/lang";

// =============================================
// Базовый класс с основной логикой выполнения
// =============================================

abstract class ExecutionBase extends Context implements IExecutionContext {
	protected line = 0;
	protected jumps_count = 0;

	override getJumpsCount(): number {
		return this.jumps_count;
	}

	override incrementJumpsCount(): void {
		this.jumps_count += 1;
	}

	override getNextLineIndex(): number {
		return this.line;
	}

	override setNextLineIndex(index?: number, writeRA: boolean = false): void {
		if (writeRA) {
			this.writeReturnAddress();
		}

		this.updateLineIndex(index);
		this.updateLineNumberParameter();
	}

	private writeReturnAddress(): void {
		const originalLine = this.line;
		const raDefine = this.getDefines("ra");

		if (!raDefine?.value) {
			throw new RuntimeIc10Error({
				message: i18n.t("error.ra_not_found"),
				line: originalLine,
			});
		}

		const raValue = parseInt(raDefine.value, 10);
		if (Number.isNaN(raValue)) {
			throw new RuntimeIc10Error({
				message: i18n.t("error.ra_not_found"),
				line: originalLine,
			});
		}

		this.setRegister(raValue, originalLine);
	}

	private updateLineIndex(index?: number): void {
		if (typeof index !== "undefined") {
			this.line = Math.max(0, index);
			this.incrementJumpsCount();
		} else {
			this.line += 1;
		}
	}

	private updateLineNumberParameter(): void {
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
		return this.chip.registers.has(reg);
	}

	override getRegister(reg: number): number {
		if (!this.hasRegister(reg)) {
			this.handleRegisterNotFound(reg);
			return 0;
		}
		return this.chip.registers.get(reg) ?? 0;
	}

	override setRegister(reg: number, value: number): void {
		if (!this.hasRegister(reg)) {
			this.handleRegisterNotFound(reg);
			return;
		}
		this.chip.registers.set(reg, value);
	}

	private handleRegisterNotFound(reg: number): void {
		this.addError(
			new RuntimeIc10Error({
				message: i18n.t("error.register_not_found", { reg }),
			}),
		);
	}
}

// =============================================
// Вспомогательные методы для работы с устройствами
// =============================================

abstract class DeviceHelpers extends MemoryBase {
	protected createDeviceNotFoundError(identifier: string | number, type: string): RuntimeIc10Error {
		return new RuntimeIc10Error({
			message: i18n.t("error.device_not_found", { identifier, type }),
			line: this.getNextLineIndex(),
			severity: ErrorSeverity.Strong,
		});
	}

	protected createNoSlotsError(identifier: string | number, type: string): RuntimeIc10Error {
		return new RuntimeIc10Error({
			message: i18n.t("error.device_no_slots"),
			line: this.getNextLineIndex(),
			severity: ErrorSeverity.Strong,
		});
	}

	protected createSlotNotFoundError(slot: number): RuntimeIc10Error {
		return new RuntimeIc10Error({
			message: i18n.t("error.slot_not_found", { slot }),
			line: this.getNextLineIndex(),
			severity: ErrorSeverity.Strong,
		});
	}

	protected clearDeviceStack(device: Device | undefined): void {
		device?.memory?.reset();
	}

	protected getDeviceStack(device: Device | undefined, index: number): number {
		return device?.memory?.get(index) ?? 0;
	}

	protected setDeviceStack(device: Device | undefined, index: number, value: number): void {
		device?.memory?.set(index, value);
	}

	protected getDeviceParameter(device: Device | undefined, prop: number): number {
		return device?.props?.read(prop) ?? 0;
	}

	protected setDeviceParameter(device: Device | undefined, prop: number, value: number): void {
		device?.props?.write(prop, value);
	}

	protected getDeviceSlotParameter(
		device: Device | undefined,
		slot: number,
		prop: number,
		identifier: string | number,
		type: string,
	): number {
		if (!device) return 0;

		if (!device.hasSlots) {
			this.addError(this.createNoSlotsError(identifier, type));
			return 0;
		}

		const slotDevice = device.slots?.getSlot(slot);
		if (!slotDevice) {
			this.addError(this.createSlotNotFoundError(slot));
			return 0;
		}

		return slotDevice.getProp(prop);
	}

	protected setDeviceSlotParameter(
		device: Device | undefined,
		slot: number,
		prop: number,
		value: number,
		identifier: string | number,
		type: string,
	): void {
		if (!device) return;

		if (!device.hasSlots) {
			this.addError(this.createNoSlotsError(identifier, type));
			return;
		}

		const slotDevice = device.slots?.getSlot(slot);
		if (!slotDevice) {
			this.addError(this.createSlotNotFoundError(slot));
			return;
		}

		slotDevice.setProp(prop, value);
	}

	protected calculateBatchResult(values: number[], mode: number): number {
		if (values.length === 0) return 0;

		if (!LogicBatchMethod.hasValue(mode)) {
			this.addError(
				new RuntimeIc10Error({
					message: i18n.t("error.invalid_mode", { mode }),
					line: this.getNextLineIndex(),
					severity: ErrorSeverity.Strong,
				}),
			);
			return 0;
		}

		const method = LogicBatchMethod.getByValue(mode);
		switch (method) {
			case "Average":
				return values.reduce((sum, value) => sum + value, 0) / values.length;
			case "Maximum":
				return Math.max(...values);
			case "Minimum":
				return Math.min(...values);
			case "Sum":
				return values.reduce((sum, value) => sum + value, 0);
			default:
				return 0;
		}
	}

	protected getDevicesByHashAndName(deviceHash: number, deviceName: number): Device[] {
		return Array.from(this.housing.network.devices).filter(
			(device) => device.hash === deviceHash && device.name.valueOf() === deviceName,
		);
	}

	protected getDevicesByHash(deviceHash: number): Device[] {
		return Array.from(this.housing.network.devices).filter((device) => device.hash === deviceHash);
	}
}

// =============================================
// Класс для работы с устройствами по пинам
// =============================================

abstract class DevicesByPinBase extends DeviceHelpers implements IDevicesByPinContext {
	protected getDeviceByPin(pin: number): Device | undefined {
		if (pin < 0) {
			return this.housing;
		}

		const device = this.housing.getConnectedDevices(pin);
		if (!device) {
			this.addError(this.createDeviceNotFoundError(pin, "on pin"));
		}

		return device;
	}

	override isConnectDeviceByPin(pin: number): boolean {
		return pin < 0 ? true : Boolean(this.housing.getConnectedDevices(pin));
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
		return device?.props?.canLoad(prop) ?? false;
	}

	override canStoreDeviceParameterByPin(pin: number, prop: number): boolean {
		const device = this.getDeviceByPin(pin);
		return device?.props?.canStore(prop) ?? false;
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
	private spValue?: number = undefined;
	override push(value: number): void {
		const spRegister = this.getSpRegister();
		const index = this.getRegister(spRegister);
		this.stack().set(index, value);
		this.setRegister(spRegister, index + 1);
	}

	override pop(): number {
		const spRegister = this.getSpRegister();
		const index = this.getRegister(spRegister) - 1;
		if (index < 0) return 0;
		const value = this.stack().get(index);
		this.setRegister(spRegister, index);
		return value;
	}

	override peek(): number {
		const spRegister = this.getSpRegister();
		const index = this.getRegister(spRegister) - 1;
		if (index < 0) return 0;
		return this.stack().get(index);
	}

	override stack(): StackInterface {
		return this.housing.$memory;
	}

	private getSpRegister(): number {
		if (typeof this.spValue !== "undefined") {
			return this.spValue;
		}
		const spDefine = this.getDefines("sp");

		if (!spDefine?.value) {
			throw new RuntimeIc10Error({
				message: i18n.t("error.sp_not_found"),
			});
		}

		const spValue = parseInt(spDefine.value, 10);
		if (Number.isNaN(spValue)) {
			throw new RuntimeIc10Error({
				message: i18n.t("error.sp_not_found"),
			});
		}
		this.spValue = spValue;
		return this.spValue;
	}
}

// =============================================
// Классы для работы с устройствами по различным критериям
// =============================================

abstract class DevicesByHashBase extends StackBase implements IDevicesByHashContext {
	override deviceBatchReadByHash(deviceHash: number, prop: number, mode: number): number {
		const devices = this.housing.network.devicesByHash(deviceHash);
		const values = devices.map((device) => this.getDeviceParameter(device, prop));
		return this.calculateBatchResult(values, mode);
	}

	override deviceBatchWriteByHash(deviceHash: number, prop: number, value: number): void {
		const devices = this.housing.network.devicesByHash(deviceHash);
		for (const device of devices) {
			this.setDeviceParameter(device, prop, value);
		}
	}

	override deviceSlotBatchReadByHash(deviceHash: number, slot: number, param: number, mode: number): number {
		const devices = this.housing.network.devicesByHash(deviceHash);
		const values = devices
			.filter((device) => device.hasSlots)
			.map((device) => this.getDeviceSlotParameter(device, slot, param, device.hash, "on hash"));
		return this.calculateBatchResult(values, mode);
	}
}

abstract class DevicesByHashAndNameBase extends DevicesByHashBase implements IDevicesByHashAndNameContext {
	override deviceBatchReadByHashAndName(deviceHash: number, deviceName: number, param: number, mode: number): number {
		const devices = this.getDevicesByHashAndName(deviceHash, deviceName);
		const values = devices.map((device) => this.getDeviceParameter(device, param));
		return this.calculateBatchResult(values, mode);
	}

	override deviceBatchWriteByHashAndName(deviceHash: number, deviceName: number, param: number, value: number): void {
		const devices = this.getDevicesByHashAndName(deviceHash, deviceName);
		for (const device of devices) {
			this.setDeviceParameter(device, param, value);
		}
	}
}

abstract class DevicesByIdBase extends DevicesByHashAndNameBase implements IDevicesByIdContext {
	protected getDeviceById(id: number): Device | undefined {
		const device = this.housing.network.deviceById(id);
		if (!device) {
			this.addError(this.createDeviceNotFoundError(id, "with id"));
		}
		return device;
	}

	override isConnectDeviceById(id: number): boolean {
		return Boolean(this.housing.network.deviceById(id));
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
	override setDeviceSlotParameterById(deviceId: number, slot: number, prop: number, value: number): void {
		this.setDeviceSlotParameter(this.getDeviceById(deviceId), slot, prop, value, deviceId, "with id");
	}

	override setDeviceSlotParameterByPin(devicePin: number, slot: number, prop: number, value: number): void {
		this.setDeviceSlotParameter(this.getDeviceByPin(devicePin), slot, prop, value, devicePin, "on pin");
	}

	override setBatchDeviceSlotParameterByHash(deviceHash: number, slot: number, prop: number, value: number): void {
		const devices = this.housing.network.devicesByHash(deviceHash);
		for (const device of devices) {
			this.setDeviceSlotParameter(device, slot, prop, value, device.hash, "on hash");
		}
	}

	override getDeviceSlotParameterById(deviceId: number, slot: number, prop: number): number {
		return this.getDeviceSlotParameter(this.getDeviceById(deviceId), slot, prop, deviceId, "with id");
	}

	override getDeviceSlotParameterByPin(devicePin: number, slot: number, prop: number): number {
		return this.getDeviceSlotParameter(this.getDeviceByPin(devicePin), slot, prop, devicePin, "on pin");
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
	override getDeviceReagentByPin(devicePin: number, mode: number, reagent: number): number {
		const device = this.getDeviceByPin(devicePin);
		return device ? this.getReagent(device, reagent, mode) : 0;
	}

	override getDeviceReagentById(deviceId: number, mode: number, reagent: number): number {
		const device = this.getDeviceById(deviceId);
		return device ? this.getReagent(device, reagent, mode) : 0;
	}

	private getReagent(device: Device, reagent: number, mode: number): number {
		if (!LogicReagentMode.hasValue(mode)) {
			this.addError(
				new RuntimeIc10Error({
					message: i18n.t("error.invalid_reagent_mode", { mode }),
					line: this.getNextLineIndex(),
					severity: ErrorSeverity.Strong,
				}),
			);
			return 0;
		}

		const modeType = LogicReagentMode.getByValue(mode);
		switch (modeType) {
			case "Contents":
				return device.reagents?.get(reagent) ?? 0;
			case "Recipe":
				//TODO: implement
				this.logUnimplementedMode("Recipe");
				return 0;
			case "Required":
				//TODO: implement
				this.logUnimplementedMode("Required");
				return 0;
			case "TotalContents":
				return this.getTotalContents(device);
			default:
				return 0;
		}
	}

	private logUnimplementedMode(mode: string): void {
		this.addError(
			new RuntimeIc10Error({
				message: i18n.t("error.unimplemented_mode", { mode }),
				line: this.getNextLineIndex(),
				severity: ErrorSeverity.Warning,
			}),
		);
	}

	private getTotalContents(device: Device): number {
		if (!device.reagents) return 0;

		let total = 0;
		for (const reagent of device.reagents) {
			total += reagent.count;
		}
		return total;
	}
}

// =============================================
// Финальный класс RealContext
// =============================================

export class RealContext extends DevicesReagentBase {
	override reset(): void {
		this.$housing.reset();
		this.line = 0;
		this.jumps_count = 0;
	}

	override validChip(): boolean {
		const codeLength = this.$housing.chip?.getIc10Code()?.length;
		return typeof codeLength === "number" && codeLength > 0;
	}

	async sleep(seconds: number) {
		return Bun.sleep(seconds * 1000);
	}
	async yield() {
		return Bun.sleep(50);
	}
}
