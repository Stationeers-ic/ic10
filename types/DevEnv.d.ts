import { Environment } from "./abstract/Environment.js";
export declare class DevEnv extends Environment {
    data: any;
    aliases: Map<string, string | number>;
    get(name: string): any;
    set(name: string, value: string | number): void;
    alias(alias: string, value: string | number): void;
}
