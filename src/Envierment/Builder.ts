import { parse } from "yaml";
import type { Chip } from "@/Core/Chip";
import type { Device } from "@/Core/Device";
import type { Network } from "@/Core/Network";
import { type Parser, ParserV1 } from "@/Envierment/ParserV1";
import { ErrorSeverity } from "@/Ic10/Errors/Errors";
import type { Ic10Runner } from "@/Ic10/Ic10Runner";
import type { EnvSchema } from "@/Schemas/EnvSchema";

export class Builer {
	private readonly lattestParser = ParserV1;

	public readonly Chips = new Map<number, Chip>();
	public readonly Networks = new Map<string, Network>();
	public readonly Devices = new Map<number, Device>();
	public readonly Runners = new Map<number, Ic10Runner>();
	public readonly FinishedRunners = new Set<number>();

	private initialized = false;

	public reset(): void {
		this.Chips.clear();
		this.Devices.clear();
		this.Networks.clear();
		this.Runners.clear();
		this.FinishedRunners.clear();
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
		return BUILDER;
	}

	// Одноразовая инициализация: прогнать sandbox и проверить ошибки
	public async init(): Promise<boolean> {
		if (this.initialized) return;

		for (const [, runner] of this.Runners.entries()) {
			runner.switchContext("sandbox");
			await runner.run();
			runner.init();

			const err = runner.context.errors.filter((error) => error.severity === ErrorSeverity.Strong);
			if (err.length > 0) {
				return false;
			}

			runner.switchContext("real");
			runner.init();
		}

		this.initialized = true;
		return true;
	}

	// Один тик исполнения без sandbox-прогона
	public async step(): Promise<boolean> {
		const promises: Promise<{ key: any; result: boolean }>[] = [];

		for (const [key, runner] of this.Runners.entries()) {
			if (this.FinishedRunners.has(key)) {
				continue;
			}
			promises.push(runner.step().then((result) => ({ key, result })));
		}

		const results = await Promise.all(promises);

		// Удаляем завершённые runners
		for (const { key, result } of results) {
			if (!result) {
				this.FinishedRunners.add(key);
			}
		}

		// true — если остались активные runners
		return this.Runners.size - this.FinishedRunners.size > 0;
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
