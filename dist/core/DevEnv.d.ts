import type Line from "./Line";
import type Err from "../abstract/Err";
import Environment from "../abstract/Environment";
import { z } from "zod";
declare const ZodDevice: z.ZodUnion<[z.ZodRecord<z.ZodString, z.ZodNumber>, z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNumber>>, z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodNumber>>>]>;
type ZodDevice = z.infer<typeof ZodDevice>;
export declare class DevEnv extends Environment {
    line: number;
    lines: Array<Line | null>;
    errors: Err[];
    errorCounter: number;
    devices: Map<string, ZodDevice>;
    devicesAttached: Map<string, string>;
    data: any;
    stack: number[];
    aliases: Map<string, string | number>;
    constructor(data?: {
        [key: string]: number;
    });
    getDevices(): Map<string, Record<string, number> | Record<string, Record<string, number>> | Record<string, Record<string, Record<string, number>>>>;
    getCurrentLine(): Line | null | undefined;
    addLine(line: Line | null): this;
    setLine(index: number, line: Line): this;
    getLine(index: number): Line | null | undefined;
    getPosition(): number;
    addPosition(modify: number): this;
    setPosition(index: number): this;
    appendDevice(hash: number, name?: number): string;
    removeDevice(id: string): this;
    attachDevice(id: string, port: string): this;
    detachDevice(id: string): this;
    get(name: string | number): number;
    set(name: string, value: number): this;
    alias(name: string, value: string | number): this;
    jump(line: string | number): this;
    peek(): number;
    pop(): number;
    push(name: string | number): this;
    getAlias(alias: string): string;
    hasDevice(port: string): boolean;
    hcf(): this;
    getLines(): (Line | null)[];
    getDeviceByHash(hash: number, logic: string): number[];
    getDeviceByHashAndName(hash: number, name: number, logic: string): number[];
    getSlotDeviceByHash(hash: number, slot: number, logic: string): number[];
    getSlotDeviceByHashAndName(hash: number, name: number, slot: number, logic: string): number[];
    setDeviceByHash(hash: number, logic: string, value: number): this;
    setDeviceByHashAndName(hash: number, name: number, logic: string, value: number): this;
    setSlotDeviceByHash(hash: number, slot: number, logic: string, value: number): this;
    throw(err: Err): this;
    getErrorCount(): number;
    getErrors(): Err[];
}
export default DevEnv;
