import { Line } from "../core/Line";
import EventEmitter from "eventemitter3";
import { AnyFunctionName } from "../ZodTypes";
import { Err } from "./Err";
import { FunctionData } from "../functions";
type EnvironmentEvents = {
    error: (err: Err) => void;
    warn: (err: Err) => void;
    info: (err: Err) => void;
    debug: (err: Err) => void;
};
type BeforeFunction = Record<`before_${AnyFunctionName}`, (data: FunctionData, line: Line) => void>;
type AfterFunction = Record<`after_${AnyFunctionName}`, (data: FunctionData, line: Line) => void>;
type EventNames = EnvironmentEvents & BeforeFunction & AfterFunction;
export declare abstract class Environment extends EventEmitter<EventNames, Environment> {
    isTest: boolean;
    line: number;
    lines: ReadonlyArray<Line | null>;
    InfiniteLoopLimit: number;
    errors: Err[];
    errorCounter: number;
    getLine(index: number): Line | null | undefined;
    getCurrentLine(): Line | null | undefined;
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
    on<T extends EventEmitter.EventNames<EventNames>>(event: T, fn: EventEmitter.EventListener<EventNames, T>): this;
    addListener<T extends EventEmitter.EventNames<EventNames>>(event: T, fn: EventEmitter.EventListener<EventNames, T>): this;
    once<T extends EventEmitter.EventNames<EventNames>>(event: T, fn: EventEmitter.EventListener<EventNames, T>): this;
    removeListener<T extends EventEmitter.EventNames<EventNames>>(event: T, fn?: EventEmitter.EventListener<EventNames, T>): this;
}
export default Environment;
