"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpreterIc10 = exports.Execution = exports.regexes = void 0;
const ic10Error_1 = require("./ic10Error");
const Memory_1 = require("./Memory");
const Device_1 = require("./Device");
const Slot_1 = require("./Slot");
const MemoryCell_1 = require("./MemoryCell");
exports.regexes = {
    'rr1': new RegExp("r+(r(0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a))$"),
    'dr1': new RegExp("d+(r(0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a))$"),
    'r1': new RegExp("^r(0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a)$"),
    'd1': new RegExp("^d([012345])$"),
    'strStart': new RegExp("^\".+$"),
    'strEnd': new RegExp(".+\"$"),
};
exports.Execution = {
    error(code, message, obj = null) {
        return new ic10Error_1.ic10Error('--', code, message, obj, 0);
    },
    display: function (e) {
        if (e instanceof ic10Error_1.ic10Error) {
            const string = `(${e.code}) - ${e.message}:`;
            switch (e.lvl) {
                case 0:
                    console.error('ERROR ' + string, e.obj);
                    break;
                case 1:
                    console.warn('WARN ' + string, e.obj);
                    break;
                case 2:
                    console.info('INFO ' + string, e.obj);
                    break;
                case 3:
                default:
                    console.log('LOG ' + string, e.obj);
                    break;
            }
            return string;
        }
        else {
            console.log(e);
            return e;
        }
    }
};
class InterpreterIc10 {
    code;
    commands = [];
    lines = [];
    memory;
    position = 0;
    interval;
    labels = {};
    constants;
    output;
    settings;
    ignoreLine;
    constructor(code = '', settings = {}) {
        this.code = code;
        this.memory = new Memory_1.Memory(this);
        this.constants = {};
        this.labels = {};
        this.ignoreLine = [];
        this.settings = Object.assign({
            debug: true,
            tickTime: 100,
            debugCallback: (a, b) => {
                this.output.debug = a + ' ' + JSON.stringify(b);
            },
            logCallback: (a, b) => {
                this.output.log = a + ' ' + b.join('');
            },
            executionCallback: (e) => {
                this.output.error = exports.Execution.display(e);
            },
        }, settings);
        this.memory.environ.randomize();
        if (code) {
            this.init(code);
        }
        this.output = {
            debug: '',
            log: '',
            error: '',
        };
    }
    setSettings(settings = {}) {
        this.settings = Object.assign(this.settings, settings);
        return this;
    }
    init(text) {
        this.lines = text.split(/\r?\n/);
        const commands = this.lines
            .map((line) => {
            const args = line.trim().split(/ +/);
            const command = args.shift();
            return { command, args };
        });
        for (const commandsKey in this.lines) {
            if (commands.hasOwnProperty(commandsKey)) {
                let command = commands[commandsKey];
                const newArgs = {};
                let mode = 0;
                let argNumber = 0;
                for (let argsKey in command.args) {
                    if (command.args.hasOwnProperty(argsKey)) {
                        let arg = command.args[argsKey];
                        if (arg.startsWith("#")) {
                            break;
                        }
                        if (mode === 0) {
                            argNumber++;
                        }
                        if (exports.regexes.strStart.test(arg)) {
                            mode = 1;
                        }
                        if (argNumber in newArgs) {
                            newArgs[argNumber] += ' ' + arg;
                        }
                        else {
                            newArgs[argNumber] = arg;
                        }
                        if (exports.regexes.strEnd.test(arg)) {
                            mode = 0;
                        }
                    }
                }
                commands[commandsKey].args = Object.values(newArgs);
            }
            else {
                commands.push({ command: '', args: [] });
            }
        }
        this.commands = commands;
        this.position = 0;
        while (this.position < this.commands.length) {
            let { command, args } = this.commands[this.position];
            this.position++;
            if (command?.match(/^\w+:$/)) {
                let label = command.replace(":", "");
                this.labels[command.replace(":", "")] = this.position;
                this.memory.define(label, this.position);
            }
        }
        this.position = 0;
        return this;
    }
    stop() {
        clearInterval(this.interval);
        return this;
    }
    async run() {
        return new Promise((resolve) => {
            this.interval = setInterval(() => {
                const why = this.prepareLine();
                if (why !== true) {
                    this.settings.debugCallback.call(this, why, []);
                    clearInterval(this.interval);
                }
            }, this.settings.tickTime);
            resolve(this);
        });
    }
    prepareLine(line = -1, isDebugger = false) {
        if (line > 0) {
            this.position = line;
        }
        if (!(this.position in this.commands)) {
            return 'end';
        }
        let { command, args } = this.commands[this.position];
        this.position++;
        let isComment = true;
        if (command && command != '' && !command.trim().endsWith(":")) {
            isComment = command.startsWith("#");
            for (const argsKey in args) {
                let a = parseFloat(args[argsKey]);
                if (!isNaN(a)) {
                    args[argsKey] = String(a);
                }
            }
            try {
                if (command === "#die")
                    return 'die';
                command = command.replace("#", "_");
                if (command in this) {
                    this[command](...args);
                    this.__debug(command, args);
                }
                else if (!isComment) {
                    throw exports.Execution.error(this.position, 'Undefined function', command);
                }
            }
            catch (e) {
                this.settings.executionCallback.call(this, e);
            }
        }
        if (command === "hcf")
            return 'hcf';
        if (isComment) {
            this.ignoreLine.push(this.position);
        }
        if (!isDebugger) {
            return isComment && this.position < this.commands.length
                ? this.prepareLine()
                : this.position < this.commands.length ? true : 'end';
        }
        else {
            return this.position < this.commands.length ? true : 'end';
        }
    }
    __issetLabel(x) {
        return x in this.labels;
    }
    define(alias, value) {
        this.memory.define(alias, value);
    }
    alias(alias, target) {
        this.memory.alias(alias, target);
    }
    l(register, device, property) {
        const r = this.memory.getRegister(register);
        const value = this.memory.getDevice(device).get(property);
        r.set(null, value);
    }
    __l(register, device, property) {
        this.l(register, device, property);
    }
    ls(register, device, slot, property) {
        const r = this.memory.getRegister(register);
        const d = this.memory.getDevice(device);
        const value = d.getSlot(this.memory.getValue(slot), property);
        r.set(null, value);
    }
    s(device, property, value) {
        const d = this.memory.getDevice(device);
        d.set(property, this.memory.getValue(value));
    }
    __s(device, property, value) {
        this.s(device, property, value);
    }
    __op(op, register, ...args) {
        const r = this.memory.getRegister(register);
        const inputs = args.map(v => this.memory.getValue(v));
        r.set(null, op(...inputs));
    }
    move(register, value) {
        this.__op(v => v, register, value);
    }
    __move(register, value) {
        this.move(register, value);
    }
    add(register, a, b) {
        this.__op((a, b) => a + b, register, a, b);
    }
    sub(register, a, b) {
        this.__op((a, b) => a - b, register, a, b);
    }
    mul(register, a, b) {
        this.__op((a, b) => a * b, register, a, b);
    }
    div(register, a, b) {
        this.__op((a, b) => Number(a / b) || 0, register, a, b);
    }
    mod(register, a, b) {
        this.__op((a, b) => a % b, register, a, b);
    }
    sqrt(register, v) {
        this.__op(Math.sqrt, register, v);
    }
    round(register, v) {
        this.__op(Math.round, register, v);
    }
    trunc(register, v) {
        this.__op(Math.trunc, register, v);
    }
    ceil(register, v) {
        this.__op(Math.ceil, register, v);
    }
    floor(register, v) {
        this.__op(Math.floor, register, v);
    }
    max(register, a, b) {
        this.__op(Math.max, register, a, b);
    }
    minx(register, a, b) {
        this.__op(Math.min, register, a, b);
    }
    abs(register, v) {
        this.__op(Math.abs, register, v);
    }
    log(register, v) {
        this.__op(Math.log, register, v);
    }
    exp(register, v) {
        this.__op(Math.exp, register, v);
    }
    rand(register, v) {
        this.__op(_ => Math.random(), register, v);
    }
    sin(register, v) {
        this.__op(Math.sin, register, v);
    }
    cos(register, v) {
        this.__op(Math.cos, register, v);
    }
    tan(register, v) {
        this.__op(Math.tan, register, v);
    }
    asin(register, v) {
        this.__op(Math.asin, register, v);
    }
    acos(register, v) {
        this.__op(Math.acos, register, v);
    }
    atan(register, v) {
        this.__op(Math.atan, register, v);
    }
    atan2(register, a, b) {
        this.__op(Math.atan2, register, a, b);
    }
    yield() {
    }
    sleep(s) {
    }
    select(register, a, b, c) {
        this.__op((a, b, c) => a ? b : c, register, a, b, c);
    }
    hcf() {
        console.log("Die Mother Fucker Die!!!!!");
    }
    __jump(line) {
        this.position = line;
    }
    __call(line) {
        this.memory.getRegister("ra").set(null, this.position);
        this.__jump(line);
    }
    __getJumpTarget(target) {
        if (this.__issetLabel(target))
            return this.labels[target];
        const line = this.memory.getValue(target);
        if (isNaN(line))
            throw exports.Execution.error(this.position, 'Incorrect jump target', [target, this.labels]);
        return line;
    }
    j(target) {
        this.__jump(this.__getJumpTarget(target));
    }
    jr(offset) {
        const d = this.memory.getValue(offset);
        if (Math.abs(d) < 0.001)
            throw exports.Execution.error(this.position, "Infinite loop detected", offset);
        this.__jump(this.position + d - 1);
    }
    jal(target) {
        this.__call(this.__getJumpTarget(target));
    }
    __eq(a, b = 0) {
        return a == b;
    }
    __ge(a, b = 0) {
        return a >= b;
    }
    __gt(a, b = 0) {
        return a > b;
    }
    __le(a, b = 0) {
        return a <= b;
    }
    __lt(a, b = 0) {
        return a < b;
    }
    __ne(a, b = 0) {
        return a != b;
    }
    __ap(x, y, c = 0) {
        return !this.__na(x, y, c);
    }
    __na(x, y, c = 0) {
        return Math.abs(x - y) > c * Math.max(Math.abs(x), Math.abs(y));
    }
    __dse(d) {
        return this.memory.findDevice(d) !== undefined;
    }
    __dns(d) {
        return !this.__dse(d);
    }
    __sOp(op, register, ...args) {
        const r = this.memory.getRegister(register);
        const inputs = args.map(v => this.memory.getValue(v));
        r.set(null, op(...inputs) ? 1 : 0);
    }
    seq(register, a, b) {
        this.__sOp(this.__eq.bind(this), register, a, b);
    }
    seqz(register, a) {
        this.__sOp(this.__eq.bind(this), register, a);
    }
    sge(register, a, b) {
        this.__sOp(this.__ge.bind(this), register, a, b);
    }
    sgez(register, a) {
        this.__sOp(this.__ge.bind(this), register, a);
    }
    sgt(register, a, b) {
        this.__sOp(this.__gt.bind(this), register, a, b);
    }
    sgtz(register, a) {
        this.__sOp(this.__gt.bind(this), register, a);
    }
    sle(register, a, b) {
        this.__sOp(this.__le.bind(this), register, a, b);
    }
    slez(register, a) {
        this.__sOp(this.__le.bind(this), register, a);
    }
    slt(register, a, b) {
        this.__sOp(this.__lt.bind(this), register, a, b);
    }
    sltz(register, a) {
        this.__sOp(this.__lt.bind(this), register, a);
    }
    sne(register, a, b) {
        this.__sOp(this.__ne.bind(this), register, a, b);
    }
    snez(register, a) {
        this.__sOp(this.__ne.bind(this), register, a);
    }
    sap(register, x, y, c) {
        this.__sOp(this.__ap.bind(this), register, x, y, c);
    }
    sapz(register, x, y) {
        this.__sOp(this.__ap.bind(this), register, x, y);
    }
    sna(register, x, y, c) {
        this.__sOp(this.__na.bind(this), register, x, y, c);
    }
    snaz(register, x, y) {
        this.__sOp(this.__na.bind(this), register, x, y);
    }
    sdse(register, d) {
        this.memory.getRegister(register).set(null, Number(this.__dse(d)));
    }
    sdns(register, d) {
        this.memory.getRegister(register).set(null, Number(this.__dns(d)));
    }
    __bOp(op, line, ...args) {
        const inputs = args.map(v => this.memory.getValue(v));
        if (!op(...inputs))
            return;
        this.j(line);
    }
    __bROp(op, offset, ...args) {
        const inputs = args.map(v => this.memory.getValue(v));
        if (!op(...inputs))
            return;
        this.jr(offset);
    }
    beq(a, b, line) {
        this.__bOp(this.__eq.bind(this), line, a, b);
    }
    beqz(a, line) {
        this.__bOp(this.__eq.bind(this), line, a);
    }
    bge(a, b, line) {
        this.__bOp(this.__ge.bind(this), line, a, b);
    }
    bgez(a, line) {
        this.__bOp(this.__ge.bind(this), line, a);
    }
    bgt(a, b, line) {
        this.__bOp(this.__gt.bind(this), line, a, b);
    }
    bgtz(a, line) {
        this.__bOp(this.__gt.bind(this), line, a);
    }
    ble(a, b, line) {
        this.__bOp(this.__le.bind(this), line, a, b);
    }
    blez(a, line) {
        this.__bOp(this.__le.bind(this), line, a);
    }
    blt(a, b, line) {
        this.__bOp(this.__lt.bind(this), line, a, b);
    }
    bltz(a, line) {
        this.__bOp(this.__lt.bind(this), line, a);
    }
    bne(a, b, line) {
        this.__bOp(this.__ne.bind(this), line, a, b);
    }
    bnez(a, line) {
        this.__bOp(this.__ne.bind(this), line, a);
    }
    bap(x, y, c, line) {
        this.__bOp(this.__ap.bind(this), line, x, y, c);
    }
    bapz(x, y, line) {
        this.__bOp(this.__ap.bind(this), line, x, y);
    }
    bna(x, y, c, line) {
        this.__bOp(this.__na.bind(this), line, x, y, c);
    }
    bnaz(x, y, line) {
        this.__bOp(this.__na.bind(this), line, x, y);
    }
    bdse(d, line) {
        if (this.__dse(d))
            this.j(line);
    }
    bdns(d, line) {
        if (this.__dns(d))
            this.j(line);
    }
    breq(a, b, offset) {
        this.__bROp(this.__eq.bind(this), offset, a, b);
    }
    breqz(a, offset) {
        this.__bROp(this.__eq.bind(this), offset, a);
    }
    brge(a, b, offset) {
        this.__bROp(this.__ge.bind(this), offset, a);
    }
    brgez(a, offset) {
        this.__bROp(this.__ge.bind(this), offset, a);
    }
    brgt(a, b, offset) {
        this.__bROp(this.__gt.bind(this), offset, a, b);
    }
    brgtz(a, offset) {
        this.__bROp(this.__gt.bind(this), offset, a);
    }
    brle(a, b, offset) {
        this.__bROp(this.__le.bind(this), offset, a, b);
    }
    brlez(a, offset) {
        this.__bROp(this.__le.bind(this), offset, a);
    }
    brlt(a, b, offset) {
        this.__bROp(this.__lt.bind(this), offset, a, b);
    }
    brltz(a, offset) {
        this.__bROp(this.__lt.bind(this), offset, a);
    }
    brne(a, b, offset) {
        this.__bROp(this.__ne.bind(this), offset, a, b);
    }
    brnez(a, offset) {
        this.__bROp(this.__ne.bind(this), offset, a);
    }
    brap(x, y, c, offset) {
        this.__bROp(this.__ap.bind(this), offset, x, y, c);
    }
    brapz(x, y, offset) {
        this.__bROp(this.__ap.bind(this), offset, x, y);
    }
    brna(x, y, c, offset) {
        this.__bROp(this.__na.bind(this), offset, x, y, c);
    }
    brnaz(x, y, offset) {
        this.__bROp(this.__ap.bind(this), offset, x, y);
    }
    brdse(d, offset) {
        if (this.__dse(d)) {
            this.jr(offset);
        }
    }
    brdns(d, offset) {
        if (this.__dns(d)) {
            this.jr(offset);
        }
    }
    beqal(op1, op2, op3, op4) {
        if (this.__eq(this.memory.cell(op1), this.memory.cell(op2))) {
            this.jal(op3);
        }
    }
    beqzal(op1, op2, op3, op4) {
        if (this.__eq(this.memory.cell(op1), 0)) {
            this.jal(op2);
        }
    }
    bgeal(op1, op2, op3, op4) {
        if (this.__ge(this.memory.cell(op1), this.memory.cell(op2))) {
            this.jal(op3);
        }
    }
    bgezal(op1, op2, op3, op4) {
        if (this.__ge(this.memory.cell(op1), 0)) {
            this.jal(op2);
        }
    }
    bgtal(op1, op2, op3, op4) {
        if (this.__gt(this.memory.cell(op1), this.memory.cell(op2))) {
            this.jal(op3);
        }
    }
    bgtzal(op1, op2, op3, op4) {
        if (this.__gt(this.memory.cell(op1), 0)) {
            this.jal(op2);
        }
    }
    bleal(op1, op2, op3, op4) {
        if (this.__le(this.memory.cell(op1), this.memory.cell(op2))) {
            this.jal(op3);
        }
    }
    blezal(op1, op2, op3, op4) {
        if (this.__le(this.memory.cell(op1), 0)) {
            this.jal(op2);
        }
    }
    bltal(op1, op2, op3, op4) {
        if (this.__lt(this.memory.cell(op1), this.memory.cell(op2))) {
            this.jal(op3);
        }
    }
    bltzal(op1, op2, op3, op4) {
        if (this.__lt(this.memory.cell(op1), 0)) {
            this.jal(op2);
        }
    }
    bneal(op1, op2, op3, op4) {
        if (this.__ne(this.memory.cell(op1), this.memory.cell(op2))) {
            this.jal(op3);
        }
    }
    bnezal(op1, op2, op3, op4) {
        if (this.__ne(this.memory.cell(op1), 0)) {
            this.jal(op2);
        }
    }
    bapal(op1, op2, op3, op4) {
        if (this.__ap(this.memory.cell(op1), this.memory.cell(op2), this.memory.cell(op3))) {
            this.jal(op4);
        }
    }
    bapzal(op1, op2, op3, op4) {
        if (this.__ap(this.memory.cell(op1), 0) && this.memory.cell(op2)) {
            this.jal(op3);
        }
    }
    bnaal(op1, op2, op3, op4) {
        if (this.__na(this.memory.cell(op1), this.memory.cell(op2), this.memory.cell(op3))) {
            this.jal(op4);
        }
    }
    bnazal(op1, op2, op3, op4) {
        if (this.__na(this.memory.cell(op1), 0, this.memory.cell(op2))) {
            this.jal(op3);
        }
    }
    bdseal(op1, op2, op3, op4) {
        if (this.__dse(op2)) {
            this.jal(op3);
        }
    }
    bdnsal(op1, op2, op3, op4) {
        if (this.__dns(op2)) {
            this.jal(op3);
        }
    }
    push(op1, op2, op3, op4) {
        this.memory.getCell('r16').push(op1);
    }
    pop(op1, op2, op3, op4) {
        this.memory.cell(op1, this.memory.getCell('r16').pop());
    }
    peek(op1, op2, op3, op4) {
        this.memory.cell(op1, this.memory.getCell('r16').peek());
    }
    lb(op1, op2, op3, op4) {
        const values = [];
        const hash = this.memory.cell(op2);
        for (let i = 0; i <= 5; i++) {
            const d = this.memory.getCell('d' + i);
            if (d instanceof Device_1.Device) {
                if (d.hash == hash) {
                    values.push(d.get(op3));
                }
            }
        }
        if (values.length === 0) {
            throw exports.Execution.error(this.position, 'Can`t find Device wich hash:', hash);
        }
        let result = 0;
        switch (op4) {
            case 0:
            case 'Average':
                result = values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length;
                break;
            case 1:
            case 'Sum':
                result = values.reduce((partial_sum, a) => partial_sum + a, 0);
                break;
            case 2:
            case 'Minimum':
                result = Math.min.apply(null, values);
                break;
            case 3:
            case 'Maximum':
                result = Math.max.apply(null, values);
                break;
        }
        this.memory.cell(op1, Number(result));
    }
    lr(op1, op2, op3, op4) {
        const values = [];
        const d = this.memory.getCell(op2);
        if (d instanceof Device_1.Device) {
            for (const slotsKey in d.properties.slots) {
                if (d.properties.slots[slotsKey] instanceof Slot_1.Slot) {
                    const slot = d.properties.slots[slotsKey];
                    values.push(slot.get(op4));
                }
            }
        }
        let result = 0;
        switch (op3) {
            case 0:
            case 'Average':
                result = values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length;
                break;
            case 1:
            case 'Sum':
                result = values.reduce((partial_sum, a) => partial_sum + a, 0);
                break;
            case 2:
            case 'Minimum':
                result = Math.min.apply(null, values);
                break;
            case 3:
            case 'Maximum':
                result = Math.max.apply(null, values);
                break;
        }
        this.memory.cell(op1, result);
    }
    sb(op1, op2, op3, op4) {
        const hash = this.memory.cell(op1);
        for (let i = 0; i <= 5; i++) {
            const d = this.memory.getCell('d' + i);
            if (d instanceof Device_1.Device) {
                if (d.hash == hash) {
                    d.set(op2, op3);
                }
            }
        }
    }
    lbn(targetRegister, deviceHash, nameHash, property, batchMode) {
        const values = [];
        const hash = this.memory.cell(deviceHash);
        for (let i = 0; i <= 5; i++) {
            const d = this.memory.getCell('d' + i);
            if (d instanceof Device_1.Device) {
                if (d.hash == hash) {
                    values.push(d.get(property));
                }
            }
        }
        if (values.length === 0) {
            throw exports.Execution.error(this.position, 'Can`t find Device wich hash:', hash);
        }
        let result = 0;
        switch (batchMode) {
            case 0:
            case 'Average':
                result = values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length;
                break;
            case 1:
            case 'Sum':
                result = values.reduce((partial_sum, a) => partial_sum + a, 0);
                break;
            case 2:
            case 'Minimum':
                result = Math.min.apply(null, values);
                break;
            case 3:
            case 'Maximum':
                result = Math.max.apply(null, values);
                break;
        }
        this.memory.cell(targetRegister, Number(result));
    }
    sbn() { }
    lbs() { }
    lbns() { }
    ss() { }
    sbs() { }
    snan() { }
    snanz() { }
    bnan() { }
    brnan() { }
    and(register, a, b) {
        this.__op((a, b) => a && b, register, a, b);
    }
    or(op1, op2, op3, op4) {
        op2 = this.memory.cell(op2);
        op3 = this.memory.cell(op3);
        if (op2 || op3) {
            this.memory.cell(op1, 1);
        }
        else {
            this.memory.cell(op1, 0);
        }
    }
    xor(op1, op2, op3, op4) {
        op2 = Boolean(this.memory.cell(op2));
        op3 = Boolean(this.memory.cell(op3));
        if ((op2 && !op3) || (!op2 && op3)) {
            this.memory.cell(op1, 1);
        }
        else {
            this.memory.cell(op1, 0);
        }
    }
    nor(op1, op2, op3, op4) {
        op2 = Boolean(this.memory.cell(op2));
        op3 = Boolean(this.memory.cell(op3));
        if (!op2 && !op3) {
            this.memory.cell(op1, 1);
        }
        else {
            this.memory.cell(op1, 0);
        }
    }
    _debug(op1, op2, op3, op4) {
        this._log(op1, op2, op3, op4);
    }
    _log(op1, op2, op3, op4) {
        const out = [];
        try {
            for (const argumentsKey in arguments) {
                if (arguments.hasOwnProperty(argumentsKey)) {
                    let key = arguments[argumentsKey];
                    if (typeof key == 'string') {
                        try {
                            const o = this.memory.cell(key);
                            if (o) {
                                out.push(key + ' = ' + o + '; ');
                                break;
                            }
                        }
                        catch (e) {
                        }
                        let keys = key.split('.');
                        try {
                            let cells = Object.keys(this.memory.cells);
                            let environ = Object.keys(this.memory.environ);
                            let aliases = Object.keys(this.memory.aliases);
                            if (environ.indexOf(keys[0]) >= 0) {
                                if (keys[0] == key) {
                                    out.push(key + ' = ' + JSON.stringify(this.memory.environ[key].properties) + '; ');
                                }
                                else {
                                    switch (keys.length) {
                                        case 2:
                                            out.push(key + ' = ' + this.memory.environ[keys[0]].get(keys[1]) + '; ');
                                            break;
                                        case 3:
                                            out.push(key + ' = ' + JSON.stringify(this.memory.environ[keys[0]].getSlot(keys[1])) + '; ');
                                            break;
                                        case 4:
                                            out.push(key + ' = ' + this.memory.environ[keys[0]].getSlot(keys[2], keys[3]) + '; ');
                                            break;
                                    }
                                }
                                continue;
                            }
                            try {
                                if (this.memory.getCell(keys[0]) instanceof MemoryCell_1.MemoryCell) {
                                    const cell = this.memory.getCell(arguments[argumentsKey]);
                                    if (cell instanceof MemoryCell_1.MemoryCell) {
                                        out.push(key + ' = ' + cell.value + '; ');
                                    }
                                    else {
                                        out.push(key + ' = ' + cell + '; ');
                                    }
                                    continue;
                                }
                            }
                            catch (e) {
                            }
                            out.push(key + '; ');
                        }
                        catch (e) {
                            out.push(key + ' ' + e.message + '; ');
                        }
                    }
                    else {
                        try {
                            out.push(key + '; ');
                        }
                        catch (e) {
                        }
                    }
                }
            }
            this.settings.logCallback.call(this, `Log[${this.position}]: `, out);
        }
        catch (e) {
            console.debug(e);
        }
    }
    _d0(op1) {
        this.__d('d0', arguments);
    }
    _d1(op1) {
        this.__d('d1', arguments);
    }
    _d2(op1) {
        this.__d('d2', arguments);
    }
    _d3(op1) {
        this.__d('d3', arguments);
    }
    _d4(op1) {
        this.__d('d4', arguments);
    }
    _d5(op1) {
        this.__d('d5', arguments);
    }
    __d(device, args) {
        const d = this.memory.getCell(device);
        switch (Object.keys(args).length) {
            case 0:
                throw exports.Execution.error(this.position, 'missing arguments');
            case 1:
                if (d instanceof Device_1.Device) {
                    d.hash = args[0];
                }
                break;
            case 2:
                if (d instanceof Device_1.Device) {
                    d.set(args[0], args[1]);
                }
                break;
            case 3:
                if (d instanceof Device_1.Device) {
                    d.setSlot(args[0], args[1], args[2]);
                }
        }
    }
    __debug(p, iArguments) {
        if (this.settings.debug) {
            this.settings.debugCallback.call(this, ...arguments);
        }
    }
}
exports.InterpreterIc10 = InterpreterIc10;
exports.default = InterpreterIc10;
//# sourceMappingURL=main.js.map