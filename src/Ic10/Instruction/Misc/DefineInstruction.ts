import { ErrorSeverity, RuntimeIc10Error, TypeIc10Error } from "@/Ic10/Errors/Errors";
import { parseArgumentAnyNumber } from "@/Ic10/Helpers/ArgumentParse";
import { Define } from "@/Ic10/Instruction/Helpers/Define";
import {
	Instruction,
	type InstructionArgument,
	type InstructionTestData,
} from "@/Ic10/Instruction/Helpers/Instruction";
import i18n from "@/Languages/lang";

export class DefineInstruction extends Instruction {
	static override tests(): InstructionTestData[] {
		if (typeof isProd !== "undefined" && isProd) {
			return [];
		}
		return [
			{
				code: "define pi 3.14\nmove r0 pi",
				expected: [
					{
						type: "register",
						register: 0,
						value: 3.14,
					},
				],
			},
			{
				title: "HASH",
				code: 'define t1 HASH("a")\nmove r0 t1',
				expected: [
					{
						type: "register",
						register: 0,
						value: -390611389,
					},
				],
			},
			{
				title: "STR",
				code: 'define t1 STR("a")\nmove r0 t1',
				expected: [
					{
						type: "register",
						register: 0,
						value: 97,
					},
				],
			},
			{
				title: "dont set label",
				code: "define t1 label\nmove r0 t1\nlabel:",
				expected: [
					{
						type: "register",
						register: 0,
						value: 0,
					},
				],
			},
		];
	}

	override argumentList(): InstructionArgument[] {
		return [
			{
				name: "constant",
				canBeLabel: false,
				canBeAlias: false,
				canBeConst: false,
				canBeDefine: false,
				calculate: function (_context, argument) {
					const t = argument.text;
					if (this.context.hasDefines(t)) {
						const old = this.context.getDefines(t)!;
						// если значение это строка значит это alias и его можно переопределить
						this.addError(
							new RuntimeIc10Error({
								message: i18n.t("error.constant_already_defined", { constant: t }),
								severity: old.type === "const" ? ErrorSeverity.Warning : ErrorSeverity.Strong,
							}),
							argument,
						);
					}
					return t;
				},
			},
			{
				name: "value",
				canBeLabel: false,
				canBeAlias: false,
				canBeConst: true,
				canBeDefine: false,
				calculate: function (context, argument) {
					const value = parseArgumentAnyNumber(context, argument);
					if (value) {
						return new Define("const", value);
					}
					this.addError(
						new TypeIc10Error({
							message: i18n.t("error.value_must_be_number"),
							severity: ErrorSeverity.Strong,
						}),
					);

					return 0;
				},
			},
		];
	}

	override run(): void {
		const r = this.getArgumentValue<string>("constant");
		const v = this.getArgumentValue<Define>("value");
		if (!this.context.hasDefines(r)) {
			this.context.setDefines(r, v);
		} else {
			const old = this.context.getDefines(r)!;
			if (old.type === "const") {
				this.context.setDefines(r, v);
			}
		}
	}
}
