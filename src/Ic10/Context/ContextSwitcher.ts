import i18next from "i18next";
import type { Context } from "@/Ic10/Context/Context";
import type { Ic10Error } from "@/Ic10/Errors/Errors";

export type contextNames = "real" | "sandbox";
export type contextList<T extends string | number | symbol = contextNames> = {
	[key in T]: Context;
};

export type ContextTypeConstructor<T extends string | number | symbol = contextNames> = {
	contexts: contextList<T>;
	defaultContext: keyof contextList<T>;
};

function isContextTypeConstructor<T extends string | number | symbol = contextNames>(name: any, list: any): name is T {
	if (typeof name !== "string") {
		return false;
	}
	return name in list;
}

/**
 * Класс для переключения контекстов
 */
export class ContextSwitcher<T extends string | number | symbol = contextNames> {
	private readonly contexts: contextList<T>;
	private readonly defaultContext: keyof contextList<T>;
	private currentContext?: string;

	constructor({ contexts, defaultContext }: ContextTypeConstructor<T>) {
		this.contexts = contexts;
		this.defaultContext = defaultContext;
	}

	get name() {
		return this.currentContext ?? this.defaultContext;
	}

	get context(): Context {
		return this.getContext();
	}

	public getContext(name?: T | string): Context {
		name = name || this.currentContext || this.defaultContext;
		if (isContextTypeConstructor<T>(name, this.contexts)) {
			return this.contexts[name];
		}
		throw new Error(i18next.t("error.context_not_found", { name: name.toString() }));
	}

	switchContext(name: string) {
		if (name in this.contexts) {
			this.currentContext = name;
			return this;
		}
		throw new Error(i18next.t("error.context_not_found", { name: name.toString() }));
	}

	/**
	 * Получить уникальные ошибки из всех контекстов
	 */
	getErrors(): Ic10Error[] {
		const map = new Map<number, Ic10Error>();
		Object.keys(this.contexts).forEach((name) => {
			if (isContextTypeConstructor<T>(name, this.context)) {
				const context = this.contexts[name];
				context.errors.forEach((err) => {
					if (!map.has(err.id)) {
						map.set(err.id, err);
					}
				});
			}
		});
		return Array.from(map.values());
	}
}
