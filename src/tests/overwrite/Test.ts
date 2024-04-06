import DevEnv from "../../core/DevEnv"
import InterpreterIc10 from "../../InterpreterIc10"

class TestEnv extends DevEnv {}

class TestIc10 extends InterpreterIc10<TestEnv> {
	getEnv(): TestEnv {
		return new TestEnv()
	}
}

const a = new TestIc10(new TestEnv(), "")

const b = a.getEnv()
