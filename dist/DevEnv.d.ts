import {Environment} from "./abstract/Environment";
import Line from "./core/Line";

export declare class DevEnv extends Environment {
    private line;
    private lines;
    data: any;
    stack: number[];
    private aliases;
    constructor(data?: {
        [key: string]: number;
    });
    addLine(line: Line | null): void;
    setLine(index: number, line: Line): void;
    getLine(index: number): Line | null;
    getPosition(): number;
    addPosition(modify: number): void;
    setPosition(index: number): void;
    appendDevice(hash: number, name?: number): string;
    removeDevice(id: string): void;
    attachDevice(id: string, port: string): string;
    detachDevice(id: string): void;
    get(name: string | number): number;
    set(name: string, value: number): void;
    alias(name: string, value: string | number): void;
    jump(line: string | number): void;
    peek(): number;
    pop(): number;
    push(name: string | number): void;
    getAlias(alias: string): string;
    hasDevice(name: string): boolean;
    getDeviceByHash(hash: number): string[];
    getDeviceByHashAndName(hash: number, name: number): string[];
    hcf(): void;
    getLines(): (Line | null)[];
}
export default DevEnv;
