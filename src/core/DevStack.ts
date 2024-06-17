import { Stack } from "../abstract/Device"

export class DevStack extends Stack {
	private stack: number[] = []

	async push(value: number) {
		this.stack.push(value)
		return this
	}

	async pop() {
		return this.stack.pop() || 0
	}

	async peek() {
		return this.stack[this.stack.length - 1] || 0
	}
}
