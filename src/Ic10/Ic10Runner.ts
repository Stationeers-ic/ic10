import type { Housing } from "@/Core/Housing";
import { ContextSwitcher, type contextNames } from "@/Ic10/Context/ContextSwitcher";
import { RealContext } from "@/Ic10/Context/RealContext";
import { SandboxContext } from "@/Ic10/Context/SandboxContext";
import { ErrorSeverity, FatalIc10Error, type Ic10Error, RuntimeIc10Error } from "@/Ic10/Errors/Errors";
import { Argument } from "@/Ic10/Instruction/Helpers/Argument";
import { CommentLine } from "@/Ic10/Lines/CommentLine";
import { EmptyLine } from "@/Ic10/Lines/EmptyLine";
import { InstructionLine } from "@/Ic10/Lines/InstructionLine";
import { LabelLine } from "@/Ic10/Lines/LabelLine";
import type { Line } from "@/Ic10/Lines/Line";
import i18n from "@/Languages/lang";

export const RegExpLabelLine = /((?<label>\w+):)\s*(?<comment>#.*)?/im;
export const RegExpInstructionLine = /^(?<instruction>\w+)(?:\s+(?<arguments>.+?))?(?:\s*#(?<comment>.*))?$/im;

export type Ic10RunnerConstructor = {
	housing: Housing;
	jumpLimit?: number;
};

/**
 * Контекст запуска
 * Класс эмулирующий работу CPU и RAM для ic10
 */
export class Ic10Runner {
	public readonly contextSwitcher: ContextSwitcher;
	public lines: Line[] = [];
	private readonly jumpLimit: number;
	private executionStopped: boolean = false;

	constructor({ housing, jumpLimit = 1000 }: Ic10RunnerConstructor) {
		this.jumpLimit = jumpLimit;
		this.contextSwitcher = new ContextSwitcher<contextNames>({
			contexts: {
				real: new RealContext({ housing, name: "real" }),
				sandbox: new SandboxContext({
					id: 0,
					name: "sandbox",
					ic10Code: housing.chip?.getIc10Code() ?? "",
					stack_length: housing.chip?.memory.length,
					register_length: housing.chip?.registers.size,
				}),
			},
			defaultContext: "sandbox",
		});
	}

	get context() {
		return this.contextSwitcher.context;
	}

	public get realContext() {
		return this.contextSwitcher.getContext("real");
	}

	public get sanboxContext() {
		return this.contextSwitcher.getContext("sandbox");
	}

	public switchContext(context: "real" | "sandbox" | undefined = undefined) {
		if (context) {
			if (this.contextSwitcher.name !== context) {
				this.contextSwitcher.switchContext(context);
				this.init(false);
			}
		} else {
			if (this.context instanceof RealContext) {
				this.contextSwitcher.switchContext("sandbox");
			} else if (this.context instanceof SandboxContext) {
				this.contextSwitcher.switchContext("real");
			}
			this.init(false);
		}
		return this;
	}

	public init(reset: boolean = true) {
		this.lines = this.lexer(this.context.getIc10Code());
		this.executionStopped = false;
		if (reset) {
			this.context.reset(); // Добавить метод reset() в Context
		}
		this.lines.filter((l) => l instanceof LabelLine).forEach((l) => l.run());
		return this;
	}

	public async step(): Promise<boolean> {
		const currentLineIndex = this.context.getNextLineIndex();
		if (this.executionStopped) {
			return false;
		}
		if (this.context.getJumpsCount() > this.jumpLimit) {
			this.addError(
				new RuntimeIc10Error({
					message: i18n.t("error.jump_limit_exceeded"),
					line: currentLineIndex,
					severity: ErrorSeverity.Critical,
				}),
			);
			this.executionStopped = true;
			return false;
		}

		if (currentLineIndex >= this.lines.length) {
			this.executionStopped = true;
			return false;
		}
		const line = this.lines[currentLineIndex];
		if (typeof line === "undefined") {
			this.addError(
				new RuntimeIc10Error({
					message: i18n.t("error.line_not_found"),
					line: currentLineIndex,
					severity: ErrorSeverity.Critical,
				}),
			);
			this.executionStopped = true;
			return false;
		}
		this.context.setExecuteLine(line);
		// Выполняем текущую строку
		if (line instanceof InstructionLine) {
			await line.run();
		}
		line.end();
		this.context.collectErrors();
		if (this.context.criticalError !== false) {
			this.executionStopped = true;
			return false;
		}
		return true;
	}

	public async run() {
		this.init();
		let continueRun: boolean;
		do {
			continueRun = await this.step();
		} while (continueRun && !this.executionStopped);
		return this;
	}

	public addError(error: Ic10Error): this {
		this.context.addError(error);
		return this;
	}

	private lexer(code: string): Line[] {
		let position = -1;
		return code
			.split("\n")
			.map((line) => {
				position++;
				const trimLine = line.trim();
				if (trimLine) {
					if (trimLine.startsWith("#")) {
						return new CommentLine({
							contextSwitcher: this.contextSwitcher,
							position,
							originalText: line,
							comment: trimLine.slice(1),
						});
					}
					const instructionMatches = RegExpInstructionLine.exec(trimLine);
					if (instructionMatches && instructionMatches.groups?.instruction) {
						let args: Argument[] = [];
						if (instructionMatches.groups?.arguments) {
							args = this.parseArguments(
								instructionMatches.groups?.arguments,
								line.indexOf(instructionMatches.groups?.arguments),
							);
						}
						return new InstructionLine({
							contextSwitcher: this.contextSwitcher,
							position,
							originalText: line,
							comment: instructionMatches.groups?.comment,
							instruction: instructionMatches.groups?.instruction,
							args: args,
						});
					}
					const labelMatches = RegExpLabelLine.exec(trimLine);
					if (labelMatches && labelMatches.groups?.label) {
						return new LabelLine({
							contextSwitcher: this.contextSwitcher,
							position,
							originalText: line,
							comment: labelMatches.groups?.comment,
							label: labelMatches.groups?.label,
						});
					}
					this.addError(
						new FatalIc10Error({
							message: i18n.t("error.unknown_line"),
							severity: ErrorSeverity.Strong,
							context: this.context,
							line: position,
							start: 0,
							length: line.length,
							originalText: line,
						}),
					);
				}
				return new EmptyLine({
					contextSwitcher: this.contextSwitcher,
					position,
					originalText: line,
				});
			})
			.filter(Boolean);
	}

	private parseArguments(input: string, offset: number): Argument[] {
		const result: Argument[] = [];
		let i = 0;
		const len = input.length;

		while (i < len) {
			// Пропускаем пробелы
			while (i < len && /\s/.test(<string>input[i])) i++;
			if (i >= len) break;

			const argStart = i;

			// Проверяем на идентификатор с аргументом в скобках, например HASH("...")
			const funcMatch = input.slice(i).match(/^([A-Za-z_][A-Za-z0-9_]*)\(/);
			if (funcMatch && funcMatch[1]) {
				const funcName = funcMatch[1];
				i += funcName.length + 1; // пропускаем идентификатор и (

				let depth = 1;
				let inQuotes = false;
				while (i < len && depth > 0) {
					const ch = input[i];
					if (ch === '"') {
						inQuotes = !inQuotes;
					} else if (!inQuotes) {
						if (ch === "(") depth++;
						else if (ch === ")") depth--;
					}
					i++;
				}
				result.push(
					new Argument({
						start: offset + argStart,
						length: i - argStart,
						text: input.slice(argStart, i),
					}),
				);
				continue;
			}

			// Обычный аргумент до пробела
			let argEnd = i;
			while (argEnd < len && !/\s/.test(<string>input[argEnd])) argEnd++;
			result.push(
				new Argument({
					start: offset + argStart,
					length: argEnd - argStart,
					text: input.slice(argStart, argEnd),
				}),
			);
			i = argEnd;
		}

		return result;
	}
}
