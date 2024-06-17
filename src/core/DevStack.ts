import { Stack } from "../abstract/Device"

export class DevStack extends Stack {

	public data: number[] = []

	constructor() {
		super()
		this.data.fill(0, 0, 512)
		console.log("NEW STACK")
	}

	push(value: number) {
		this.data.push(value)
		return this
	}

	pop() {
		return this.data.pop() || 0
	}

	peek() {
		return this.data[this.data.length - 1] || 0
	}

	put(index: number, value: number): this {
		this.data[index] = value
		return this
	}
	get(index: number): number {
		return this.data[index] || 0
	}
}
