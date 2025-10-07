import fs from "node:fs";
import generate from "@babel/generator";
import * as t from "@babel/types";
import axios from "axios";
import cliProgress from "cli-progress";
import JSON5 from "json5";

console.log("🚀 Generating download...");

// Проверяем наличие флага --missing в аргументах
const missingMode = process.argv.includes("--missing");

export async function downloadWithProgress(url: string, varName: string) {
	const { headers } = await axios.head(url);
	const totalLength = parseInt(headers["content-length"], 10);

	const bar = new cliProgress.SingleBar(
		{
			format: `${varName} |{bar}| {percentage}% | {value}/{total} bytes`,
		},
		cliProgress.Presets.shades_classic,
	);

	bar.start(totalLength, 0);

	const response = await axios.get(url, { responseType: "stream" });

	let data = "";
	let receivedLength = 0;

	response.data.on("data", (chunk: Buffer) => {
		receivedLength += chunk.length;
		bar.update(receivedLength);
		data += chunk.toString();
	});

	await new Promise((resolve, reject) => {
		response.data.on("end", resolve);
		response.data.on("error", reject);
	});

	bar.stop();

	return data;
}

export function saveAsTsFile(json: any, outPath: string, varName: string, type = " as const") {
	const tsContent = `export const ${varName} = ${JSON.stringify(json, null, 2)}${type};\nexport default ${varName};`
		.replace(/"NaN"/g, "NaN")
		.replace(/"Infinity"/g, "Infinity")
		.replace(/"-Infinity"/g, "-Infinity");

	fs.writeFileSync(outPath, tsContent);
	console.log(`Файл ${outPath} успешно создан!`);
}

async function downloadConsts() {
	const outPath = "src/Defines/consts.ts";

	if (missingMode && fs.existsSync(outPath)) {
		console.log(`Файл ${outPath} уже существует, пропускаем...`);
		return;
	}

	const data = await downloadWithProgress("https://assets.ic10.dev/consts.json", "CONSTS");
	const json = JSON5.parse(data);

	// Функция для рекурсивной сортировки объекта по ключам
	function sortObjectKeys(obj: any): any {
		if (typeof obj !== "object" || obj === null) return obj;

		if (Array.isArray(obj)) {
			return obj.map(sortObjectKeys);
		}

		const sorted: any = {};
		Object.keys(obj)
			.sort()
			.forEach((key) => {
				sorted[key] = sortObjectKeys(obj[key]);
			});
		return sorted;
	}

	// Создаем группированный объект
	const grouped: any = {};

	// Сначала сортируем исходный JSON
	const sortedJson = sortObjectKeys(json);

	for (const key in sortedJson) {
		if (key.includes(".")) {
			const [namespace, prop] = key.split(".");
			if (!grouped[namespace]) {
				grouped[namespace] = {};
			}
			grouped[namespace][prop] = sortedJson[key];
		} else {
			grouped[key] = sortedJson[key];
		}
	}

	// Сортируем группированный объект
	const sortedGrouped = sortObjectKeys(grouped);

	// Сохраняем оба объекта в один файл
	const tsContent =
		`export const CONSTS = ${JSON5.stringify(sortedJson, null, 2)} as const;\n` +
		`export const GROUPED_CONSTS = ${JSON5.stringify(sortedGrouped, null, 2)} as const;\n` +
		`export default CONSTS;`;

	fs.writeFileSync(
		outPath,
		tsContent
			.replace(/["']NaN["']/, "NaN")
			.replace(/["']Infinity["']/, "Infinity")
			.replace(/["']-Infinity["']/, "-Infinity"),
	);
	console.log(`Файл ${outPath} успешно создан!`);
}

async function downloadInstructions() {
	const outPath = "src/Defines/instructions.ts";

	if (missingMode && fs.existsSync(outPath)) {
		console.log(`Файл ${outPath} уже существует, пропускаем...`);
		return;
	}

	const data = await downloadWithProgress("https://assets.ic10.dev/languages/EN/instructions.json", "INSTRUCTIONS");
	const json = JSON5.parse(data);
	saveAsTsFile(json, outPath, "INSTRUCTIONS");
}

async function downloadReagents() {
	const outPath = "src/Defines/reagents.ts";

	if (missingMode && fs.existsSync(outPath)) {
		console.log(`Файл ${outPath} уже существует, пропускаем...`);
		return;
	}

	const data = await downloadWithProgress("https://assets.ic10.dev/languages/EN/reagents.json", "INSTRUCTIONS");
	const json = JSON5.parse(data).data;
	saveAsTsFile(json, outPath, "REAGENTS");
}

async function downloadDevices() {
	const dataPath = "src/Defines/devices.ts";

	if (missingMode && fs.existsSync(dataPath)) {
		console.log(`Файлы устройств уже существуют, пропускаем...`);
		return;
	}

	// Загружаем устройства
	const output = await downloadWithProgress("https://assets.ic10.dev/languages/EN/devices.json", "DEVICES");

	// Загружаем теги
	const tagsOutput = await downloadWithProgress("https://assets.ic10.dev/tags.json", "TAGS");
	const responseData = JSON5.parse(output);
	const tagsData = JSON5.parse(tagsOutput);
	const items: Record<string, any> = {};
	responseData.data
		.filter((item: any) => item.logics.length > 0)
		.forEach((item: any) => {
			items[item.id] = item;
		});

	// Генерация AST для файла TypeScript
	const ast = generateDevicesAST(items, responseData, tagsData);
	const { code } = generate(ast);

	fs.writeFileSync(dataPath, code);
	console.log(`Файл ${dataPath} успешно создан!`);
}

function generateDevicesAST(items: Record<string, any>, responseData: any, tagsData: any) {
	// Создаем массив объявлений для файла
	const declarations: t.Statement[] = [];

	// 1. Добавляем переменную DEVICES с правильным типом
	const devicesVariable = t.variableDeclaration("const", [
		t.variableDeclarator(
			t.identifier("DEVICES"),
			t.tsAsExpression(t.valueToNode(items), t.tsTypeReference(t.identifier("DevicesType"))),
		),
	]);
	declarations.push(t.exportNamedDeclaration(devicesVariable));

	// 2. Добавляем экспорт по умолчанию
	const defaultExport = t.exportDefaultDeclaration(t.identifier("DEVICES"));
	declarations.push(defaultExport);

	// 3. Генерируем типы на основе responseData
	declarations.push(...generateTypesFromResponseData(responseData, tagsData));

	return t.program(declarations);
}

function generateTypesFromResponseData(responseData: any, tagsData: any): t.Statement[] {
	const statements: t.Statement[] = [];
	const devices = responseData.data;

	// Собираем уникальные значения для connections и mods
	const { uniqueConnections, uniqueMods } = collectUniqueValues(devices);

	// 1. Генерируем отдельные типы для каждого ключа DeviceType
	statements.push(...generateDevicePropertyTypes(devices, tagsData, uniqueConnections, uniqueMods));

	// 2. DeviceType interface
	const deviceInterface = generateDeviceInterface(devices, tagsData);
	statements.push(deviceInterface);

	// 3. DevicesType - правильная индексная сигнатура
	const devicesType = t.exportNamedDeclaration(
		t.tsTypeAliasDeclaration(
			t.identifier("DevicesType"),
			null,
			t.tsTypeReference(
				t.identifier("Record"),
				t.tsTypeParameterInstantiation([t.tsNumberKeyword(), t.tsTypeReference(t.identifier("DeviceType"))]),
			),
		),
	);
	statements.push(devicesType);

	return statements;
}

// Функция для сбора уникальных значений connections и mods
function collectUniqueValues(devices: any[]): { uniqueConnections: string[]; uniqueMods: string[] } {
	const connectionsSet = new Set<string>();
	const modsSet = new Set<string>();

	devices.forEach((device) => {
		// Собираем уникальные connections
		if (device.connections && Array.isArray(device.connections)) {
			device.connections.forEach((connection: string) => {
				if (connection && typeof connection === "string") {
					connectionsSet.add(connection);
				}
			});
		}

		// Собираем уникальные mods
		if (device.mods && Array.isArray(device.mods)) {
			device.mods.forEach((mod: string) => {
				if (mod && typeof mod === "string") {
					modsSet.add(mod);
				}
			});
		}
	});

	return {
		uniqueConnections: Array.from(connectionsSet).sort(),
		uniqueMods: Array.from(modsSet).sort(),
	};
}

function generateDevicePropertyTypes(
	devices: any[],
	tagsData: any,
	uniqueConnections: string[],
	uniqueMods: string[],
): t.Statement[] {
	const statements: t.Statement[] = [];
	const propertySamples: Record<string, any> = {};

	// Собираем все возможные ключи и их примеры значений из всех устройств
	devices.forEach((device) => {
		if (device && typeof device === "object") {
			Object.keys(device).forEach((key) => {
				if (!propertySamples[key] && !isEmpty(device[key])) {
					propertySamples[key] = device[key];
				}
			});
		}
	});

	// Создаем отдельные export type для каждого свойства
	Object.entries(propertySamples).forEach(([key, sampleValue]) => {
		const typeName = `${key.charAt(0).toUpperCase() + key.slice(1)}Type`;

		// Специальная обработка для tags
		if (key === "tags" && Array.isArray(tagsData)) {
			const typeAnnotation = generateTagsType(tagsData);
			statements.push(t.exportNamedDeclaration(t.tsTypeAliasDeclaration(t.identifier(typeName), null, typeAnnotation)));
		}
		// Специальная обработка для connections
		else if (key === "connections" && uniqueConnections.length > 0) {
			const typeAnnotation = generateUnionArrayType(uniqueConnections);
			statements.push(t.exportNamedDeclaration(t.tsTypeAliasDeclaration(t.identifier(typeName), null, typeAnnotation)));
		}
		// Специальная обработка для mods
		else if (key === "mods" && uniqueMods.length > 0) {
			const typeAnnotation = generateUnionArrayType(uniqueMods);
			statements.push(t.exportNamedDeclaration(t.tsTypeAliasDeclaration(t.identifier(typeName), null, typeAnnotation)));
		} else {
			const typeAnnotation = getTypeAnnotationForValue(sampleValue, true);
			statements.push(t.exportNamedDeclaration(t.tsTypeAliasDeclaration(t.identifier(typeName), null, typeAnnotation)));
		}
	});

	return statements;
}

function generateDeviceInterface(devices: any[], tagsData: any): t.Statement {
	const properties: t.TSPropertySignature[] = [];
	const propertySamples: Record<string, any> = {};

	// Собираем все возможные ключи из всех устройств
	devices.forEach((device) => {
		if (device && typeof device === "object") {
			Object.keys(device).forEach((key) => {
				if (!propertySamples[key] && !isEmpty(device[key])) {
					propertySamples[key] = device[key];
				}
			});
		}
	});

	// Создаем свойства интерфейса, используя сгенерированные типы
	Object.keys(propertySamples).forEach((key) => {
		const typeName = `${key.charAt(0).toUpperCase() + key.slice(1)}Type`;

		properties.push(
			t.tsPropertySignature(t.identifier(key), t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)))),
		);
	});

	return t.exportNamedDeclaration(
		t.tsInterfaceDeclaration(t.identifier("DeviceType"), null, null, t.tsInterfaceBody(properties)),
	);
}

// Функция для генерации union типа из массива строк
function generateUnionArrayType(values: string[]): t.TSType {
	const literalTypes = values.map((value) => t.tsLiteralType(t.stringLiteral(value)));
	const unionType = t.tsUnionType(literalTypes);
	return t.tsArrayType(unionType);
}

// Специальная функция для генерации типа тегов
function generateTagsType(tagsData: string[]): t.TSType {
	// Создаем union type из всех значений тегов
	const literalTypes = tagsData.map((tag) => t.tsLiteralType(t.stringLiteral(tag)));

	const unionType = t.tsUnionType(literalTypes);

	// Создаем массив этого union type
	return t.tsArrayType(unionType);
}

function isEmpty(value: any): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === "string") return value.trim() === "";
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === "object") return Object.keys(value).length === 0;
	return false;
}

// Вспомогательная функция для определения типа на основе значения
function getTypeAnnotationForValue(value: any, allowNull: boolean = false): t.TSType {
	const baseType = getBaseTypeAnnotation(value, 0);

	if (allowNull) {
		return t.tsUnionType([baseType, t.tsNullKeyword()]);
	}
	return baseType;
}

function getBaseTypeAnnotation(value: any, depth: number = 0): t.TSType {
	if (value === null) {
		return t.tsNullKeyword();
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return t.tsArrayType(t.tsAnyKeyword());
		}

		// Собираем уникальные типы элементов
		const elementTypes = new Set<string>();
		let elementSample: any = null;

		value.forEach((item) => {
			if (item != null) {
				const type = getBaseTypeAnnotation(item, depth);
				const typeKey = generateTypeKey(type);
				elementTypes.add(typeKey);
				if (!elementSample) elementSample = type;
			}
		});

		if (elementTypes.size === 0) {
			return t.tsArrayType(t.tsAnyKeyword());
		}

		// Если все элементы одного типа, используем его
		if (elementTypes.size === 1) {
			return t.tsArrayType(elementSample);
		}

		// Для множества типов создаем объединение, но убираем дубликаты
		const uniqueTypes = Array.from(elementTypes)
			.map((key) => parseTypeKey(key, depth))
			.reduce((acc, type) => {
				// Убираем дубликаты на основе ключей типов
				const typeKey = generateTypeKey(type);
				if (!acc.some((existing) => generateTypeKey(existing) === typeKey)) {
					acc.push(type);
				}
				return acc;
			}, [] as t.TSType[]);

		return t.tsArrayType(uniqueTypes.length === 1 ? uniqueTypes[0] : t.tsUnionType(uniqueTypes));
	}

	if (typeof value === "string") {
		return t.tsStringKeyword();
	} else if (typeof value === "number") {
		return t.tsNumberKeyword();
	} else if (typeof value === "boolean") {
		return t.tsBooleanKeyword();
	} else if (typeof value === "object") {
		// Если достигли максимальной глубины рекурсии, возвращаем any
		if (depth >= 3) {
			return t.tsAnyKeyword();
		}

		// Генерируем интерфейс для объекта
		const properties: t.TSPropertySignature[] = [];
		const allKeys = new Set<string>();
		const keySamples: Record<string, any> = {};

		// Собираем все ключи и их примеры значений
		if (Array.isArray(value)) {
			value.forEach((item) => {
				if (item && typeof item === "object") {
					Object.keys(item).forEach((key) => {
						allKeys.add(key);
						if (!keySamples[key] && item[key] != null) {
							keySamples[key] = item[key];
						}
					});
				}
			});
		} else {
			Object.keys(value).forEach((key) => {
				allKeys.add(key);
				if (!keySamples[key] && value[key] != null) {
					keySamples[key] = value[key];
				}
			});
		}

		// Для каждого ключа определяем тип
		allKeys.forEach((key) => {
			const sampleValue = keySamples[key];
			if (sampleValue != null) {
				const typeAnnotation = getBaseTypeAnnotation(sampleValue, depth + 1);

				const property = t.tsPropertySignature(t.identifier(key), t.tsTypeAnnotation(typeAnnotation));
				properties.push(property);
			}
		});

		return t.tsTypeLiteral(properties);
	}

	return t.tsAnyKeyword();
}

// Генерирует уникальный ключ для типа (для устранения дубликатов)
function generateTypeKey(type: t.TSType): string {
	switch (type.type) {
		case "TSStringKeyword":
			return "string";
		case "TSNumberKeyword":
			return "number";
		case "TSBooleanKeyword":
			return "boolean";
		case "TSNullKeyword":
			return "null";
		case "TSUndefinedKeyword":
			return "undefined";
		case "TSAnyKeyword":
			return "any";
		case "TSArrayType":
			return `array<${generateTypeKey(type.elementType)}>`;
		case "TSUnionType": {
			const unionKeys = type.types.map((t) => generateTypeKey(t)).sort();
			return `union<${unionKeys.join("|")}>`;
		}
		case "TSTypeLiteral": {
			const propKeys = type.members
				.filter((m): m is t.TSPropertySignature => m.type === "TSPropertySignature")
				.map((m) => `${String(m.key)}:${generateTypeKey(m.typeAnnotation!.typeAnnotation)}`)
				.sort();
			return `object<{${propKeys.join(",")}}>`;
		}
		default:
			return "unknown";
	}
}

// Парсит ключ обратно в тип (упрощенная версия)
function parseTypeKey(key: string, depth: number): t.TSType {
	if (key === "string") return t.tsStringKeyword();
	if (key === "number") return t.tsNumberKeyword();
	if (key === "boolean") return t.tsBooleanKeyword();
	if (key === "null") return t.tsNullKeyword();
	if (key === "undefined") return t.tsUndefinedKeyword();
	if (key === "any") return t.tsAnyKeyword();

	if (key.startsWith("array<")) {
		const innerKey = key.slice(6, -1);
		return t.tsArrayType(parseTypeKey(innerKey, depth));
	}

	if (key.startsWith("union<")) {
		const innerKeys = key.slice(6, -1).split("|");
		const types = innerKeys.map((k) => parseTypeKey(k, depth));
		return types.length === 1 ? types[0] : t.tsUnionType(types);
	}

	if (key.startsWith("object<")) {
		// Для объектов возвращаем упрощенный тип
		return t.tsAnyKeyword();
	}

	return t.tsAnyKeyword();
}

await downloadConsts();
await downloadInstructions();
await downloadDevices();
await downloadReagents();
