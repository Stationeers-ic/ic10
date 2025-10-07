import type { Device } from "@/Core/Device";
import type { Context } from "@/Ic10/Context/Context";
import { ArgumentIc10Error, ErrorSeverity, type Ic10Error } from "@/Ic10/Errors/Errors";
import type { Argument } from "@/Ic10/Instruction/Helpers/Argument";
import type { InstructionLine } from "@/Ic10/Lines/InstructionLine";
import type { Line } from "@/Ic10/Lines/Line";

export type InstructionConstructorType = {
	/** Контекст исполнения инструкции (доступ к регистрам, устройствам, define и т.д.) */
	context: Context;
	/** Строка исходного кода, к которой привязана инструкция (для трассировки/ошибок) */
	line: Line;
	/** Сырые аргументы инструкции, полученные из парсера */
	args: Argument[];
};

export type InstructionArgument = {
	/** Опциональное имя аргумента (для доступа по имени) */
	name?: string;
	/** Разрешено ли подставлять alias в этот аргумент */
	canBeAlias: boolean;
	/** Разрешено ли подставлять const в этот аргумент */
	canBeConst: boolean;
	/** Разрешено ли подставлять define в этот аргумент */
	canBeDefine: boolean;
	/** Разрешено ли подставлять label в этот аргумент */
	canBeLabel: boolean;
	/**
	 * Функция вычисления значения аргумента.
	 * Здесь выполняется парсинг/валидация и преобразование Argument -> нужное значение.
	 * this — это текущий экземпляр инструкции.
	 */
	calculate: (this: Instruction, context: Context, argument: Argument) => any;
};

/** Ожидание значения регистра */
export type InstructionTestExpectedRegister = {
	type: "register";
	/** Ожидаемый номер регистра */
	register: number;
	/** Ожидаемое значение регистра после выполнения */
	value: number;
};

/** Ожидание значения стека */
export type InstructionTestExpectedStack = {
	type: "stack";
	/** Ожидаемый номер регистра */
	index: number;
	/** Ожидаемое значение регистра после выполнения */
	value: number;
};
/** Ожидание параметра устройства */
export type InstructionTestExpectedDevice = {
	type: "device";
	/** Пин устройства */
	pin: number;
	/** Параметр устройства */
	prop: number;
	/** Ожидаемое значение параметра после выполнения */
	value: number;
};
/** Ожидание индекса следующей строки (поток выполнения) */
export type InstructionTestExpectedLoop = {
	type: "loop";
	/** Номер следующей строки после выполнения */
	nextLineIndex: number;
};

/** Унифицированный тип ожиданий */
export type InstructionTestExpected =
	| InstructionTestExpectedStack
	| InstructionTestExpectedRegister
	| InstructionTestExpectedDevice
	| InstructionTestExpectedLoop;

export type InstructionTestData = {
	devices?: (
		| {
				pin: number;
				id: number;
				device: Device;
		  }
		| {
				pin: number;
				device: Device;
		  }
		| {
				id: number;
				device: Device;
		  }
	)[];
	/** Заголовок/описание теста (опционально) */
	title?: string;
	/** Код IC10 для выполнения в тесте */
	code: string | string[];
	/** Количество итераций в real context */
	iterations_count?: number;
	/** Список ожидаемых изменений регистров/устройств/потока выполнения */
	expected: InstructionTestExpected[];
};

export abstract class Instruction {
	/** Сырые аргументы инструкции, пришедшие из парсера */
	public args: Argument[] = [];
	/** Контекст исполнения */
	public readonly context: Context;
	/** Строка исходного кода, к которой привязана инструкция */
	public readonly line: Line;
	/** Кэш описаний аргументов (правила валидации/преобразования) */
	public $argumentList: InstructionArgument[];

	/**
	 * Создает экземпляр инструкции.
	 * @param context Контекст исполнения (регистры, устройства, defines и проч.)
	 * @param line Строка исходного кода для трассировки и сообщений об ошибках
	 * @param args Сырые аргументы инструкции
	 */
	public constructor({ context, line, args }: InstructionConstructorType) {
		this.context = context;
		this.line = line;
		this.args = args;
	}

	/**
	 * Кешированный список описаний аргументов.
	 * Вычисляется один раз методом argumentList() и переиспользуется.
	 */
	public get argumentListCached() {
		if (!this.$argumentList) {
			this.$argumentList = this.argumentList();
		}
		return this.$argumentList;
	}

	/**
	 * Набор юнит-тестов для инструкции.
	 * Переопределяется в конкретных реализациях при необходимости.
	 */
	static tests(): InstructionTestData[] {
		return [];
	}

	/**
	 * Точка входа выполнения инструкции.
	 * 1) Получает правила аргументов
	 * 2) Проверяет соответствие количества переданных аргументов правилам
	 * 3) В случае успеха запускает реализацию run()
	 * В случае несоответствия — регистрирует ошибку и завершает выполнение.
	 */
	public execute(): void | Promise<void> {
		const rules = this.argumentList();
		if (this.args.length !== rules.length) {
			this.context.addError(
				new ArgumentIc10Error({
					message: `Invalid count of arguments: ${this.args.length} (expected: ${rules.length})`,
					severity: ErrorSeverity.Strong,
				}).setLine(this.line),
			);
			return;
		}
		return this.run();
	}

	/**
	 * Регистрирует ошибку, автоматически проставляя строку,
	 * а для ArgumentIc10Error — ещё и проблемный аргумент.
	 * @param error Ошибка для регистрации
	 * @param argument Аргумент, вызвавший ошибку (опционально, нужно для ArgumentIc10Error)
	 */
	public addError(error: Ic10Error, argument?: Argument) {
		error.setLine(this.line);
		if (error instanceof ArgumentIc10Error && argument) {
			error.setArgument(argument);
		}
		this.context.addError(error);
	}

	/**
	 * Переопределят функцию end в Line
	 * @see InstructionLine.end
	 * @returns
	 */
	public end(this: InstructionLine): boolean {
		return false;
	}

	/**
	 * Возвращает список правил для аргументов инструкции:
	 * - разрешённые подстановки (alias/const/define/label)
	 * - функция calculate для вычисления значения
	 */
	public abstract argumentList(): InstructionArgument[];

	/**
	 * Реализация логики инструкции.
	 * Здесь уже можно безопасно использовать getArgumentValue()
	 * для получения типизированных значений аргументов.
	 */
	public abstract run(): void | Promise<void>;

	/**
	 * Возвращает вычисленное значение аргумента по индексу или имени.
	 * Выполняет:
	 * - Разрешение имени аргумента в индекс (если передана строка)
	 * - Проверку наличия аргумента и соответствующего правила
	 * - Подстановку define/alias/const/label в зависимости от разрешений в правиле
	 * - Вызов rule.calculate для финального вычисления значения
	 * @param indexOrName Индекс (0-based) или имя аргумента, указанное в правилах
	 * @returns Значение аргумента требуемого типа T (по умолчанию number)
	 */
	public getArgumentValue<T = number>(indexOrName: number | string): T {
		const list = this.argumentListCached;

		// Поддержка передачи имени аргумента
		let index: number;
		if (typeof indexOrName === "string") {
			index = list.findIndex((rule) => rule.name === indexOrName);
			if (index === -1) {
				this.context.addError(
					new ArgumentIc10Error({
						message: `Invalid argument name: ${indexOrName}`,
						severity: ErrorSeverity.Strong,
					}).setLine(this.line),
				);
				return 0 as T;
			}
		} else {
			index = indexOrName;
		}

		if (typeof this.args[index] === "undefined") {
			// Сообщение адаптируем в зависимости от того, было ли передано имя или индекс
			const msg =
				typeof indexOrName === "string" ? `Missing argument: ${indexOrName}` : `Missing argument index: ${index}`;
			this.context.addError(
				new ArgumentIc10Error({
					message: msg,
					severity: ErrorSeverity.Strong,
				}).setLine(this.line),
			);
			return 0 as T;
		}

		const arg = this.args[index];
		if (typeof list[index] === "undefined") {
			this.context.addError(
				new ArgumentIc10Error({
					message:
						typeof indexOrName === "string"
							? `Invalid argument name: ${indexOrName}`
							: `Invalid argument index: ${index}`,
					severity: ErrorSeverity.Strong,
				})
					.setLine(this.line)
					.setArgument(arg),
			);
			return 0 as T;
		}

		const rule = list[index];

		// Подстановка define/alias/const/label, если это разрешено правилом
		if (this.context.hasDefines(arg.text)) {
			const define = this.context.getDefines(arg.text)!;
			switch (define.type) {
				case "define":
					if (rule.canBeDefine) arg.text = define.value;
					break;
				case "alias":
					if (rule.canBeAlias) arg.text = define.value;
					break;
				case "const":
					if (rule.canBeConst) arg.text = define.value;
					break;
				case "label":
					if (rule.canBeLabel) arg.text = define.value;
					break;
			}
		}

		// Делегируем финальное вычисление значения правилу
		return rule.calculate.call(this, this.context, arg) as T;
	}
}
