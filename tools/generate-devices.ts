import fs from "node:fs/promises";
import path from "node:path";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { toPascalCase } from "js-convert-case";
import { DEVICES, type DeviceType } from "@/index";

console.log("🚀 Generating devices...");
const outDir = path.resolve(process.cwd(), "src", "Devices");

// ==================== TYPES ====================

// Расширяем DeviceType для поддержки дополнительных свойств
interface ExtendedDeviceType extends DeviceType {
	PowerCapacity?: number;
	Cooling?: number;
	HeatTransfer?: number;
	HeatCapacity?: number;
	Volume?: number;
	DataType?: string;
}

type BaseSpec = {
	baseName: string;
	importFrom: string;
	ctorType: string;
	groups?: string[];
	getExtraProps?: (device: ExtendedDeviceType) => Record<string, any>;
	omitFields?: string[];
};

type BaseRule = BaseSpec & {
	match: (device: ExtendedDeviceType) => boolean;
};

export type ClassGenerator = {
	// Основные свойства
	className: string;
	baseSpec: BaseSpec;
	device: ExtendedDeviceType;

	// AST узлы
	imports: Map<string, Set<string>>;
	classBody: t.ClassBody;
	constructorParams: t.Pattern | null;
	superCall: t.CallExpression | null;

	// Методы для модификации
	addImport: (from: string, what: string) => void;
	addClassMember: (member: t.ClassMethod | t.ClassProperty | t.ClassPrivateProperty) => void;
	updateConstructor: (params: t.Pattern, body: t.BlockStatement) => void;
	updateSuperCall: (call: t.CallExpression) => void;
	setBaseSpec: (spec: BaseSpec) => void;
	generateCode: () => string;
};

export type Plugin = {
	/** Проверяет, должен ли плагин применяться к устройству */
	match: (device: ExtendedDeviceType) => boolean;
	/** Модифицирует генератор класса */
	transform: (device: ExtendedDeviceType, generator: ClassGenerator) => void;
};

// ==================== BASE RULES ====================

const hasProgrammableChipSlot = (d: ExtendedDeviceType): boolean =>
	Array.isArray(d.slots) && d.slots.some((s) => s?.SlotType === "Programmable Chip");

const BASE_RULES: BaseRule[] = [
	{
		baseName: "Housing",
		importFrom: "@/Core/Housing",
		ctorType: "SocketDeviceConstructor",
		match: hasProgrammableChipSlot,
		getExtraProps: (device) => ({
			pin_count: device.deviceConnectCount,
		}),
		omitFields: ["hash", "pin_count"],
	},
	{
		baseName: "Structure",
		importFrom: "@/Core/Device",
		ctorType: "DeviceConstructor",
		match: (d) => (d.tags ?? []).includes("Structure"),
	},
	{
		baseName: "Item",
		importFrom: "@/Core/Device",
		ctorType: "DeviceConstructor",
		match: (d) => (d.tags ?? []).includes("Item"),
	},
];
// ==================== GENERATION ====================
function boolMethod(name, value) {
	const hasMethod = t.classMethod(
		"method",
		t.identifier(name),
		[],
		t.blockStatement([t.returnStatement(t.booleanLiteral(value))]),
	);
	hasMethod.returnType = t.tsTypeAnnotation(t.tsBooleanKeyword());
	return hasMethod;
}

// ==================== PLUGINS ====================

const PLUGINS: Plugin[] = [];

// ==================== CLASS GENERATOR IMPLEMENTATION ====================

class ClassGeneratorImpl implements ClassGenerator {
	public className: string;
	public baseSpec: BaseSpec;
	public device: ExtendedDeviceType;

	public imports: Map<string, Set<string>> = new Map();
	public classBody: t.ClassBody;
	public constructorParams: t.Pattern | null = null;
	public superCall: t.CallExpression | null = null;

	constructor(device: ExtendedDeviceType, baseSpec: BaseSpec) {
		this.device = device;
		this.baseSpec = baseSpec;
		this.className = toPascalCase(device.Key);
		this.classBody = t.classBody([]);

		if (!this.className) {
			throw new Error(`Invalid class name for device key: ${device.Key}`);
		}

		this.initializeBaseStructure();
	}

	private initializeBaseStructure() {
		// Добавляем базовые импорты
		this.addImport(this.baseSpec.importFrom, this.baseSpec.baseName);
		this.addImport(this.baseSpec.importFrom, this.baseSpec.ctorType);

		// Создаем параметры конструктора
		const omitFields = this.baseSpec.omitFields || ["hash"];
		const omitType = t.tsTypeReference(
			t.identifier("Omit"),
			t.tsTypeParameterInstantiation([
				t.tsTypeReference(t.identifier(this.baseSpec.ctorType)),
				t.tsUnionType(omitFields.map((f) => t.tsLiteralType(t.stringLiteral(f)))),
			]),
		);

		this.constructorParams = t.objectPattern([t.restElement(t.identifier("args"))]);
		(this.constructorParams as any).typeAnnotation = t.tsTypeAnnotation(omitType);

		// Создаем вызов super()
		const extraProps = this.baseSpec.getExtraProps?.(this.device) || {};
		const superProps: (t.ObjectProperty | t.SpreadElement)[] = [
			t.spreadElement(t.identifier("args")),
			...Object.entries(extraProps).map(([key, value]) =>
				t.objectProperty(
					t.identifier(key),
					typeof value === "number" ? t.numericLiteral(value) : t.stringLiteral(String(value)),
				),
			),
			t.objectProperty(t.identifier("hash"), t.numericLiteral(this.device.PrefabHash)),
		];

		this.superCall = t.callExpression(t.super(), [t.objectExpression(superProps)]);

		// Создаем конструктор
		const classConstructor = t.classMethod(
			"constructor",
			t.identifier("constructor"),
			[this.constructorParams],
			t.blockStatement([t.expressionStatement(this.superCall)]),
		);

		this.addClassMember(classConstructor);
	}

	addImport(from: string, what: string) {
		if (!this.imports.has(from)) {
			this.imports.set(from, new Set());
		}
		this.imports.get(from)!.add(what);
	}

	addClassMember(member: t.ClassMethod | t.ClassProperty) {
		this.classBody.body.push(member);
	}

	updateConstructor(params: t.Pattern, body: t.BlockStatement) {
		this.constructorParams = params;

		// Находим и обновляем конструктор
		const constructorIndex = this.classBody.body.findIndex(
			(member) => t.isClassMethod(member) && member.kind === "constructor",
		);

		if (constructorIndex !== -1) {
			const classConstructor = this.classBody.body[constructorIndex] as t.ClassMethod;
			classConstructor.params = [params];
			classConstructor.body = body;
		}
	}

	updateSuperCall(call: t.CallExpression) {
		this.superCall = call;

		// Обновляем вызов super в конструкторе
		const constructorIndex = this.classBody.body.findIndex(
			(member) => t.isClassMethod(member) && member.kind === "constructor",
		);

		if (constructorIndex !== -1) {
			const classConstructor = this.classBody.body[constructorIndex] as t.ClassMethod;
			const superStatementIndex = classConstructor.body.body.findIndex(
				(stmt) =>
					t.isExpressionStatement(stmt) && t.isCallExpression(stmt.expression) && t.isSuper(stmt.expression.callee),
			);

			if (superStatementIndex !== -1) {
				classConstructor.body.body[superStatementIndex] = t.expressionStatement(call);
			}
		}
	}

	setBaseSpec(spec: BaseSpec) {
		// Обновляем базовый класс
		const oldBase = this.baseSpec.baseName;
		this.baseSpec = spec;

		// Обновляем импорты
		this.imports.clear();
		this.addImport(spec.importFrom, spec.baseName);
		this.addImport(spec.importFrom, spec.ctorType);

		// Переинициализируем базовую структуру
		this.initializeBaseStructure();

		console.log(`Changed base class for ${this.className} from ${oldBase} to ${spec.baseName}`);
	}

	generateCode(): string {
		// Собираем импорты
		const importDeclarations: t.ImportDeclaration[] = [];
		for (const [source, specifiers] of this.imports) {
			importDeclarations.push(
				t.importDeclaration(
					Array.from(specifiers).map((spec) => t.importSpecifier(t.identifier(spec), t.identifier(spec))),
					t.stringLiteral(source),
				),
			);
		}

		// Создаем класс
		const classDecl = t.exportNamedDeclaration(
			t.classDeclaration(t.identifier(this.className), t.identifier(this.baseSpec.baseName), this.classBody),
		);

		// Генерируем код
		const program = t.program([...importDeclarations, classDecl]);
		const { code } = generate(program, { retainLines: true, concise: false });
		return `/* Auto-generated. Do not edit. */\n${code.trim()}`;
	}
}

// ==================== UTILITY FUNCTIONS ====================

function getBaseSpec(device: ExtendedDeviceType): BaseSpec | null {
	for (const rule of BASE_RULES) {
		if (rule.match(device)) {
			return rule;
		}
	}
	return null;
}

function createClassGenerator(device: ExtendedDeviceType, base: BaseSpec): ClassGenerator {
	const generator = new ClassGeneratorImpl(device, base);

	// Применяем плагины
	for (const plugin of PLUGINS) {
		if (plugin.match(device)) {
			try {
				plugin.transform(device, generator);
			} catch (error) {
				console.warn(`⚠️ Plugin failed for device ${device.Key}:`, error);
			}
		}
	}

	return generator;
}

function renderClass(device: ExtendedDeviceType, base: BaseSpec): string {
	const generator = createClassGenerator(device, base);
	return generator.generateCode();
}

// ==================== FILE SYSTEM FUNCTIONS ====================

async function ensureDir(dir: string) {
	await fs.mkdir(dir, { recursive: true });
}

async function writeDeviceFile(className: string, code: string) {
	const outPath = path.join(outDir, `${className}.ts`);
	await fs.writeFile(outPath, code, "utf8");
}

// ==================== INDEX GENERATION ====================

function buildIndexContent(devices: ExtendedDeviceType[]): string {
	const header = `// Auto-generated. Do not edit.\n/* eslint-disable */\n`;

	type Entry = {
		device: ExtendedDeviceType;
		className: string;
		baseName: string;
	};

	const entries: Entry[] = [];
	for (const d of devices) {
		const base = getBaseSpec(d);
		if (!base) continue;
		entries.push({
			device: d,
			className: toPascalCase(d.Key),
			baseName: base.baseName,
		});
	}

	entries.sort((a, b) => a.className.localeCompare(b.className));

	// Импорты
	const importDecls = entries.map((e) =>
		t.importDeclaration(
			[t.importSpecifier(t.identifier(e.className), t.identifier(e.className))],
			t.stringLiteral(`./${e.className}`),
		),
	);

	// DeviceClasses = [Class1, Class2, ...] as const
	const deviceClassesArray = t.arrayExpression(entries.map((e) => t.identifier(e.className)));
	const deviceClassesDecl = t.exportNamedDeclaration(
		t.variableDeclaration("const", [
			t.variableDeclarator(
				t.identifier("DeviceClasses"),
				t.tsAsExpression(deviceClassesArray, t.tsTypeReference(t.identifier("const"))),
			),
		]),
	);

	// DeviceClassesByBase
	const byBase = new Map<string, Entry[]>();
	for (const e of entries) {
		if (!byBase.has(e.baseName)) byBase.set(e.baseName, []);
		byBase.get(e.baseName)!.push(e);
	}

	const baseNames = Array.from(byBase.keys()).sort();
	const classesByBaseProps: t.ObjectProperty[] = baseNames.map((baseName) => {
		const classes = byBase.get(baseName)!.map((e) => t.identifier(e.className));
		return t.objectProperty(
			t.stringLiteral(baseName),
			t.tsAsExpression(t.arrayExpression(classes), t.tsTypeReference(t.identifier("const"))),
		);
	});

	const classesByBaseDecl = t.exportNamedDeclaration(
		t.variableDeclaration("const", [
			t.variableDeclarator(
				t.identifier("DeviceClassesByBase"),
				t.tsAsExpression(t.objectExpression(classesByBaseProps), t.tsTypeReference(t.identifier("const"))),
			),
		]),
	);

	// DevicesByPrefabName
	const byPrefabNameEntries = entries
		.filter((e) => e.device.PrefabName != null)
		.sort((a, b) => String(a.device.PrefabName).localeCompare(String(b.device.PrefabName)));

	const prefabNameProps: t.ObjectProperty[] = byPrefabNameEntries.map((e) =>
		t.objectProperty(t.stringLiteral(String(e.device.PrefabName)), t.identifier(e.className)),
	);

	const devicesByPrefabNameDecl = t.exportNamedDeclaration(
		t.variableDeclaration("const", [
			t.variableDeclarator(
				t.identifier("DevicesByPrefabName"),
				t.tsAsExpression(t.objectExpression(prefabNameProps), t.tsTypeReference(t.identifier("const"))),
			),
		]),
	);

	// Сборка программы
	const program = t.program([...importDecls, deviceClassesDecl, classesByBaseDecl, devicesByPrefabNameDecl]);

	const { code } = generate(program, { retainLines: true, concise: false });
	return header + code;
}

// ==================== MAIN FUNCTION ====================

async function main() {
	await ensureDir(outDir);

	const totalInput = Object.values(DEVICES).length;

	const seenClassNames = new Set<string>();
	const countsByBase = new Map<string, number>();

	let skipNoBase = 0;
	let skipInvalidName = 0;
	let skipDuplicate = 0;

	const generated: ExtendedDeviceType[] = [];
	const tasks: Promise<any>[] = [];

	// Статистика по плагинам
	const pluginStats = new Map<string, number>();
	for (const plugin of PLUGINS) {
		pluginStats.set(plugin.transform.name, 0);
	}

	for (const device of Object.values(DEVICES) as ExtendedDeviceType[]) {
		const base = getBaseSpec(device);
		if (!base) {
			skipNoBase++;
			continue;
		}

		const className = toPascalCase(device.Key);
		if (!className) {
			skipInvalidName++;
			continue;
		}

		if (seenClassNames.has(className)) {
			skipDuplicate++;
			continue;
		}
		seenClassNames.add(className);

		try {
			const code = renderClass(device, base);
			generated.push(device);
			countsByBase.set(base.baseName, (countsByBase.get(base.baseName) ?? 0) + 1);
			tasks.push(writeDeviceFile(className, code));

			// Собираем статистику по плагинам
			for (const plugin of PLUGINS) {
				if (plugin.match(device)) {
					pluginStats.set(plugin.transform.name, (pluginStats.get(plugin.transform.name) ?? 0) + 1);
				}
			}
		} catch (err) {
			console.warn(`⚠️  Failed to generate class for ${device.Key}:`, err);
			skipInvalidName++;
		}
	}

	await Promise.all(tasks);

	const indexTs = buildIndexContent(generated);
	await fs.writeFile(path.join(outDir, "index.ts"), indexTs, "utf8");

	const generatedWithPrefabName = generated.filter((d) => d.PrefabName != null);
	const missingPrefabNameCount = generated.length - generatedWithPrefabName.length;

	const prefabNameCounts = new Map<string, number>();
	for (const d of generatedWithPrefabName) {
		const key = String(d.PrefabName);
		prefabNameCounts.set(key, (prefabNameCounts.get(key) ?? 0) + 1);
	}
	const prefabNameDuplicates = Array.from(prefabNameCounts.entries()).filter(([, n]) => n > 1);
	prefabNameDuplicates.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

	const filesWritten = generated.length + 1;
	const skippedTotal = skipNoBase + skipInvalidName + skipDuplicate;
	const uniqueBases = Array.from(countsByBase.keys()).sort();

	const lines: string[] = [];
	lines.push("—".repeat(60));
	lines.push("Отчет генерации устройств");
	lines.push(`Выходная папка: ${outDir}`);
	lines.push(`Всего входных устройств: ${totalInput}`);
	lines.push(`Сгенерировано классов: ${generated.length}`);
	lines.push(`Записано файлов: ${filesWritten} (включая index.ts)`);
	lines.push("");
	lines.push("По базовым типам:");
	if (uniqueBases.length === 0) {
		lines.push("  — нет сгенерированных классов");
	} else {
		for (const baseName of uniqueBases) {
			lines.push(`  ${baseName}: ${countsByBase.get(baseName)}`);
		}
	}
	lines.push("");
	lines.push(`Пропущено устройств: ${skippedTotal}`);
	lines.push(`  — без подходящего base: ${skipNoBase}`);
	lines.push(`  — некорректное имя класса: ${skipInvalidName}`);
	lines.push(`  — дубликат имени класса: ${skipDuplicate}`);
	lines.push("");
	lines.push("Статистика по плагинам:");
	let hasPluginStats = false;
	for (const [pluginName, count] of pluginStats) {
		if (count > 0) {
			lines.push(`  ${pluginName}: применен к ${count} устройствам`);
			hasPluginStats = true;
		}
	}
	if (!hasPluginStats) {
		lines.push("  — плагины не применялись");
	}
	lines.push("");
	lines.push(`PrefabName среди сгенерированных:`);
	lines.push(`  — с PrefabName: ${generatedWithPrefabName.length}`);
	lines.push(`  — без PrefabName: ${missingPrefabNameCount}`);
	if (prefabNameDuplicates.length > 0) {
		lines.push(`  — дубликаты ключей PrefabName: ${prefabNameDuplicates.length}`);
		const maxToShow = 10;
		const sample = prefabNameDuplicates.slice(0, maxToShow);
		lines.push("    Примеры:");
		for (const [name, count] of sample) {
			lines.push(`      "${name}": ${count}`);
		}
		if (prefabNameDuplicates.length > maxToShow) {
			lines.push(`      ... и ещё ${prefabNameDuplicates.length - maxToShow}`);
		}
	} else {
		lines.push("  — дубликаты ключей PrefabName: не обнаружены");
	}
	lines.push("—".repeat(60));

	console.log(lines.join("\n"));
}

main().catch((err) => {
	console.error("❌ Ошибка генерации:", err);
	process.exit(1);
});
