# ic10

ic10 interpiter

[npm](https://www.npmjs.com/package/ic10)

typescript :

```typescript
import { Ic10Error, InterpreterIc10 } from "./main"
var fs = require("fs")
var code = fs.readFileSync(".ic10", "utf8")
var settings = {
	debug: true,
	debugCallback: function () {
		console.log(...arguments)
	},
	logCallback: function () {
		console.log(...arguments)
	},
	executionCallback: function (e: Ic10Error) {},
}
var interpreterIc10 = new InterpreterIc10(code, settings)
// OR
interpreterIc10.init(code)

interpreterIc10.run()
```
