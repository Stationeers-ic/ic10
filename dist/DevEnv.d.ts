import { Environment } from "./abstract/Environment";
export declare class DevEnv extends Environment {
    constructor(data?: {
        [key: string]: number;
    });
    data: any;
    stack: number[];
    aliases: Map<string, string | number>;
    pathValidate(path: string): boolean;
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
}
