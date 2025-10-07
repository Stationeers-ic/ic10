import { ErrorSeverity, RuntimeIc10Error, TypeIc10Error } from "@/Ic10/Errors/Errors";
import {
	getRegister,
	recursiveDevice,
	recursiveRegister,
	singleDevice,
	singleRegister,
} from "@/Ic10/Helpers/ArgumentParse";
import { Define } from "@/Ic10/Instruction/Helpers/Define";
import { Instruction, type InstructionArgument } from "@/Ic10/Instruction/Helpers/Instruction";

export class AliasInstruction extends Instruction {
	override argumentList(): InstructionArgument[] {
		return [
			{
				name: "alias",
				canBeLabel: false,
				canBeAlias: false,
				canBeConst: false,
				canBeDefine: false,
				calculate: function (_context, argument) {
					const t = argument.text;
					if (this.context.hasDefines(t)) {
						const v = this.context.getDefines(t)!;
						// если значение это строка значит это alias и его можно переопределить
						this.addError(
							new RuntimeIc10Error({
								message: `${t} is already defined`,
								severity:
									v.type === "alias"
										? ErrorSeverity.Weak
										: v.type === "const"
											? ErrorSeverity.Warning
											: ErrorSeverity.Strong,
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
				canBeConst: false,
				canBeDefine: false,
				calculate: function (context, argument) {
					const t = argument.text;
					if (
						!singleRegister.test(t) &&
						!singleDevice.test(t) &&
						!recursiveRegister.test(t) &&
						!recursiveDevice.test(t)
					) {
						this.addError(
							new TypeIc10Error({
								message: `Argument 1 must be a register or device`,
							}),
							argument,
						);
					}
					if (recursiveRegister.test(t)) {
						const r = getRegister(context, t);
						if (r === false) {
							this.addError(
								new RuntimeIc10Error({
									message: `${t} register not found`,
								}),
								argument,
							);
						}
						return new Define("alias", `r${r}`);
					}
					return new Define("alias", t);
				},
			},
		];
	}

	override run(): void {
		const r = this.getArgumentValue<string>("alias");
		const v = this.getArgumentValue<Define>("value");
		if (this.context.hasDefines(r)) {
			const old = this.context.getDefines(r)!;
			if (old.type === "alias") {
				this.context.setDefines(r, v);
			}
		} else {
			this.context.setDefines(r, v);
		}
	}
}
