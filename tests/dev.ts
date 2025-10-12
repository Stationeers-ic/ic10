import { createRunner } from "@tests/helpers";
import { ErrorSeverity } from "@/Ic10/Errors/Errors";
import { setLanguage } from "@/i18n";
import { en } from "@/lang";

await setLanguage("en", en);

const code = `
move r0 99
s db Mode 1
s db Setting STR("TEST")
`;
const runner = createRunner(code, {
	register_length: 16,
	stack_length: 512,
	hash: 125,
});
console.log("Запуск в песочнице");
await runner.init().run();
runner.context.errors.forEach((error) => {
	console.error(error.formated_message);
});
const err = runner.context.errors.filter((error) => error.severity === ErrorSeverity.Strong);
if (err.length === 0) {
	console.log("Запуск в рабочей среде");
	await runner.switchContext().run();
	runner.context.errors.forEach((error) => {
		console.error(error.formated_message);
	});
}
console.table(runner.realContext.chip.registers);

const props = runner.realContext.housing.props;
const keys = Reflect.ownKeys(props);
const table = keys.map((key: string) => ({
	property: key,
	value: props[key],
}));
console.table(table);
runner.contextSwitcher.getErrors().forEach((e) => {
	console.log(e.formated_message);
});
