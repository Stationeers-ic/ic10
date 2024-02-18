import { Line } from "../core/Line";
import EventEmitter from "eventemitter3";
import { Err } from "./Err";
declare interface EnvironmentEvents {
    error: (err: Err) => void;
    warn: (err: Err) => void;
    info: (err: Err) => void;
    debug: (err: Err) => void;
}
export declare abstract class Environment extends EventEmitter<EnvironmentEvents> {
    line: number;
    lines: Map<number, Line>;
    InfiniteLoopLimit: number;
    errors: Err[];
    getLine(index: number): Line | undefined;
    getCurrentLine(): Line | undefined;
    abstract jump(line: string | number): void;
    abstract get(name: string | number): number;
    abstract set(name: string, value: number): void;
    abstract push(name: string | number): void;
    abstract pop(): number;
    abstract peek(): number;
    abstract hasDevice(name: string): boolean;
    abstract getDeviceByHash(hash: number): string[];
    abstract getDeviceByHashAndName(hash: number, name: number): string[];
    abstract alias(alias: string, value: string | number): void;
    abstract getAlias(alias: string): string;
    throw(err: Err): void;
    abstract hcf(): void;
    afterLineRun(line: Line): Promise<void>;
    dynamicDevicePort(string: string): string;
    on<T extends EventEmitter.EventNames<EnvironmentEvents>>(event: T, fn: EventEmitter.EventListener<EnvironmentEvents, T>): this;
    addListener<T extends EventEmitter.EventNames<EnvironmentEvents>>(event: T, fn: EventEmitter.EventListener<EnvironmentEvents, T>): this;
    once<T extends EventEmitter.EventNames<EnvironmentEvents>>(event: T, fn: EventEmitter.EventListener<EnvironmentEvents, T>): this;
    removeListener<T extends EventEmitter.EventNames<EnvironmentEvents>>(event: T, fn?: EventEmitter.EventListener<EnvironmentEvents, T>): this;
}
export default Environment;
