# ic10

[npm](https://www.npmjs.com/package/ic10)

## Простое использование

typescript :

```typescript
import { InterpreterIc10, DevEnv } from "ic10"
;(async () => {
	const mem = new DevEnv()
	// подписываемся на ошибки
	mem.on("error", (e) => console.error(e.format()))
	// подписываемся на предупреждения
	// mem.on("warn", (e) => console.warn(e))

	try {
		const a = new InterpreterIc10(
			mem,
			`
			alias test d0
`,
		)
		await a.testCode()
	} catch (e: unknown) {
		console.error("ПИЗДЕЦ Бляяяяяяяя", e)
	}
})()
```

## Написание своего окружения

#### Тезисно:

1. Наследуемся от `Environment`
2. в get и set функциях используется "точечная" адресация

    - адресация вида `a.b.c` означает что мы обращаемся к объекту `a` и запрашиваем у него свойство `b` и у него свойство `c`

    **Примеры:**

    - d0.Activate
    - d0.Slots.1.Quantity
    - d0.Channels.1

3. добавляем устройства сначала в окружение `appendDevice`, а потом подключаем к порту `attachDevice`
4. в функциях `get` и `set` обязательно должны быть эти строки
    ```typescript
    name = this.dynamicRegister(name)
    name = this.dynamicDevicePort(name)
    ```
    Это нужно, чтобы обрабатывать динамические адреса и динамические порты такие как `rrr1` и `drrr1`
