import { Random } from "@stationeers-ic/exact-ic10-math";
import EventEmitter from "eventemitter3";
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
	randomSeed?: number;
};

// Типы событий
export interface Ic10RunnerEvents {
	// Основные события выполнения
	run: () => void;
	runEnd: () => void;
	step: (lineIndex: number, line: Line) => void;
	stepEnd: (lineIndex: number, line: Line) => void;

	// События контекста
	contextSwitch: (fromContext: string, toContext: string) => void;
	contextInit: (contextName: string) => void;

	// События ошибок
	error: (error: Ic10Error) => void;
	fatalError: (error: Ic10Error) => void;

	// События выполнения строк
	lineExecute: (line: Line) => void;
	lineEnd: (line: Line) => void;

	// События управления выполнением
	stop: () => void;
	reset: () => void;
}

/**
 * Контекст запуска
 * Класс эмулирующий работу CPU и RAM для ic10
 */
export class Ic10Runner extends EventEmitter<Ic10RunnerEvents> {
	public readonly contextSwitcher: ContextSwitcher;
	public lines: Line[] = [];
	private readonly jumpLimit: number;
	private executionStopped: boolean = false;
	public readonly randomSeed?: number;
	public readonly random!: Random;

	constructor({ housing, jumpLimit = 1000, randomSeed }: Ic10RunnerConstructor) {
		super();
		this.randomSeed = randomSeed ?? new Random().next();

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
		housing.applyRunner(this);
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
		const previousContext = this.contextSwitcher.name;

		if (context) {
			if (this.contextSwitcher.name !== context) {
				this.contextSwitcher.switchContext(context);
				this.emit("contextSwitch", previousContext, context);
				this.init(false);
			}
		} else {
			const newContext = this.context instanceof RealContext ? "sandbox" : "real";
			this.contextSwitcher.switchContext(newContext);
			this.emit("contextSwitch", previousContext, newContext);
			this.init(false);
		}
		return this;
	}

	public init(reset: boolean = true) {
		this.emit("reset");
		this.lines = this.lexer(this.context.getIc10Code());
		this.executionStopped = false;
		if (reset) {
			this.context.reset(); // Добавить метод reset() в Context
		}
		this.lines.filter((l) => l instanceof LabelLine).forEach((l) => l.run());
		this.emit("contextInit", this.contextSwitcher.name);
		return this;
	}

	public async step(): Promise<boolean> {
		const currentLineIndex = this.context.getNextLineIndex();

		if (this.executionStopped) {
			return false;
		}

		if (this.context.getJumpsCount() > this.jumpLimit) {
			const error = new RuntimeIc10Error({
				message: i18n.t("error.jump_limit_exceeded"),
				line: currentLineIndex,
				severity: ErrorSeverity.Critical,
			});
			this.addError(error);
			this.emit("fatalError", error);
			this.executionStopped = true;
			this.emit("stop");
			return false;
		}

		if (currentLineIndex >= this.lines.length) {
			this.executionStopped = true;
			this.emit("stop");
			return false;
		}

		const line = this.lines[currentLineIndex];
		if (typeof line === "undefined") {
			const error = new RuntimeIc10Error({
				message: i18n.t("error.line_not_found"),
				line: currentLineIndex,
				severity: ErrorSeverity.Critical,
			});
			this.addError(error);
			this.emit("fatalError", error);
			this.executionStopped = true;
			this.emit("stop");
			return false;
		}

		// Событие начала шага
		this.emit("step", currentLineIndex, line);
		this.emit("lineExecute", line);

		this.context.setExecuteLine(line);
		await line.runCommentBeforeRun();
		// Выполняем текущую строку
		if (line instanceof InstructionLine) {
			await line.run();
		}
		await line.runCommentAfterRun();
		line.end();

		// Событие завершения шага
		this.emit("stepEnd", currentLineIndex, line);
		this.emit("lineEnd", line);

		this.context.collectErrors();
		if (this.context.criticalError !== false) {
			this.executionStopped = true;
			this.emit("stop");
			return false;
		}
		return true;
	}

	public async run() {
		this.emit("run");
		this.init();
		let continueRun: boolean;
		do {
			continueRun = await this.step();
		} while (continueRun && !this.executionStopped);
		this.emit("runEnd");
		return this;
	}

	public addError(error: Ic10Error): this {
		this.context.addError(error);
		this.emit("error", error);
		return this;
	}

	public lexer(code: string): Line[] {
		const random = new Random(this.randomSeed);
		let position = -1;
		return code
			.split("\n")
			.map((line) => {
				position++;
				const trimLine = line.trim();
				if (trimLine) {
					if (trimLine.startsWith("#")) {
						return new CommentLine({
							randomSeed: random.next(),
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
							randomSeed: random.next(),
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
							randomSeed: random.next(),
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
					randomSeed: random.next(),
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

	// Дополнительные методы для управления выполнением
	public stopExecution(): void {
		this.executionStopped = true;
		this.emit("stop");
	}

	public isStopped(): boolean {
		return this.executionStopped;
	}
}

export type ValidateOptions = {
	jumpLimit?: number;
	randomSeed?: number;
	stack_length?: number;
	register_length?: number;
};

export class ValidateIc10Runner extends Ic10Runner {
	private constructor(code: string, options?: ValidateOptions) {
		const randomSeed = options?.randomSeed ?? new Random().next();
		const jumpLimit = options?.jumpLimit ?? 1000;

		// Создаем временный контекст песочницы
		const sandboxContext = new SandboxContext({
			id: 0,
			name: "validation",
			ic10Code: code,
			stack_length: options?.stack_length ?? 512,
			register_length: options?.register_length ?? 18,
		});

		// Создаем временный ContextSwitcher
		const contextSwitcher = new ContextSwitcher<"validation">({
			contexts: {
				validation: sandboxContext,
			},
			defaultContext: "validation",
		});

		// Создаем фейковый housing (минимальная заглушка)
		const fakeHousing = {
			chip: null,
			applyRunner: () => {},
		} as any;

		super({ housing: fakeHousing, jumpLimit, randomSeed });

		// Подменяем contextSwitcher
		(this as any).contextSwitcher = contextSwitcher;
	}

	public static async validate(code: string, options?: ValidateOptions): Promise<Ic10Error[]> {
		const validator = new ValidateIc10Runner(code, options);

		try {
			await validator.run();
		} catch (error) {
			// Ошибки уже должны быть в контексте
		}

		return validator.context.errors;
	}
}
