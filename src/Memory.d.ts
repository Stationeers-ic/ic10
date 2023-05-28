import InterpreterIc10 from "./main";
import { Environ } from "./Environ";
import { RegisterCell } from "./RegisterCell";
import { MemoryStack } from "./MemoryStack";
import { Device } from "./Device";
import { ValueCell } from "./ValueCell";
export declare class Memory {
    #private;
    cells: Array<RegisterCell>;
    stack: MemoryStack;
    environ: Environ;
    aliases: Record<string, ValueCell | Device>;
    constructor(scope: InterpreterIc10);
    get scope(): InterpreterIc10 | null;
    reset(): void;
    findRegister(name: string | number): RegisterCell | undefined;
    getRegister(name: string | number): RegisterCell;
    findDevice(name: string | number): Device | undefined;
    getDevice(name: string | number): Device;
    findValue(value: string | number): number | undefined;
    getValue(value: string | number): number;
    alias(name: string | number, link: string): Memory;
    define(name: string, value: string | number): void;
    toLog(): {
        [key: string]: any;
    };
}
