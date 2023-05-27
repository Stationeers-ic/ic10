"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const main_1 = require("./main");
const Environ_1 = require("./Environ");
const MemoryCell_1 = require("./MemoryCell");
const MemoryStack_1 = require("./MemoryStack");
const Device_1 = require("./Device");
const ConstantCell_1 = require("./ConstantCell");
const types_1 = require("./types");
class Memory {
    cells;
    environ;
    aliases;
    #scope;
    constructor(scope) {
        this.#scope = scope;
        this.cells = new Array(18);
        this.environ = new Environ_1.Environ(scope);
        this.aliases = {};
        for (let i = 0; i < 18; i++) {
            const n = `r${i}`;
            if (i === 16) {
                this.cells[i] = new MemoryStack_1.MemoryStack(scope, n);
            }
            else {
                this.cells[i] = new MemoryCell_1.MemoryCell(scope, n);
            }
        }
    }
    get scope() {
        return null;
    }
    cell(cell, op1 = null, op2 = null) {
        if (typeof cell === "string") {
            if (cell == 'sp')
                cell = 'r16';
            if (cell == 'ra')
                cell = 'r17';
            if (main_1.regexes.rr1.test(cell)) {
                let m = main_1.regexes.rr1.exec(cell);
                if (m) {
                    let m1 = this.cell(cell.replace(m[1], this.cell(m[1])), op1, op2) ?? false;
                    if (m1 !== false) {
                        return m1;
                    }
                    throw main_1.Execution.error(this.#scope.position, 'Unknown cell', m1);
                }
                throw main_1.Execution.error(this.#scope.position, 'Syntax error');
            }
            if (main_1.regexes.r1.test(cell)) {
                let m = main_1.regexes.r1.exec(cell);
                if (m && m[1] in this.cells) {
                    const index = parseInt(m[1]);
                    if (op1 === null) {
                        return this.cells[index].get();
                    }
                    else {
                        return this.cells[index].set(null, this.cell(op1));
                    }
                }
                else {
                    throw main_1.Execution.error(this.#scope.position, 'Unknown cell', cell);
                }
            }
            if (main_1.regexes.d1.test(cell)) {
                if (cell in this.environ) {
                    if (op1 === null) {
                        throw main_1.Execution.error(this.#scope.position, 'Have not `Port`', cell);
                    }
                    else {
                        if (op2 !== null) {
                            return this.environ.get(cell)?.set(op1, this.cell(op2));
                        }
                        return this.environ.get(cell)?.get(op1);
                    }
                }
                else {
                    throw main_1.Execution.error(this.#scope.position, 'Unknown cell', cell);
                }
            }
            if (cell in this.aliases) {
                if (this.aliases[cell].constructor.name === 'MemoryCell') {
                    if (op1 === null) {
                        return this.aliases[cell].get(null);
                    }
                    else {
                        return this.aliases[cell].set(null, this.cell(op1));
                    }
                }
                else if (this.aliases[cell] instanceof Device_1.Device) {
                    if (op1 === null) {
                        throw main_1.Execution.error(this.#scope.position, 'Have not `Port`', cell);
                    }
                    else {
                        if (op2 !== null) {
                            return this.aliases[cell].set(op1, this.cell(op2));
                        }
                        return this.aliases[cell].get(op1);
                    }
                }
                else if (this.aliases[cell] instanceof ConstantCell_1.ConstantCell) {
                    return this.aliases[cell].get(null);
                }
                else {
                    throw main_1.Execution.error(this.#scope.position, 'Unknown cell', cell);
                }
            }
            if (String(cell).trim().match(/[\d/.]+/)) {
                return parseFloat(cell);
            }
            throw main_1.Execution.error(this.#scope.position, 'Unknown cell', cell);
        }
        return cell;
    }
    getCell(cell) {
        const hash = this.findHash(cell);
        if (hash !== undefined)
            return hash;
        const reg = this.findRegister(cell);
        if (reg)
            return reg;
        const device = this.findDevice(cell);
        if (device)
            return device;
        if (typeof cell === "string" && cell in this.aliases)
            return this.aliases[cell];
        throw main_1.Execution.error(this.#scope.position, 'Unknown cell', cell);
    }
    findHash(name) {
        if ((0, types_1.isHash)(name)) {
            return -1;
        }
        return undefined;
    }
    findRegister(name) {
        if ((0, types_1.isRegister)(name) || (0, types_1.isStack)(name)) {
            const mapping = {
                sp: "r16",
                ra: "r17"
            };
            name = mapping[name] ?? name;
            if (typeof name === "string") {
                if (main_1.regexes.rr1.test(name)) {
                    let m = main_1.regexes.rr1.exec(name);
                    if (!m)
                        throw main_1.Execution.error(this.#scope.position, 'Syntax error');
                    const index = name.replace(m[1], this.cell(m[1]));
                    let m1 = this.getRegister(index);
                    if (!m1)
                        throw main_1.Execution.error(this.#scope.position, 'Unknown register', m1);
                    return m1;
                }
                if (main_1.regexes.r1.test(name)) {
                    let m = main_1.regexes.r1.exec(name);
                    if (!m)
                        throw main_1.Execution.error(this.#scope.position, 'Syntax error');
                    const index = parseInt(m[1]);
                    if (index in this.cells)
                        return this.cells[index];
                }
                if (name in this.aliases) {
                    const mem = this.aliases[name];
                    if (main_1.regexes.r1.test(mem.name))
                        return mem;
                }
                return undefined;
            }
            if (name >= 18)
                throw main_1.Execution.error(this.#scope.position, 'Unknown register', name);
            return this.cells[name];
        }
        if (this.aliases[name] !== undefined && this.aliases[name] instanceof MemoryCell_1.MemoryCell) {
            return this.aliases[name];
        }
        return undefined;
    }
    getRegister(name) {
        const reg = this.findRegister(name);
        if (!reg)
            throw main_1.Execution.error(this.#scope.position, 'Not a register', name);
        return reg;
    }
    findDevice(name) {
        if ((0, types_1.isPort)(name) || (0, types_1.isChip)(name))
            return this.environ.get(name);
        return undefined;
    }
    getDevice(name) {
        const device = this.findDevice(name);
        if (!device)
            throw main_1.Execution.error(this.#scope.position, 'Unknown device', name);
        return device;
    }
    findValue(value) {
        const hash = this.findHash(value);
        if (hash !== undefined)
            return hash;
        if ((0, types_1.isNumber)(value))
            return parseFloat(String(value));
        const v = this.aliases[value];
        if (!v)
            return undefined;
        if (!(0, types_1.isNumber)(v.value))
            return undefined;
        return v.value;
    }
    getValue(value) {
        const v = this.findValue(value);
        if (!v)
            throw main_1.Execution.error(this.#scope.position, 'Unknown value', v);
        return v;
    }
    alias(name, link) {
        const result = this.getCell(link);
        if (!(0, types_1.isNumber)(result)) {
            this.aliases[name] = result;
            if (this.aliases[name] instanceof MemoryCell_1.MemoryCell) {
                this.aliases[name].alias = name;
            }
            return this;
        }
        throw main_1.Execution.error(this.#scope.position, 'Invalid alias value');
    }
    define(name, value) {
        if (typeof value === "string")
            value = parseInt(value);
        this.aliases[name] = new ConstantCell_1.ConstantCell(value, this.#scope, name);
    }
    toLog() {
        const out = {};
        for (let i = 0; i < 18; i++) {
            if (i === 16) {
                out['r' + i] = this.cells[i].get();
            }
            else {
                out['r' + i] = this.cells[i].get();
                out['stack'] = this.cells[i].value;
            }
        }
        return out;
    }
}
exports.Memory = Memory;
//# sourceMappingURL=Memory.js.map