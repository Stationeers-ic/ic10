import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { dirname, join, relative } from "node:path";
import { Glob } from "bun";

console.log("🚀 Whatching ...");

// === НАСТРОЙКИ ===
const CONFIG: {
	watchPath: string;
	debounceDelay: number;
	scripts: {
		pattern: Glob;
		command: string;
	}[];
	ignoreFiles: Glob[];
} = {
	// Путь к отслеживаемой папке
	watchPath: join(dirname(import.meta.dir), "src"),

	// Задержка для debounce (мс)
	debounceDelay: 600,

	// Скрипты для разных шаблонов (в порядке специфичности)
	// Более специфичные шаблоны должны быть выше
	scripts: [
		{
			pattern: new Glob("Ic10/Instruction/**"),
			command: "bun run generate-intruction-index && bun run generate-vscode",
		},
		{
			pattern: new Glob("Defines/**"),
			command: "bun run generate-device",
		},
		{
			pattern: new Glob("Schemas/**"),
			command: "bun run generate-schema",
		},
		{
			pattern: new Glob("**"),
			command: "bun run generate-index",
		},
	],

	// Игнорируемые файлы
	ignoreFiles: [new Glob("**/index.ts"), new Glob("Defines/data.ts"), new Glob("**/*.json")],
};
// === КОНЕЦ НАСТРОЕК ===

console.log(`Watching ${CONFIG.watchPath} for changes...`);

// Для debounce
let timeoutId: NodeJS.Timeout | null = null;
const changedFiles = new Set<string>();

// Функция для проверки, игнорируется ли файл
function isIgnored(filepath: string): boolean {
	const relativePath = relative(`${CONFIG.watchPath}/`, filepath);
	return CONFIG.ignoreFiles.some((glob) => glob.match(relativePath));
}

// Функция для проверки совпадения файла с шаблоном
function matchesPattern(filepath: string, pattern: Glob): boolean {
	const relativePath = relative(`${CONFIG.watchPath}/`, filepath);
	console.warn(relativePath, pattern.match(relativePath));
	return pattern.match(relativePath);
}

// Функция для определения скриптов, которые нужно запустить
function getScriptsToRun(filepaths: string[]): Set<string> {
	const scriptsToRun = new Set<string>();

	for (const filepath of filepaths) {
		for (const { pattern, command } of CONFIG.scripts) {
			if (matchesPattern(filepath, pattern)) {
				scriptsToRun.add(command);
			}
		}
	}
	console.table(scriptsToRun);
	return scriptsToRun;
}

// Функция запуска скрипта
function runScript(command: string) {
	console.log(`\n🔄 Running: ${command}`);

	// Разделяем команды с && и выполняем последовательно
	const commands = command.split("&&").map((cmd) => cmd.trim());

	const runNextCommand = async (index: number) => {
		if (index >= commands.length) {
			console.log(`✅ All commands completed`);
			return;
		}

		const [cmd, ...args] = commands[index].split(" ");
		console.log(`▶️ Executing: ${cmd} ${args.join(" ")}`);

		const child = spawn(cmd, args, { stdio: "inherit", shell: true });

		child.on("close", (code) => {
			if (code === 0) {
				console.log(`✅ Command completed: ${commands[index]}`);
				runNextCommand(index + 1);
			} else {
				console.log(`❌ Command failed with code ${code}: ${commands[index]}`);
			}
		});
	};

	runNextCommand(0);
}

const watcher = watch(CONFIG.watchPath, { recursive: true }, (event, filename) => {
	const filepath = join(CONFIG.watchPath, filename);

	if (!filename || isIgnored(filepath)) {
		return;
	}
	console.log(`Detected ${event} in ${filename}`);

	// Добавляем файл в набор изменений
	changedFiles.add(filepath);

	// Сбрасываем предыдущий таймер
	if (timeoutId) {
		clearTimeout(timeoutId);
	}

	// Устанавливаем новый таймер
	timeoutId = setTimeout(() => {
		if (changedFiles.size > 0) {
			console.log(`\n📁 Processing ${changedFiles.size} changed files...`);

			// Определяем какие скрипты нужно запустить
			const scriptsToRun = getScriptsToRun(Array.from(changedFiles));

			if (scriptsToRun.size > 0) {
				console.log(`🚀 Will run ${scriptsToRun.size} script(s):`);
				scriptsToRun.forEach((script) => console.log(`  - ${script}`));

				// Запускаем все необходимые скрипты
				scriptsToRun.forEach(runScript);
			} else {
				console.log(`ℹ️ No scripts to run for the changes`);
			}

			// Очищаем набор изменений
			changedFiles.clear();
		}
		timeoutId = null;
	}, CONFIG.debounceDelay);
});

process.on("SIGINT", () => {
	console.log("Closing watcher...");

	// Очищаем таймер
	if (timeoutId) {
		clearTimeout(timeoutId);
	}

	watcher.close();
	process.exit(0);
});
