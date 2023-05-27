import { MemoryCell } from "./MemoryCell";
import { DeviceProperties } from "./DeviceProperties";
import InterpreterIc10 from "./main";
import { Slot } from "./Slot";
export declare class Device extends MemoryCell {
    #private;
    number: number;
    hash: number;
    properties: DeviceProperties;
    constructor(scope: InterpreterIc10, name: string, number: number);
    get scope(): InterpreterIc10;
    get(variable: any): Device | number | Slot[];
    set(variable: any, value: any): MemoryCell;
    getSlot(op1: string | number, op2?: any): number | Slot;
    setSlot(op1: string, op2: any, value: any): void;
}
