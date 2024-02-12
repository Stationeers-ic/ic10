import {Line} from "../core/Line";
import EventEmitter from 'eventemitter3';

export abstract class Environment extends EventEmitter {
    public line: number = 0;
    public InfiniteLoopLimit: number = 500;

    abstract jump(line: string | number): void;

    abstract get(name: string | number): number ;
    abstract set(name: string, value: number): void;

    abstract push(name: string | number): void;
    abstract pop(): number;
    abstract peek(): number;

    abstract hasDevice(name: string): boolean;

    abstract getDeviceByHash(hash: number): string[];

    abstract getDeviceByHashAndName(hash: number, name: number): string[];

    abstract alias(alias: string, value: string | number): void;
    abstract getAlias(alias: string): string;

    afterLineRun(line: Line) {
    }
}