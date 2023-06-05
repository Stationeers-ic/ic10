import { Ic10Error } from "./Ic10Error";
import { Memory } from "./Memory";
import { Device } from "./Device";
export type ReturnCode = "hcf" | "end" | "die";
export declare const Execution: {
    display: (e: Ic10Error | any) => any;
};
export type InterpreterIc10Settings = {
    debug: boolean;
    debugCallback: Function;
    logCallback: (s: string, out: string[]) => void;
    executionCallback: (err: Ic10Error) => void;
    tickTime: number;
};
export declare class InterpreterIc10 {
    code: string;
    commands: {
        command: string | undefined;
        args: string[];
    }[];
    lines: string[];
    memory: Memory;
    position: number;
    interval: any;
    labels: {
        [key: string]: number;
    };
    constants: {};
    output: {
        debug: string;
        log: string;
        error: string;
    };
    settings: InterpreterIc10Settings;
    ignoreLine: Array<number>;
    device?: Device;
    constructor(code?: string, settings?: Partial<InterpreterIc10Settings>);
    setSettings(settings?: Partial<InterpreterIc10Settings>): InterpreterIc10;
    init(text: string, device?: Device): InterpreterIc10;
    __updateDevice(): void;
    stop(): InterpreterIc10;
    run(): Promise<unknown>;
    prepareLine(line?: number, isDebugger?: boolean): ReturnCode | true;
    runUntilSync(cond: (status: true | ReturnCode) => boolean, maxIterations?: number): number;
    __issetLabel(x: string): boolean;
    define(alias: string, value: number | string): void;
    alias(alias: string, target: string): void;
    __op<Args extends number[]>(op: (...args: Args) => number, register: string, ...args: {
        [K in keyof Args]: string;
    }): void;
    move(register: string, value: string): void;
    __move(register: string, value: string): void;
    add(register: string, a: string, b: string): void;
    sub(register: string, a: string, b: string): void;
    mul(register: string, a: string, b: string): void;
    div(register: string, a: string, b: string): void;
    mod(register: string, a: string, b: string): void;
    sqrt(register: string, v: string): void;
    round(register: string, v: string): void;
    trunc(register: string, v: string): void;
    ceil(register: string, v: string): void;
    floor(register: string, v: string): void;
    max(register: string, a: string, b: string): void;
    minx(register: string, a: string, b: string): void;
    abs(register: string, v: string): void;
    log(register: string, v: string): void;
    exp(register: string, v: string): void;
    rand(register: string, v: string): void;
    sin(register: string, v: string): void;
    cos(register: string, v: string): void;
    tan(register: string, v: string): void;
    asin(register: string, v: string): void;
    acos(register: string, v: string): void;
    atan(register: string, v: string): void;
    atan2(register: string, a: string, b: string): void;
    yield(): void;
    sleep(s: number): void;
    select(register: string, a: string, b: string, c: string): void;
    hcf(): void;
    __jump(line: number): void;
    __call(line: number): void;
    __getJumpTarget(target: string): number;
    j(target: string): void;
    jr(offset: string): void;
    jal(target: string): void;
    __eq(a: number, b?: number): boolean;
    __ge(a: number, b?: number): boolean;
    __gt(a: number, b?: number): boolean;
    __le(a: number, b?: number): boolean;
    __lt(a: number, b?: number): boolean;
    __ne(a: number, b?: number): boolean;
    __ap(x: number, y: number, c?: number): boolean;
    __na(x: number, y: number, c?: number): boolean;
    __dse(d: string): boolean;
    __dns(d: string): boolean;
    __nan(v: number): boolean;
    __nanz(v: number): boolean;
    __sOp<Args extends number[]>(op: (...args: Args) => boolean, register: string, ...args: {
        [K in keyof Args]: string;
    }): void;
    seq(register: string, a: string, b: string): void;
    seqz(register: string, a: string): void;
    sge(register: string, a: string, b: string): void;
    sgez(register: string, a: string): void;
    sgt(register: string, a: string, b: string): void;
    sgtz(register: string, a: string): void;
    sle(register: string, a: string, b: string): void;
    slez(register: string, a: string): void;
    slt(register: string, a: string, b: string): void;
    sltz(register: string, a: string): void;
    sne(register: string, a: string, b: string): void;
    snez(register: string, a: string): void;
    sap(register: string, x: string, y: string, c: string): void;
    sapz(register: string, x: string, y: string): void;
    sna(register: string, x: string, y: string, c: string): void;
    snaz(register: string, x: string, y: string): void;
    sdse(register: string, d: string): void;
    sdns(register: string, d: string): void;
    snan(register: string, v: string): void;
    snanz(register: string, v: string): void;
    __bOp<Args extends number[]>(op: (...args: Args) => boolean | undefined, line: string, ...args: {
        [K in keyof Args]: string;
    }): void;
    __bROp<Args extends number[]>(op: (...args: Args) => boolean | undefined, offset: string, ...args: {
        [K in keyof Args]: string;
    }): void;
    __bCOp<Args extends number[]>(op: (...args: Args) => boolean | undefined, line: string, ...args: {
        [K in keyof Args]: string;
    }): void;
    beq(a: string, b: string, line: string): void;
    beqz(a: string, line: string): void;
    bge(a: string, b: string, line: string): void;
    bgez(a: string, line: string): void;
    bgt(a: string, b: string, line: string): void;
    bgtz(a: string, line: string): void;
    ble(a: string, b: string, line: string): void;
    blez(a: string, line: string): void;
    blt(a: string, b: string, line: string): void;
    bltz(a: string, line: string): void;
    bne(a: string, b: string, line: string): void;
    bnez(a: string, line: string): void;
    bap(x: string, y: string, c: string, line: string): void;
    bapz(x: string, y: string, line: string): void;
    bna(x: string, y: string, c: string, line: string): void;
    bnaz(x: string, y: string, line: string): void;
    bdse(d: string, line: string): void;
    bdns(d: string, line: string): void;
    bnan(v: string, line: string): void;
    breq(a: string, b: string, offset: string): void;
    breqz(a: string, offset: string): void;
    brge(a: string, b: string, offset: string): void;
    brgez(a: string, offset: string): void;
    brgt(a: string, b: string, offset: string): void;
    brgtz(a: string, offset: string): void;
    brle(a: string, b: string, offset: string): void;
    brlez(a: string, offset: string): void;
    brlt(a: string, b: string, offset: string): void;
    brltz(a: string, offset: string): void;
    brne(a: string, b: string, offset: string): void;
    brnez(a: string, offset: string): void;
    brap(x: string, y: string, c: string, offset: string): void;
    brapz(x: string, y: string, offset: string): void;
    brna(x: string, y: string, c: string, offset: string): void;
    brnaz(x: string, y: string, offset: string): void;
    brdse(d: string, offset: string): void;
    brdns(d: string, offset: string): void;
    brnan(v: string, offset: string): void;
    beqal(a: string, b: string, line: string): void;
    beqzal(a: string, line: string): void;
    bgeal(a: string, b: string, line: string): void;
    bgezal(a: string, line: string): void;
    bgtal(a: string, b: string, line: string): void;
    bgtzal(a: string, line: string): void;
    bleal(a: string, b: string, line: string): void;
    blezal(a: string, line: string): void;
    bltal(a: string, b: string, line: string): void;
    bltzal(a: string, line: string): void;
    bneal(a: string, b: string, line: string): void;
    bnezal(a: string, line: string): void;
    bapal(x: string, y: string, c: string, line: string): void;
    bapzal(x: string, y: string, line: string): void;
    bnaal(x: string, y: string, c: string, line: string): void;
    bnazal(x: string, y: string, line: string): void;
    bdseal(d: string, line: string): void;
    bdnsal(d: string, line: string): void;
    push(a: string): void;
    pop(register: string): void;
    peek(register: string): void;
    __transformBatch(values: number[], mode: string): number;
    __getDevices(hash: number, name?: number): Device<string>[];
    l(register: string, device: string, property: string): void;
    __l(register: string, device: string, property: string): void;
    ls(register: string, device: string, slot: string, property: string): void;
    s(device: string, property: string, value: string): void;
    __s(device: string, property: string, value: string): void;
    lb(register: string, deviceHash: string, property: string, mode: string): void;
    lr(register: string, device: string, mode: string, property: string): void;
    sb(deviceHash: string, property: string, value: string): void;
    lbn(targetRegister: string, deviceHash: string, nameHash: string, property: string, batchMode: string): void;
    sbn(deviceHash: string, nameHash: string, property: string, value: string): void;
    lbs(register: string, deviceHash: string, slotIndex: string, property: string, batchMode: string): void;
    lbns(register: string, deviceHash: string, nameHash: string, slotIndex: string, property: string, batchMode: string): void;
    ss(device: string, slotIndex: string, property: string, value: string): void;
    sbs(deviceHash: string, slotIndex: string, property: string, value: string): void;
    and(register: string, a: string, b: string): void;
    or(register: string, a: string, b: string): void;
    xor(register: string, a: string, b: string): void;
    nor(register: string, a: string, b: string): void;
    _debug(...args: string[]): void;
    _log(...args: string[]): void;
    _d0(op1: any): void;
    _d1(op1: any): void;
    _d2(op1: any): void;
    _d3(op1: any): void;
    _d4(op1: any): void;
    _d5(op1: any): void;
    __d(device: string, args: any): void;
    __debug(p: string, iArguments: string[]): void;
}
export default InterpreterIc10;
