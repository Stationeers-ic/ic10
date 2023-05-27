import InterpreterIc10 from "./main";
import { Environ } from "./Environ";
import { MemoryCell } from "./MemoryCell";
import { MemoryStack } from "./MemoryStack";
import { Device } from "./Device";
import { ConstantCell } from "./ConstantCell";
import { Hash, Port, Register, Stack } from "./types";
export declare class Memory {
    #private;
    cells: Array<MemoryCell | MemoryStack>;
    environ: Environ;
    aliases: Record<string, MemoryCell | Device | ConstantCell>;
    constructor(scope: InterpreterIc10);
    get scope(): InterpreterIc10 | null;
    cell(cell: string | number, op1?: any, op2?: any): any;
    getCell(cell: Stack): MemoryStack;
    getCell(cell: Register): MemoryCell;
    getCell(cell: Port): Device;
    getCell(cell: Hash): number;
    getCell(cell: string | number): MemoryCell | MemoryStack | Device | number;
    findHash(name: string | number): number | undefined;
    findRegister(name: string | number): MemoryCell | undefined;
    getRegister(name: string | number): MemoryCell;
    findDevice(name: string | number): Device | undefined;
    getDevice(name: string | number): Device;
    findValue(value: string | number): number | undefined;
    getValue(value: string | number): number;
    alias(name: string | number, link: string | number): this;
    define(name: string, value: string | number): void;
    toLog(): {
        [key: string]: any;
    };
}
