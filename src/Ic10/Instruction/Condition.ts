/* eslint-disable @typescript-eslint/ban-ts-comment */

import CONSTS from "@/Defines/consts";
import { ArgumentCalculators } from "@/Ic10/Instruction/Helpers/ArgumentCalculators";
import {
	Instruction,
	type InstructionArgument,
	type InstructionTestData,
} from "@/Ic10/Instruction/Helpers/Instruction";

// ===== Общие хелперы =====
const EPS = CONSTS.epsilon * 8;
const RA = 17;

function approxEqual(a: number, b: number, c: number): boolean {
	const scale = Math.max(Math.abs(a), Math.abs(b));
	const tol = Math.max(c * scale, EPS);
	return Math.abs(a - b) <= tol;
}

const cmp = {
	lt: (a: number, b: number) => a < b,
	gt: (a: number, b: number) => a > b,
	le: (a: number, b: number) => a <= b,
	ge: (a: number, b: number) => a >= b,
	eq: (a: number, b: number) => a === b,
	ne: (a: number, b: number) => a !== b,
};

const un = {
	lt0: (a: number) => a < 0,
	gt0: (a: number) => a > 0,
	le0: (a: number) => a <= 0,
	ge0: (a: number) => a >= 0,
	eq0: (a: number) => a === 0,
	ne0: (a: number) => a !== 0,
	ap0: (a: number) => Math.abs(a) <= EPS,
	na0: (a: number) => Math.abs(a) > EPS,
	nan: (a: number) => Number.isNaN(a),
	nanz: (a: number) => !Number.isNaN(a),
};

// ===== Генераторы тестов и ожидаемых значений =====
const expectReg = (register: number, value: number) => ({ type: "register", register, value }) as const;

function tSetUnary(op: string, cases: Array<[a: number, ok: boolean]>): InstructionTestData[] {
	return cases.map(([a, ok]) => ({
		code: `${op} r2 ${a}`,
		expected: [expectReg(2, ok ? 1 : 0)],
	}));
}
function tSetBinary(op: string, cases: Array<[a: number, b: number, ok: boolean]>): InstructionTestData[] {
	return cases.map(([a, b, ok]) => ({
		code: `${op} r2 ${a} ${b}`,
		expected: [expectReg(2, ok ? 1 : 0)],
	}));
}
function tSetTernary(op: string, cases: Array<[a: number, b: number, c: number, ok: boolean]>): InstructionTestData[] {
	return cases.map(([a, b, c, ok]) => ({
		code: `${op} r2 ${a} ${b} ${c}`,
		expected: [expectReg(2, ok ? 1 : 0)],
	}));
}

// Абсолютная бинарная ветка через r0/r1 и line=4
function tAbsBinBranch(
	op: string,
	cases: Array<[r0: number, r1: number, shouldBranch: boolean]>,
): InstructionTestData[] {
	return cases.map(([v0, v1, br]) => ({
		code: `move r0 ${v0}\nmove r1 ${v1}\n${op} r0 r1 4\nmove r2 1\nmove r3 1`,
		expected: br ? [expectReg(2, 0), expectReg(3, 1)] : [expectReg(2, 1), expectReg(3, 1)],
	}));
}

// Относительная бинарная ветка c relative=2
function tRelBinBranch(op: string, cases: Array<[a: number, b: number, shouldBranch: boolean]>): InstructionTestData[] {
	return cases.map(([a, b, br]) => ({
		code: `${op} ${a} ${b} 2\nmove r2 1\nmove r3 1`,
		expected: br ? [expectReg(2, 0), expectReg(3, 1)] : [expectReg(2, 1), expectReg(3, 1)],
	}));
}

// Абсолютная тернарная ветка с line=3 и прологом move r2 0
function tAbsTernaryBranch(
	op: string,
	cases: Array<[a: number, b: number, c: number, shouldBranch: boolean]>,
): InstructionTestData[] {
	return cases.map(([a, b, c, br]) => ({
		code: `move r2 0\n${op} ${a} ${b} ${c} 3\nmove r2 1\nmove r3 1`,
		expected: br ? [expectReg(2, 0), expectReg(3, 1)] : [expectReg(2, 1), expectReg(3, 1)],
	}));
}

// ===== Базовые классы записи 1/0 =====
abstract class UnarySetConditionInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.registerLink("result"), ArgumentCalculators.anyNumber("a")];
	}
	public abstract predicate(a: number): boolean;
	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const a = this.getArgumentValue<number>("a");
		this.context.setRegister(r, this.predicate(a) ? 1 : 0);
	}
}

abstract class BinarySetConditionInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("a"),
			ArgumentCalculators.anyNumber("b"),
		];
	}
	public abstract predicate(a: number, b: number): boolean;
	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		this.context.setRegister(r, this.predicate(a, b) ? 1 : 0);
	}
}

abstract class TernarySetConditionInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("a"),
			ArgumentCalculators.anyNumber("b"),
			ArgumentCalculators.anyNumber("c"),
		];
	}
	public abstract predicate(a: number, b: number, c: number): boolean;
	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		const c = this.getArgumentValue<number>("c");
		this.context.setRegister(r, this.predicate(a, b, c) ? 1 : 0);
	}
}

// ===== Базовые классы ветвлений =====
abstract class BinaryBranchInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.anyNumber("a"),
			ArgumentCalculators.anyNumber("b"),
			ArgumentCalculators.jumpTarget("line"),
		];
	}
	public abstract predicate(a: number, b: number): boolean;
	override run(): void {
		const line = this.getArgumentValue<number>("line");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		if (this.predicate(a, b)) this.context.setNextLineIndex(line);
	}
}

abstract class UnaryBranchInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.anyNumber("a"), ArgumentCalculators.jumpTarget("line")];
	}
	public abstract predicate(a: number): boolean;
	override run(): void {
		const line = this.getArgumentValue<number>("line");
		const a = this.getArgumentValue<number>("a");
		if (this.predicate(a)) this.context.setNextLineIndex(line);
	}
}

abstract class TernaryBranchInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.anyNumber("a"),
			ArgumentCalculators.anyNumber("b"),
			ArgumentCalculators.anyNumber("c"),
			ArgumentCalculators.jumpTarget("line"),
		];
	}
	public abstract predicate(a: number, b: number, c: number): boolean;
	override run(): void {
		const line = this.getArgumentValue<number>("line");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		const c = this.getArgumentValue<number>("c");
		if (this.predicate(a, b, c)) this.context.setNextLineIndex(line);
	}
}

abstract class RelativeBinaryBranchInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.anyNumber("a"),
			ArgumentCalculators.anyNumber("b"),
			ArgumentCalculators.anyNumber("relative"),
		];
	}
	public abstract predicate(a: number, b: number): boolean;
	override run(): void {
		const relative = this.getArgumentValue<number>("relative");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		if (this.predicate(a, b)) this.context.setNextLineIndex(this.line.position + relative);
	}
}

abstract class RelativeUnaryBranchInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.anyNumber("a"), ArgumentCalculators.anyNumber("relative")];
	}
	public abstract predicate(a: number): boolean;
	override run(): void {
		const relative = this.getArgumentValue<number>("relative");
		const a = this.getArgumentValue<number>("a");
		if (this.predicate(a)) this.context.setNextLineIndex(this.line.position + relative);
	}
}

abstract class RelativeTernaryBranchInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.anyNumber("a"),
			ArgumentCalculators.anyNumber("b"),
			ArgumentCalculators.anyNumber("c"),
			ArgumentCalculators.anyNumber("relative"),
		];
	}
	public abstract predicate(a: number, b: number, c: number): boolean;
	override run(): void {
		const relative = this.getArgumentValue<number>("relative");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		const c = this.getArgumentValue<number>("c");
		if (this.predicate(a, b, c)) this.context.setNextLineIndex(this.line.position + relative);
	}
}

abstract class BinaryBranchAndLinkInstruction extends BinaryBranchInstruction {
	override run(): void {
		const line = this.getArgumentValue<number>("line");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		if (this.predicate(a, b)) {
			this.context.setNextLineIndex(line, true);
		}
	}
}

abstract class UnaryBranchAndLinkInstruction extends UnaryBranchInstruction {
	override run(): void {
		const line = this.getArgumentValue<number>("line");
		const a = this.getArgumentValue<number>("a");
		if (this.predicate(a)) {
			this.context.setNextLineIndex(line, true);
		}
	}
}

abstract class TernaryBranchAndLinkInstruction extends TernaryBranchInstruction {
	override run(): void {
		const line = this.getArgumentValue<number>("line");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		const c = this.getArgumentValue<number>("c");
		if (this.predicate(a, b, c)) {
			this.context.setNextLineIndex(line, true);
		}
	}
}

// ===== Устройства (унификация) =====
abstract class DeviceSetConditionInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.registerLink("result"), ArgumentCalculators.devicePin("device")];
	}
	public abstract predicateDeviceSet(isSet: boolean): boolean;
	override run(): void {
		const r = this.getArgumentValue<number>("result");
		const device = this.getArgumentValue<number>("device");
		const isSet = this.context.isConnectDeviceByPin(device);
		this.context.setRegister(r, this.predicateDeviceSet(isSet) ? 1 : 0);
	}
}

abstract class DeviceBranchInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.devicePin("device"), ArgumentCalculators.anyNumber("line")];
	}
	public abstract predicateDeviceSet(isSet: boolean): boolean;
	override run(): void {
		const line = this.getArgumentValue<number>("line");
		const device = this.getArgumentValue<number>("device");
		const isSet = this.context.isConnectDeviceByPin(device);
		if (this.predicateDeviceSet(isSet)) this.context.setNextLineIndex(line);
	}
}

abstract class RelativeDeviceBranchInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.devicePin("device"), ArgumentCalculators.anyNumber("relative")];
	}
	public abstract predicateDeviceSet(isSet: boolean): boolean;
	override run(): void {
		const relative = this.getArgumentValue<number>("relative");
		const device = this.getArgumentValue<number>("device");
		const isSet = this.context.isConnectDeviceByPin(device);
		if (this.predicateDeviceSet(isSet)) {
			this.context.setNextLineIndex(this.line.position + relative);
		}
	}
}

abstract class DeviceBranchAndLinkInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [ArgumentCalculators.devicePin("device"), ArgumentCalculators.anyNumber("line")];
	}
	public abstract predicateDeviceSet(isSet: boolean): boolean;
	override run(): void {
		const line = this.getArgumentValue<number>("line");
		const device = this.getArgumentValue<number>("device");
		const isSet = this.context.isConnectDeviceByPin(device);
		if (this.predicateDeviceSet(isSet)) {
			this.context.setNextLineIndex(line, true);
		}
	}
}

// ===== Фабрики для снижения дублирования =====
function makeUnarySet<TBase extends abstract new (...args: any[]) => Instruction>(
	Base: TBase,
	pred: (a: number) => boolean,
) {
	//@ts-expect-error ХАК для сокращения повторений в коде
	return class extends Base {
		public predicate(a: number): boolean {
			return pred(a);
		}
	};
}
function makeBinarySet<TBase extends abstract new (...args: any[]) => Instruction>(
	Base: TBase,
	pred: (a: number, b: number) => boolean,
) {
	//@ts-expect-error ХАК для сокращения повторений в коде
	return class extends Base {
		public predicate(a: number, b: number): boolean {
			return pred(a, b);
		}
	};
}
function makeTernarySet<TBase extends abstract new (...args: any[]) => Instruction>(
	Base: TBase,
	pred: (a: number, b: number, c: number) => boolean,
) {
	//@ts-expect-error ХАК для сокращения повторений в коде
	return class extends Base {
		public predicate(a: number, b: number, c: number): boolean {
			return pred(a, b, c);
		}
	};
}

// ===== Реализации S* (запись 1/0) =====
export class SltInstruction extends makeBinarySet(BinarySetConditionInstruction, cmp.lt) {
	static override tests(): InstructionTestData[] {
		return tSetBinary("slt", [
			[1, 2, true],
			[2, 1, false],
		]);
	}
}
export class SgtInstruction extends makeBinarySet(BinarySetConditionInstruction, cmp.gt) {
	static override tests(): InstructionTestData[] {
		return tSetBinary("sgt", [
			[2, 1, true],
			[1, 2, false],
		]);
	}
}
export class SleInstruction extends makeBinarySet(BinarySetConditionInstruction, cmp.le) {
	static override tests(): InstructionTestData[] {
		return tSetBinary("sle", [
			[2, 2, true],
			[3, 2, false],
		]);
	}
}
export class SgeInstruction extends makeBinarySet(BinarySetConditionInstruction, cmp.ge) {
	static override tests(): InstructionTestData[] {
		return tSetBinary("sge", [
			[2, 2, true],
			[1, 2, false],
		]);
	}
}
export class SeqInstruction extends makeBinarySet(BinarySetConditionInstruction, cmp.eq) {
	static override tests(): InstructionTestData[] {
		return tSetBinary("seq", [
			[5, 5, true],
			[5, 4, false],
		]);
	}
}
export class SneInstruction extends makeBinarySet(BinarySetConditionInstruction, cmp.ne) {
	static override tests(): InstructionTestData[] {
		return tSetBinary("sne", [
			[5, 4, true],
			[5, 5, false],
		]);
	}
}

// Приближенные
export class SapInstruction extends makeTernarySet(TernarySetConditionInstruction, approxEqual) {
	static override tests(): InstructionTestData[] {
		return tSetTernary("sap", [
			[100, 101, 0.02, true],
			[100, 104, 0.02, false],
		]);
	}
}
export class SnaInstruction extends makeTernarySet(TernarySetConditionInstruction, (a, b, c) => !approxEqual(a, b, c)) {
	static override tests(): InstructionTestData[] {
		return tSetTernary("sna", [
			[100, 101, 0.02, false],
			[100, 104, 0.02, true],
		]);
	}
}

// Относительно 0
export class SltzInstruction extends makeUnarySet(UnarySetConditionInstruction, un.lt0) {
	static override tests(): InstructionTestData[] {
		return tSetUnary("sltz", [
			[-1, true],
			[0, false],
		]);
	}
}
export class SgtzInstruction extends makeUnarySet(UnarySetConditionInstruction, un.gt0) {
	static override tests(): InstructionTestData[] {
		return tSetUnary("sgtz", [
			[1, true],
			[0, false],
		]);
	}
}
export class SlezInstruction extends makeUnarySet(UnarySetConditionInstruction, un.le0) {
	static override tests(): InstructionTestData[] {
		return tSetUnary("slez", [
			[0, true],
			[1, false],
		]);
	}
}
export class SgezInstruction extends makeUnarySet(UnarySetConditionInstruction, un.ge0) {
	static override tests(): InstructionTestData[] {
		return tSetUnary("sgez", [
			[0, true],
			[-1, false],
		]);
	}
}
export class SeqzInstruction extends makeUnarySet(UnarySetConditionInstruction, un.eq0) {
	static override tests(): InstructionTestData[] {
		return tSetUnary("seqz", [
			[0, true],
			[1, false],
		]);
	}
}
export class SnezInstruction extends makeUnarySet(UnarySetConditionInstruction, un.ne0) {
	static override tests(): InstructionTestData[] {
		return tSetUnary("snez", [
			[1, true],
			[0, false],
		]);
	}
}

// |a| сравнение с eps*8
export class SapzInstruction extends makeUnarySet(UnarySetConditionInstruction, un.ap0) {
	static override tests(): InstructionTestData[] {
		return tSetUnary("sapz", [
			[0, true],
			[1, false],
		]);
	}
}
export class SnazInstruction extends makeUnarySet(UnarySetConditionInstruction, un.na0) {
	static override tests(): InstructionTestData[] {
		return tSetUnary("snaz", [
			[1, true],
			[0, false],
		]);
	}
}

// NaN проверки
export class SnanInstruction extends makeUnarySet(UnarySetConditionInstruction, un.nan) {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "div r0 0 0\nsnan r1 r0\nsnanz r2 r0",
				expected: [expectReg(1, 1), expectReg(2, 0)],
			},
		];
	}
}
export class SnanzInstruction extends makeUnarySet(UnarySetConditionInstruction, un.nanz) {}

// Устройство set/not set
export class SdseInstruction extends DeviceSetConditionInstruction {
	public predicateDeviceSet(isSet: boolean): boolean {
		return isSet;
	}
}
export class SdnsInstruction extends DeviceSetConditionInstruction {
	public predicateDeviceSet(isSet: boolean): boolean {
		return !isSet;
	}
}

// ===== Абсолютные ветвления a ? b -> line =====
export class BltInstruction extends makeBinarySet(BinaryBranchInstruction, cmp.lt) {}
export class BgtInstruction extends makeBinarySet(BinaryBranchInstruction, cmp.gt) {}
export class BleInstruction extends makeBinarySet(BinaryBranchInstruction, cmp.le) {}
export class BgeInstruction extends makeBinarySet(BinaryBranchInstruction, cmp.ge) {}

export class BeqInstruction extends makeBinarySet(BinaryBranchInstruction, cmp.eq) {
	static override tests(): InstructionTestData[] {
		return tAbsBinBranch("beq", [
			[1, 1, true],
			[1, 2, false],
		]);
	}
}
export class BneInstruction extends makeBinarySet(BinaryBranchInstruction, cmp.ne) {
	static override tests(): InstructionTestData[] {
		return tAbsBinBranch("bne", [
			[1, 2, true],
			[1, 1, false],
		]);
	}
}

// Абсолютные ветвления с приближенным сравнением
export class BapInstruction extends makeTernarySet(TernaryBranchInstruction, approxEqual) {
	static override tests(): InstructionTestData[] {
		return tAbsTernaryBranch("bap", [
			[100, 101, 0.02, true],
			[100, 104, 0.02, false],
		]);
	}
}
export class BnaInstruction extends makeTernarySet(TernaryBranchInstruction, (a, b, c) => !approxEqual(a, b, c)) {}

// Абсолютные ветвления к нулю/NaN
export class BeqzInstruction extends makeUnarySet(UnaryBranchInstruction, un.eq0) {}
export class BnezInstruction extends makeUnarySet(UnaryBranchInstruction, un.ne0) {}
export class BapzInstruction extends makeUnarySet(UnaryBranchInstruction, un.ap0) {}
export class BnazInstruction extends makeUnarySet(UnaryBranchInstruction, un.na0) {}
export class BnanInstruction extends makeUnarySet(UnaryBranchInstruction, un.nan) {}

// Абсолютные ветвления по устройству
export class BdseInstruction extends DeviceBranchInstruction {
	public predicateDeviceSet(isSet: boolean): boolean {
		return isSet;
	}
}
export class BdnsInstruction extends DeviceBranchInstruction {
	public predicateDeviceSet(isSet: boolean): boolean {
		return !isSet;
	}
}

// ===== Относительные ветвления =====
export class BrltInstruction extends makeBinarySet(RelativeBinaryBranchInstruction, cmp.lt) {}
export class BrgtInstruction extends makeBinarySet(RelativeBinaryBranchInstruction, cmp.gt) {
	static override tests(): InstructionTestData[] {
		return tRelBinBranch("brgt", [
			[2, 1, true],
			[0, 1, false],
		]);
	}
}
export class BrleInstruction extends makeBinarySet(RelativeBinaryBranchInstruction, cmp.le) {}
export class BrgeInstruction extends makeBinarySet(RelativeBinaryBranchInstruction, cmp.ge) {}
export class BreqInstruction extends makeBinarySet(RelativeBinaryBranchInstruction, cmp.eq) {}
export class BrneInstruction extends makeBinarySet(RelativeBinaryBranchInstruction, cmp.ne) {}

export class BrapInstruction extends makeTernarySet(RelativeTernaryBranchInstruction, approxEqual) {}
export class BrnaInstruction extends makeTernarySet(
	RelativeTernaryBranchInstruction,
	(a, b, c) => !approxEqual(a, b, c),
) {}

export class BreqzInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.eq0) {}
export class BrnezInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.ne0) {}
export class BrapzInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.ap0) {}
export class BrnazInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.na0) {}
export class BrnanInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.nan) {}

// ===== Варианты с сохранением ra (AL) =====
export class BltalInstruction extends makeBinarySet(BinaryBranchAndLinkInstruction, cmp.lt) {}
export class BgtalInstruction extends makeBinarySet(BinaryBranchAndLinkInstruction, cmp.gt) {}
export class BlealInstruction extends makeBinarySet(BinaryBranchAndLinkInstruction, cmp.le) {}
export class BgealInstruction extends makeBinarySet(BinaryBranchAndLinkInstruction, cmp.ge) {}

export class BeqalInstruction extends makeBinarySet(BinaryBranchAndLinkInstruction, cmp.eq) {
	static override tests(): InstructionTestData[] {
		// Оставляем как в оригинале из-за специфики RA/nextLineIndex
		return [
			{
				code: `move r0 1\nmove r1 1\nbeqal r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [expectReg(RA, 2), expectReg(2, 0), expectReg(3, 1)],
			},
			{
				code: `move r0 1\nmove r1 2\nbeqal r0 r1 4\nmove r2 1\nmove r3 1`,
				expected: [expectReg(RA, 0), expectReg(2, 1), expectReg(3, 1)],
			},
		];
	}
}
export class BnealInstruction extends makeBinarySet(BinaryBranchAndLinkInstruction, cmp.ne) {}

export class BapalInstruction extends makeTernarySet(TernaryBranchAndLinkInstruction, approxEqual) {}
export class BnaalInstruction extends makeTernarySet(
	TernaryBranchAndLinkInstruction,
	(a, b, c) => !approxEqual(a, b, c),
) {}

export class BeqzalInstruction extends makeUnarySet(UnaryBranchAndLinkInstruction, un.eq0) {}
export class BnezalInstruction extends makeUnarySet(UnaryBranchAndLinkInstruction, un.ne0) {}
export class BapzalInstruction extends makeUnarySet(UnaryBranchAndLinkInstruction, un.ap0) {}
export class BnazalInstruction extends makeUnarySet(UnaryBranchAndLinkInstruction, un.na0) {}

// ===== Relative device branches (с тестами) =====
export class BrdseInstruction extends RelativeDeviceBranchInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "brdse db 2\nmove r0 1\nmove r1 1",
				expected: [expectReg(1, 1), expectReg(0, 0)],
			},
			{
				code: "brdse d1 2\nmove r0 1\nmove r1 1",
				expected: [expectReg(1, 1), expectReg(0, 1)],
			},
		];
	}
	public predicateDeviceSet(isSet: boolean): boolean {
		return isSet;
	}
}
export class BrdnsInstruction extends RelativeDeviceBranchInstruction {
	static override tests(): InstructionTestData[] {
		return [
			{
				code: "brdns db 2\nmove r0 1\nmove r1 1",
				expected: [expectReg(1, 1), expectReg(0, 1)],
			},
			{
				code: "brdns d1 2\nmove r0 1\nmove r1 1",
				expected: [expectReg(1, 1), expectReg(0, 0)],
			},
		];
	}
	public predicateDeviceSet(isSet: boolean): boolean {
		return !isSet;
	}
}

// Абсолютные ветки устройств с AL
export class BdsealInstruction extends DeviceBranchAndLinkInstruction {
	public predicateDeviceSet(isSet: boolean): boolean {
		return isSet;
	}
}
export class BdnsalInstruction extends DeviceBranchAndLinkInstruction {
	public predicateDeviceSet(isSet: boolean): boolean {
		return !isSet;
	}
}
// ===== Абсолютные ветвления (Unary) =====
export class BltzInstruction extends makeUnarySet(UnaryBranchInstruction, un.lt0) {}
export class BgezInstruction extends makeUnarySet(UnaryBranchInstruction, un.ge0) {}
export class BlezInstruction extends makeUnarySet(UnaryBranchInstruction, un.le0) {}
export class BgtzInstruction extends makeUnarySet(UnaryBranchInstruction, un.gt0) {}

// ===== Абсолютные ветвления с сохранением адреса (Unary AL) =====
export class BltzalInstruction extends makeUnarySet(UnaryBranchAndLinkInstruction, un.lt0) {}
export class BgezalInstruction extends makeUnarySet(UnaryBranchAndLinkInstruction, un.ge0) {}
export class BlezalInstruction extends makeUnarySet(UnaryBranchAndLinkInstruction, un.le0) {}
export class BgtzalInstruction extends makeUnarySet(UnaryBranchAndLinkInstruction, un.gt0) {}

// ===== Относительные ветвления (Relative Unary) =====
export class BrltzInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.lt0) {}
export class BrgezInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.ge0) {}
export class BrlezInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.le0) {}
export class BrgtzInstruction extends makeUnarySet(RelativeUnaryBranchInstruction, un.gt0) {}

export class SelectInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			ArgumentCalculators.registerLink("result"),
			ArgumentCalculators.anyNumber("a"),
			ArgumentCalculators.anyNumber("b"),
			ArgumentCalculators.anyNumber("c"),
		];
	}

	override run(): void {
		const result = this.getArgumentValue<number>("result");
		const a = this.getArgumentValue<number>("a");
		const b = this.getArgumentValue<number>("b");
		const c = this.getArgumentValue<number>("c");

		// Выбираем b если a не ноль, иначе c
		const value = a !== 0 ? b : c;
		this.context.setRegister(result, value);
	}

	static override tests(): InstructionTestData[] {
		return [
			{
				code: "select r2 1 10 20",
				expected: [expectReg(2, 10)], // a=1 (не ноль) → выбираем b=10
			},
			{
				code: "select r2 0 10 20",
				expected: [expectReg(2, 20)], // a=0 → выбираем c=20
			},
			{
				code: "select r3 -5 100 200",
				expected: [expectReg(3, 100)], // a=-5 (не ноль) → выбираем b=100
			},
			{
				code: "select r4 0.0001 50 60",
				expected: [expectReg(4, 50)], // a=0.0001 (не ноль) → выбираем b=50
			},
		];
	}
}
