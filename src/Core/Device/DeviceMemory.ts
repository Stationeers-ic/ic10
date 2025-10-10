import { DeviceScope, type DeviceScopeConstructor } from "@/Core/Device/DeviceScope";
import type { StackInterface } from "../Stack";

export type DeviceMemoryConstructor = {
	stack_length: number;
} & DeviceScopeConstructor;

export class DeviceMemory extends DeviceScope implements StackInterface {
	protected readonly $stack: Map<number, number> = new Map();
	public readonly stack_length: number;

	constructor(props: DeviceMemoryConstructor) {
		super(props);
		this.stack_length = props.stack_length;
	}
	public get length(): number {
		return this.$stack.size;
	}

	public get(index: number): number {
		return this.$stack.get(index) ?? 0;
	}

	public set(index: number, value: number): void {
		this.$stack.set(index, value);
	}

	public delete(index: number): void {
		if (this.$stack.has(index)) {
			this.$stack.delete(index);
		}
	}

	public push(value: number): void {
		this.$stack.set(this.$stack.size, value);
	}

	public pop(): number {
		if (this.$stack.size > 0) {
			const value = this.$stack.get(this.$stack.size - 1);
			this.$stack.delete(this.$stack.size - 1);
			return value;
		} else {
			return 0;
		}
	}

	public reset(): void {
		this.$stack.clear();
	}
}
