import type { LogicBatchMethodType, LogicConstType } from "@/Defines/data";
import { StructureConsole } from "@/Devices/StructureConsole";
import { ArgumentCalculators, type calculateDevicePinOrIdResult } from "@/Ic10/Instruction/Helpers/ArgumentCalculators";
import {
	Instruction,
	type InstructionArgument,
	type InstructionTestData,
} from "@/Ic10/Instruction/Helpers/Instruction";

export class SInstruction extends Instruction {
	static tests(): InstructionTestData[] {
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
		const prop = this.getArgumentValue<number>("logic");
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
	static tests(): InstructionTestData[] {
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
		const prop = this.getArgumentValue<number>("logic");
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

/**\
 * lb:
  Loads LogicType from all output network devices with provided type hash using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number. 
   lb r? deviceHash logicType batchMode

 */

export class LbInstruction extends Instruction {
	static tests(): InstructionTestData[] {
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
		const device = this.getArgumentValue<number>("device_hash");
		const prop = this.getArgumentValue<LogicConstType[keyof LogicConstType]>("logic");
		const batchMode = this.getArgumentValue<LogicBatchMethodType[keyof LogicBatchMethodType]>("batchMode");
		const v = this.context.deviceBatchReadByHash(device, prop, batchMode);
		this.context.setRegister(result, v);
	}

	public argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("device_hash"),
			ArgumentCalculators.logic("logic"),
			ArgumentCalculators.logicBatchMethod("batchMode"),
		];
	}
}

export class ClrInstruction extends Instruction {
	static tests(): InstructionTestData[] {
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
	static tests(): InstructionTestData[] {
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
	static tests(): InstructionTestData[] {
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

// export class PutdInstruction extends Instruction {}
/**
 * 
putd:
  Seeks directly for the provided device id, attempts to write the provided value to the stack at the provided address.  putd id(r?|id) address(r?|num) value(r?|num)

getd:
  Seeks directly for the provided device id, attempts to read the stack value at the provided address, and places it in the register.  getd r? id(r?|id) address(r?|num)

 */

export class BdnvlInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
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
		const logic = this.getArgumentValue<number>("logic");
		const target = this.getArgumentValue<number>("target");
		if (this.context.canLoadDeviceParameterByPin(devicePin, logic)) {
			this.context.setNextLineIndex(target);
		}
	}
}
export class BdnvsInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
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
		const logic = this.getArgumentValue<number>("logic");
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

/**
 * 	ls: {
		name: "ls",
		description: "Loads slot LogicSlotType on device to register.",
		example: "ls r? device(d?|r?|id) slotIndex logicSlotType",
	},
	lr: {
		name: "lr",
		description:
			"Loads reagent of device's ReagentMode where a hash of the reagent type to check for. ReagentMode can be either Contents (0), Required (1), Recipe (2). Can use either the word, or the number.",
		example: "lr r? device(d?|r?|id) reagentMode int",
	},
	sb: {
		name: "sb",
		description:
			"Stores register value to LogicType on all output network devices with provided type hash.",
		example: "sb deviceHash logicType r?",
	},
	lb: {
		name: "lb",
		description:
			"Loads LogicType from all output network devices with provided type hash using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
		example: "lb r? deviceHash logicType batchMode",
	},
 */
