import { createRunner } from "@tests/helpers";
import { ErrorSeverity } from "@/Ic10/Errors/Errors";

const code = `

push 1

j 0
`;
const runner = createRunner(code, {
	register_length: 18,
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
// console.table(runner.realContext.chip.registers);

const props = runner.realContext.housing.props!;
const keys = Reflect.ownKeys(props);
const table = keys.map((key: string | symbol) => ({
	property: key,
	value: (props as any)[key],
}));
// console.table(table);
runner.contextSwitcher.getErrors().forEach((e) => {
	console.log(e.formated_message);
});
