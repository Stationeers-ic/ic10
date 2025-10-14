import { ItemEntity } from "@/Core/Device/DeviceSlots";
import { type LogicBatchMethodType, type LogicConstType, Logics, Reagents } from "@/Defines/data";
import { StructureAutolathe } from "@/Devices/StructureAutolathe";
import { StructureConsole } from "@/Devices/StructureConsole";
import { StructureConsoleLed1x2 } from "@/Devices/StructureConsoleLed1x2";
import { HashString } from "@/helpers";
import { ArgumentIc10Error } from "@/Ic10/Errors/Errors";
import {
	ArgumentCalculators,
	type calculateDevicePinOrIdResult,
	type ValueCalculators,
} from "@/Ic10/Instruction/Helpers/ArgumentCalculators";
import {
	Instruction,
	type InstructionArgument,
	type InstructionTestData,
} from "@/Ic10/Instruction/Helpers/Instruction";
import i18n from "@/Languages/lang";

export class SInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: "s db Setting 5",
				expected: [
					{
						type: "device",
						pin: -1,
						prop: 12,
						value: 5,
					},
				],
			},
			{
				title: "alias",
				code: "alias test db\ns test Setting 50",
				expected: [
					{
						type: "device",
						pin: -1,
						prop: 12,
						value: 50,
					},
				],
			},
		];
	}

	override run(): void {
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("device");
		const prop = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const value = this.getArgumentValue<number>("value");
		if (device.pin !== undefined && device.port !== undefined) {
			this.context.setDevicePortChanelByPin(device.pin, device.port, prop, value);
			return;
		}
		if (device.pin !== undefined) {
			this.context.setDeviceParameterByPin(device.pin, prop, value);
			return;
		}
		if (device.id !== undefined) {
			this.context.setDeviceParameterById(device.id, prop, value);
		}
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.devicePinOrId("device"),
			ArgumentCalculators.logic("logic"),
			ArgumentCalculators.anyNumber("value"),
		];
	}
}

export class LInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["s db Setting 5", "l r0 db Setting"],
				expected: [{ type: "register", register: 0, value: 5 }],
			},
			{
				title: "alias",
				code: ["alias test db", "s test Setting 5", "l r0 test Setting"],
				expected: [{ type: "register", register: 0, value: 5 }],
			},
			{
				title: "Channel",
				code: ["s db:0 Channel4 15", "l r1 db:0 Channel4"],
				expected: [{ type: "register", register: 1, value: 15 }],
			},
		];
	}

	override run(): void {
		const result = this.getArgumentValue<number>("result");
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("device");
		const prop = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		let v: number;

		if (device.pin !== undefined && device.port !== undefined) {
			v = this.context.getDevicePortChanelByPin(device.pin, device.port, prop);
			this.context.setRegister(result, v);
			return;
		}
		if (device.pin !== undefined) {
			v = this.context.getDeviceParameterByPin(device.pin, prop);
			this.context.setRegister(result, v);
			return;
		}
		if (device.id !== undefined) {
			v = this.context.getDeviceParameterById(device.id, prop);
			this.context.setRegister(result, v);
		}
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.devicePinOrId("device"),
			ArgumentCalculators.logic("logic"),
		];
	}
}

export class SdInstruction extends Instruction {
	override run(): void {
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("device");
		const prop = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const value = this.getArgumentValue<number>("value");
		if (device.pin !== undefined && device.port !== undefined) {
			throw new ArgumentIc10Error({
				message: i18n.t("error.channels_not_allowed_in_instruction"),
			}).setArgument(this.args[1]);
		}
		if (device.pin !== undefined) {
			throw new ArgumentIc10Error({
				message: i18n.t("error.pin_not_allowed_in_instruction"),
			}).setArgument(this.args[1]);
		}
		if (device.id !== undefined) {
			this.context.setDeviceParameterById(device.id, prop, value);
		}
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.devicePinOrId("device"),
			ArgumentCalculators.logic("logic"),
			ArgumentCalculators.anyNumber("value"),
		];
	}
}

export class LdInstruction extends Instruction {
	override run(): void {
		const result = this.getArgumentValue<number>("result");
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("device");
		const prop = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		let v: number;

		if (device.pin !== undefined && device.port !== undefined) {
			throw new ArgumentIc10Error({
				message: i18n.t("error.channels_not_allowed_in_instruction"),
			}).setArgument(this.args[1]);
		}
		if (device.pin !== undefined) {
			throw new ArgumentIc10Error({
				message: i18n.t("error.pin_not_allowed_in_instruction"),
			}).setArgument(this.args[1]);
		}
		if (device.id !== undefined) {
			v = this.context.getDeviceParameterById(device.id, prop);
			this.context.setRegister(result, v);
		}
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.devicePinOrId("device"),
			ArgumentCalculators.logic("logic"),
		];
	}
}

export class ClrInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["push 1", "clr db"],
				expected: [{ type: "stack", index: 0, value: 0 }],
			},
		];
	}

	override run(): void {
		const r = this.getArgumentValue<number>("device");
		this.context.clearDeviceStackByPin(r);
	}

	public argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.devicePin("device")];
	}
}

export class GetInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["push 99", "get r0 db 0"],
				iterations_count: 2,
				expected: [
					{
						type: "register",
						register: 0,
						value: 99,
					},
				],
			},
		];
	}

	override run(): void {
		const pin = this.getArgumentValue<number>("device");
		const address = this.getArgumentValue<number>("address");
		const value = this.context.getDeviceStackByPin(pin, address);
		this.context.setRegister(this.getArgumentValue<number>("result"), value);
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.devicePin("device"),
			ArgumentCalculators.anyNumber("address"),
		];
	}
}

export class PutInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["push 99", "put db 0 50"],
				expected: [
					{
						type: "stack",
						index: 0,
						value: 50,
					},
				],
			},
		];
	}

	public run(): void | Promise<void> {
		const pin = this.getArgumentValue<number>("device");
		const address = this.getArgumentValue<number>("address");
		const value = this.getArgumentValue<number>("value");
		this.context.setDeviceStackByPin(pin, address, value);
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.devicePin("device"),
			ArgumentCalculators.anyNumber("address"),
			ArgumentCalculators.anyNumber("value"),
		];
	}
}

export class GetdInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["push 99", "getd r0 0 0"],
				iterations_count: 2,
				expected: [
					{
						type: "register",
						register: 0,
						value: 99,
					},
				],
			},
		];
	}

	override run(): void {
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("deviceid");
		const address = this.getArgumentValue<number>("address");
		const result = this.getArgumentValue<number>("result");
		this.context.setRegister(result, this.context.getDeviceStackById(device.id, address));
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.deviceId("deviceid"),
			ArgumentCalculators.anyNumber("address"),
		];
	}
}

export class PutdInstruction extends Instruction {
	//"putd id(r?|id) address(r?|num) value(r?|num)
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["putd 0 0 100"],
				expected: [
					{
						type: "stack",
						index: 0,
						value: 100,
					},
				],
			},
		];
	}

	override run(): void {
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("deviceid");
		const address = this.getArgumentValue<number>("address");
		const value = this.getArgumentValue<number>("value");
		this.context.setDeviceStackById(device.id, address, value);
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.deviceId("deviceid"),
			ArgumentCalculators.anyNumber("address"),
			ArgumentCalculators.anyNumber("value"),
		];
	}
}

export class BdnvlInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: "bdnvl db Setting 4\n\n\n\n",
				iterations_count: 2,
				expected: [
					{
						type: "loop",
						nextLineIndex: 2,
					},
				],
			},
			{
				code: "bdnvl db Color 4\n\n\n\n",
				iterations_count: 2,
				expected: [
					{
						type: "loop",
						nextLineIndex: 2,
					},
				],
			},
		];
	}

	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.devicePin("device"),
			ArgumentCalculators.anyNumber("logic"),
			ArgumentCalculators.jumpTarget("target"),
		];
	}

	override run(): void {
		const devicePin = this.getArgumentValue<number>("device");
		const logic = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const target = this.getArgumentValue<number>("target");
		if (this.context.canLoadDeviceParameterByPin(devicePin, logic)) {
			this.context.setNextLineIndex(target);
		}
	}
}
export class BdnvsInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: "bdnvs db Setting 4\n\n\n\n",
				iterations_count: 2,
				expected: [
					{
						type: "loop",
						nextLineIndex: 5,
					},
				],
			},
			{
				code: "bdnvs db Color 4\n\n\n\n",
				iterations_count: 2,
				expected: [
					{
						type: "loop",
						nextLineIndex: 2,
					},
				],
			},
		];
	}

	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.devicePin("device"),
			ArgumentCalculators.logic("logic"),
			ArgumentCalculators.jumpTarget("target"),
		];
	}

	override run(): void {
		const devicePin = this.getArgumentValue<number>("device");
		const logic = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const target = this.getArgumentValue<number>("target");
		if (this.context.canStoreDeviceParameterByPin(devicePin, logic)) {
			this.context.setNextLineIndex(target);
		}
	}
}

export class ClrdInstruction extends Instruction {
	override run(): void {
		const r = this.getArgumentValue<number>("deviceId");
		this.context.clearDeviceStackById(r);
	}

	public argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.anyNumber("deviceId")];
	}
}

export class LsInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: ["ls r0 db 0 Quantity"],
				expected: [
					{
						type: "register",
						register: 0,
						value: 1,
					},
				],
			},
		];
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.devicePinOrId("deviceId"),
			ArgumentCalculators.anyNumber("slotIndex"),
			ArgumentCalculators.logicSlot("logicSlotType"),
		];
	}

	override run(): void {
		const result = this.getArgumentValue<number>("result");
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("deviceId");
		const slotIndex = this.getArgumentValue<number>("slotIndex");
		const logicSlotType = this.getArgumentValue<number>("logicSlotType");

		let output = 0;
		if (device.pin !== undefined && device.port !== undefined) {
			this.context.addError(
				new ArgumentIc10Error({
					message: i18n.t("error.channels_not_allowed_in_instruction"),
				}).setArgument(this.args[1]),
			);
			return;
		}
		if (device.pin !== undefined) {
			output = this.context.getDeviceSlotParameterByPin(device.pin, slotIndex, logicSlotType);
			this.context.setRegister(result, output);
			return;
		}
		if (device.id !== undefined) {
			output = this.context.getDeviceSlotParameterById(device.id, slotIndex, logicSlotType);
			this.context.setRegister(result, output);
			return;
		}
	}
}
export class lbnInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		const name = new HashString("a1");

		const d1 = new StructureConsole({ name: "a1" });
		d1.props.forceWrite("Setting", 4);
		const d2 = new StructureConsole({ name: "a1" });
		d2.props.forceWrite("Setting", 6);
		const d3 = new StructureConsole({ name: "a2" });
		d3.props.forceWrite("Setting", 6);

		const devices = [
			{ id: 1, device: d1 },
			{ id: 2, device: d2 },
			{ id: 3, device: d3 },
		];

		const values = [4, 6];
		const sum = values[0] + values[1];
		const max = Math.max(...values);
		const min = Math.min(...values);
		const avg = sum / values.length;

		const makeTest = (register: number, operation: string, expectedValue: number): InstructionTestData => ({
			devices,
			code: [`lbn r${register} 235638270 HASH("a1") Setting ${operation}`],
			expected: [{ type: "register", register, value: expectedValue }],
		});

		return [
			makeTest(0, "Sum", sum),
			makeTest(0, "Maximum", max),
			makeTest(0, "Minimum", min),
			makeTest(3, "Average", avg),
		];
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.deviceHash("deviceHash"),
			ArgumentCalculators.anyNumber("deviceName"),
			ArgumentCalculators.logic("logic"),
			ArgumentCalculators.logicBatchMethod("mode"),
		];
	}

	override run(): void {
		const result = this.getArgumentValue<number>("result");
		const deviceHash = this.getArgumentValue<number>("deviceHash");
		const deviceName = this.getArgumentValue<number>("deviceName");
		const logic = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const mode = this.getArgumentValue<number>("mode");

		const value = this.context.deviceBatchReadByHashAndName(deviceHash, deviceName, logic, mode);

		this.context.setRegister(result, value);
	}
}

export class SbnInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		const d1 = new StructureConsoleLed1x2({ name: "a1" });
		d1.props.forceWrite("Setting", 4);
		const d2 = new StructureConsoleLed1x2({ name: "a1" });
		d2.props.forceWrite("Setting", 5);
		const d3 = new StructureConsole({ name: "a2" });
		d3.props.forceWrite("Setting", 6);

		const devices = [
			{ id: 1, device: d1, pin: 1 },
			{ id: 2, device: d2, pin: 2 },
			{ id: 3, device: d3, pin: 3 },
		];
		const s = Logics.getByKey("Setting");
		return [
			{
				devices,
				code: ['sbn -53151617 HASH("a1") Setting 10'],
				expected: [
					{
						type: "device",
						pin: 1,
						prop: s,
						value: 10,
					},
					{
						type: "device",
						pin: 2,
						prop: s,
						value: 10,
					},
					{
						type: "device",
						pin: 3,
						prop: s,
						value: 6,
					},
				],
			},
		];
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.deviceHash("deviceHash"),
			ArgumentCalculators.anyNumber("deviceName"),
			ArgumentCalculators.logic("logic"),
			ArgumentCalculators.anyNumber("value"),
		];
	}

	override run(): void {
		const deviceHash = this.getArgumentValue<number>("deviceHash");
		const deviceName = this.getArgumentValue<number>("deviceName");
		const logic = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const value = this.getArgumentValue<number>("value");

		this.context.deviceBatchWriteByHashAndName(deviceHash, deviceName, logic, value);
	}
}

export class LbnsInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		const name = new HashString("a1");
		const item1 = new ItemEntity(1, 4);
		const item2 = new ItemEntity(1, 6);
		const d1 = new StructureConsole({ name: "a1" });
		d1.slots.getSlot(0).putItem(item1);
		const d2 = new StructureConsole({ name: "a1" });
		d2.slots.getSlot(0).putItem(item2);

		const devices = [
			{ id: 1, device: d1 },
			{ id: 2, device: d2 },
		];

		const values = [4, 6];
		const sum = values[0] + values[1];
		const max = Math.max(...values);
		const min = Math.min(...values);
		const avg = sum / values.length;

		const makeTest = (register: number, operation: string, expectedValue: number): InstructionTestData => ({
			devices,
			code: [`lbns r${register} 235638270 HASH("a1") 0 Quantity ${operation}`],
			expected: [{ type: "register", register, value: expectedValue }],
		});

		return [
			makeTest(0, "Sum", sum),
			makeTest(0, "Maximum", max),
			makeTest(0, "Minimum", min),
			makeTest(3, "Average", avg),
		];
	}

	public run(): void | Promise<void> {
		const result = this.getArgumentValue<number>("result");
		const deviceHash = this.getArgumentValue<number>("deviceHash");
		const deviceName = this.getArgumentValue<number>("deviceName");
		const slotIndex = this.getArgumentValue<number>("slotIndex");
		const logic = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const mode = this.getArgumentValue<number>("mode");

		const v = this.context.getBatchDeviceSlotParameterByHashAndName(deviceHash, deviceName, slotIndex, logic, mode);
		this.context.setRegister(result, v);
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("deviceHash"),
			ArgumentCalculators.anyNumber("deviceName"),
			ArgumentCalculators.anyNumber("slotIndex"),
			ArgumentCalculators.logicSlot("logic"),
			ArgumentCalculators.logicBatchMethod("mode"),
		];
	}
}

export class LbsInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		const item1 = new ItemEntity(1, 4);
		const item2 = new ItemEntity(1, 6);
		const d1 = new StructureConsole({});
		d1.slots.getSlot(0).putItem(item1);
		const d2 = new StructureConsole({});
		d2.slots.getSlot(0).putItem(item2);

		const devices = [
			{ id: 1, device: d1 },
			{ id: 2, device: d2 },
		];

		const values = [4, 6];
		const sum = values[0] + values[1];
		const max = Math.max(...values);
		const min = Math.min(...values);
		const avg = sum / values.length;

		const makeTest = (register: number, operation: string, expectedValue: number): InstructionTestData => ({
			devices,
			code: [`lbs r${register} 235638270 0 Quantity ${operation}`],
			expected: [{ type: "register", register, value: expectedValue }],
		});

		return [
			makeTest(0, "Sum", sum),
			makeTest(0, "Maximum", max),
			makeTest(0, "Minimum", min),
			makeTest(3, "Average", avg),
		];
	}

	public run(): void | Promise<void> {
		const result = this.getArgumentValue<number>("result");
		const deviceHash = this.getArgumentValue<number>("deviceHash");
		const slotIndex = this.getArgumentValue<number>("slotIndex");
		const logic = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const mode = this.getArgumentValue<number>("mode");

		const v = this.context.getBatchDeviceSlotParameterByHash(deviceHash, slotIndex, logic, mode);
		this.context.setRegister(result, v);
	}
	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.deviceHash("deviceHash"),
			ArgumentCalculators.anyNumber("slotIndex"),
			ArgumentCalculators.logicSlot("logic"),
			ArgumentCalculators.logicBatchMethod("mode"),
		];
	}
}

export class LrInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		const name = new HashString("a1");
		const d1 = new StructureAutolathe({ name: "a1" });
		const rh = Reagents.getByValue("Copper");
		d1.reagents.set(rh, 200);
		const devices = [{ id: 1, pin: 2, device: d1 }];

		return [
			{
				devices,
				code: [`lr r0 d2 Contents ${rh}`],
				expected: [
					{
						type: "register",
						register: 0,
						value: 200,
					},
				],
			},
		];
	}

	public run(): void | Promise<void> {
		const result = this.getArgumentValue<number>("result");
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("device");
		const reagentMode = this.getArgumentValue<number>("reagentMode");
		const reagent = this.getArgumentValue<number>("reagent");

		if (device.pin !== undefined && device.port !== undefined) {
			this.context.addError(
				new ArgumentIc10Error({
					message: i18n.t("error.channels_not_allowed_in_instruction"),
				}).setArgument(this.args[1]),
			);
			return;
		}
		if (device.pin !== undefined) {
			const v = this.context.getDeviceReagentByPin(device.pin, reagentMode, reagent);
			this.context.setRegister(result, v);
			return;
		}
		if (device.id !== undefined) {
			const v = this.context.getDeviceReagentById(device.id, reagentMode, reagent);
			this.context.setRegister(result, v);
			return;
		}
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.devicePinOrId("device"),
			ArgumentCalculators.logicReagentMode("reagentMode"),
			ArgumentCalculators.reagentHash("reagent"),
		];
	}
}

export class LbInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		const d = new StructureConsole({});
		d.props.forceWrite("Setting", 100);
		const c = new StructureConsole({});
		c.props.forceWrite("Setting", 80);

		const devices = [
			{ id: 1, device: d },
			{ id: 2, device: c },
		];

		const values = [100, 80];
		const sum = values[0] + values[1];
		const max = Math.max(...values);
		const min = Math.min(...values);
		const avg = sum / values.length;

		const makeTest = (register: number, operation: string, expectedValue: number): InstructionTestData => ({
			devices,
			code: [`lb r${register} 235638270 Setting ${operation}`],
			expected: [{ type: "register", register, value: expectedValue }],
		});

		return [
			makeTest(0, "Sum", sum),
			makeTest(0, "Maximum", max),
			makeTest(0, "Minimum", min),
			makeTest(3, "Average", avg),
		];
	}

	override run(): void {
		const result = this.getArgumentValue<number>("result");
		const device = this.getArgumentValue<number>("deviceHash");
		const prop = this.getArgumentValue<LogicConstType[keyof LogicConstType]>("logic");
		const batchMode = this.getArgumentValue<LogicBatchMethodType[keyof LogicBatchMethodType]>("batchMode");
		const v = this.context.deviceBatchReadByHash(device, prop, batchMode);
		this.context.setRegister(result, v);
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.deviceHash("deviceHash"),
			ArgumentCalculators.logic("logic"),
			ArgumentCalculators.logicBatchMethod("batchMode"),
		];
	}
}

export class SsInstruction extends Instruction {
	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.devicePinOrId("device"),
			ArgumentCalculators.anyNumber("slot"),
			ArgumentCalculators.logicSlot("slotType"),
			ArgumentCalculators.anyNumber("value"),
		];
	}

	public run(): void {
		const device = this.getArgumentValue<calculateDevicePinOrIdResult>("device");
		const slot = this.getArgumentValue<number>("slot");
		const slotType = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogicSlot>>("slotType");
		const value = this.getArgumentValue<number>("value");

		if (device.pin !== undefined && device.port !== undefined) {
			this.context.addError(
				new ArgumentIc10Error({
					message: i18n.t("error.channels_not_allowed_in_instruction"),
				}).setArgument(this.args[1]),
			);
		}
		if (device.pin !== undefined) {
			this.context.setDeviceSlotParameterByPin(device.pin, slot, slotType, value);
		}
		if (device.id !== undefined) {
			this.context.setDeviceSlotParameterById(device.id, slot, slotType, value);
		}
	}
}

export class SbInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		const s = Logics.getByKey("On");
		const d1 = new StructureAutolathe({ name: "a1" });
		const d2 = new StructureAutolathe({ name: "a2" });
		const devices = [
			{ id: 1, pin: 2, device: d1 },
			{ id: 2, pin: 3, device: d2 },
		];

		return [
			{
				devices,
				code: [`sb 336213101 On 1`],
				expected: [
					{
						type: "device",
						pin: 2,
						prop: s,
						value: 1,
					},
					{
						type: "device",
						pin: 3,
						prop: s,
						value: 1,
					},
				],
			},
		];
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.deviceHash("device"),
			ArgumentCalculators.logic("logic"),
			ArgumentCalculators.anyNumber("value"),
		];
	}

	public run(): void {
		const device = this.getArgumentValue<number>("device");
		const logic = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogic>>("logic");
		const value = this.getArgumentValue<number>("value");

		this.context.deviceBatchWriteByHash(device, logic, value);
	}
}

export class SbsInstruction extends Instruction {
	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.deviceHash("device"),
			ArgumentCalculators.anyNumber("slot"),
			ArgumentCalculators.logicSlot("slotType"),
			ArgumentCalculators.anyNumber("value"),
		];
	}

	public run(): void {
		const device = this.getArgumentValue<number>("device");
		const slot = this.getArgumentValue<number>("slot");
		const slotType = this.getArgumentValue<ReturnType<typeof ValueCalculators.calculateLogicSlot>>("slotType");
		const value = this.getArgumentValue<number>("value");

		this.context.setBatchDeviceSlotParameterByHash(device, slot, slotType, value);
	}
}
