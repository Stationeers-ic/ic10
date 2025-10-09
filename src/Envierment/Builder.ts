import { parse } from "yaml";
import type { Device } from "@/Core/Device";
import type { Network } from "@/Core/Network";
import { type Parser, ParserV1 } from "@/Envierment/ParserV1";
import { ErrorSeverity } from "@/Ic10/Errors/Errors";
import type { Ic10Runner } from "@/Ic10/Ic10Runner";
import type { EnvSchema } from "@/Schemas/EnvSchema";

export class Builer {
	private readonly lattestParser = ParserV1;

	public readonly Networks = new Map<string, Network>();
	public readonly Devices = new Map<number, Device>();
	public readonly Runners = new Map<number, Ic10Runner>();

	private initialized = false;

	public reset(): void {
		this.Devices.clear();
		this.Networks.clear();
		this.Runners.clear();
		this.initialized = false;
	}

	static from(yml: string): Builer {
		const BUILDER = new Builer();
		const data = parse(yml) as EnvSchema;
		let Parser: Parser;
		switch (data.version) {
			case 1:
				Parser = new ParserV1({ builer: BUILDER });
				break;
		}
		Parser.parse(data);
		// При желании можно сразу инициализировать:
		// BUILDER.init();
		return BUILDER;
	}

	// Одноразовая инициализация: прогнать sandbox и проверить ошибки
	public init(): void {
		if (this.initialized) return;

		for (const [, runner] of this.Runners.entries()) {
			runner.switchContext("sandbox");
			runner.run();
			runner.init();

			const err = runner.context.errors.filter((error) => error.severity === ErrorSeverity.Strong);
			if (err.length > 0) {
				throw new Error("errors");
			}

			runner.switchContext("real");
		}

		this.initialized = true;
	}

	// Один тик исполнения без sandbox-прогона
	public async step(): Promise<boolean> {
		// Если нужно, можно принудительно требовать init перед step:
		// if (!this.initialized) throw new Error("Call init() before step()");

		const promises: Promise<{ key: any; result: boolean }>[] = [];

		for (const [key, runner] of this.Runners.entries()) {
			promises.push(runner.step().then((result) => ({ key, result })));
		}

		const results = await Promise.all(promises);

		// Удаляем завершённые runners
		for (const { key, result } of results) {
			if (!result) {
				this.Runners.delete(key);
			}
		}

		// true — если остались активные runners
		return this.Runners.size > 0;
	}

	public toYaml(): string {
		return new this.lattestParser({ builer: this }).stringify();
	}

	[Symbol.toPrimitive](hint: string): string {
		return this.toYaml();
	}
	valueOf(): string {
		return this.toYaml();
	}
	toString(): string {
		return this.toYaml();
	}
}
