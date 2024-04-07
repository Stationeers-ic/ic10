import DevEnv from "../../core/DevEnv"
import InterpreterIc10 from "../../InterpreterIc10"

class TestEnv extends DevEnv<{ test: () => void }> {}

class TestIc10 extends InterpreterIc10<TestEnv> {
	getEnv(): TestEnv {
		this.env.on("test", () => {})
		return new TestEnv()
	}
}

const a = new TestIc10(new TestEnv(), "")

const b = a.getEnv()
