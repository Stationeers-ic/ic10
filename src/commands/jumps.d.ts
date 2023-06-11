import { Scope } from "./core";
import { Conditions } from "./conditions";
export declare const makeJumpCommands: (scope: Scope, conditions: Conditions) => {
    j: (target: string) => number;
    jr: (offset: string) => void;
    jal: (target: string) => void;
    beq: (a: string, b: string, line: string) => void;
    beqz: (a: string, line: string) => void;
    bge: (a: string, b: string, line: string) => void;
    bgez: (a: string, line: string) => void;
    bgt: (a: string, b: string, line: string) => void;
    bgtz: (a: string, line: string) => void;
    ble: (a: string, b: string, line: string) => void;
    blez: (a: string, line: string) => void;
    blt: (a: string, b: string, line: string) => void;
    bltz: (a: string, line: string) => void;
    bne: (a: string, b: string, line: string) => void;
    bnez: (a: string, line: string) => void;
    bap: (x: string, y: string, c: string, line: string) => void;
    bapz: (x: string, y: string, line: string) => void;
    bna: (x: string, y: string, c: string, line: string) => void;
    bnaz: (x: string, y: string, line: string) => void;
    bdse: (d: string, line: string) => void;
    bdns: (d: string, line: string) => void;
    bnan: (v: string, line: string) => void;
    breq: (a: string, b: string, offset: string) => void;
    breqz: (a: string, offset: string) => void;
    brge: (a: string, b: string, offset: string) => void;
    brgez: (a: string, offset: string) => void;
    brgt: (a: string, b: string, offset: string) => void;
    brgtz: (a: string, offset: string) => void;
    brle: (a: string, b: string, offset: string) => void;
    brlez: (a: string, offset: string) => void;
    brlt: (a: string, b: string, offset: string) => void;
    brltz: (a: string, offset: string) => void;
    brne: (a: string, b: string, offset: string) => void;
    brnez: (a: string, offset: string) => void;
    brap: (x: string, y: string, c: string, offset: string) => void;
    brapz: (x: string, y: string, offset: string) => void;
    brna: (x: string, y: string, c: string, offset: string) => void;
    brnaz: (x: string, y: string, offset: string) => void;
    brdse: (d: string, offset: string) => void;
    brdns: (d: string, offset: string) => void;
    brnan: (v: string, offset: string) => void;
    beqal: (a: string, b: string, line: string) => void;
    beqzal: (a: string, line: string) => void;
    bgeal: (a: string, b: string, line: string) => void;
    bgezal: (a: string, line: string) => void;
    bgtal: (a: string, b: string, line: string) => void;
    bgtzal: (a: string, line: string) => void;
    bleal: (a: string, b: string, line: string) => void;
    blezal: (a: string, line: string) => void;
    bltal: (a: string, b: string, line: string) => void;
    bltzal: (a: string, line: string) => void;
    bneal: (a: string, b: string, line: string) => void;
    bnezal: (a: string, line: string) => void;
    bapal: (x: string, y: string, c: string, line: string) => void;
    bapzal: (x: string, y: string, line: string) => void;
    bnaal: (x: string, y: string, c: string, line: string) => void;
    bnazal: (x: string, y: string, line: string) => void;
    bdseal: (d: string, line: string) => void;
    bdnsal: (d: string, line: string) => void;
};