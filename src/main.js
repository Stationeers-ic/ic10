"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpreterIc10 = exports.Execution = void 0;
const Ic10Error_1 = require("./Ic10Error");
const Memory_1 = require("./Memory");
const Device_1 = require("./devices/Device");
const debug_1 = require("./commands/debug");
const arithmetic_1 = require("./commands/arithmetic");
const stack_1 = require("./commands/stack");
const misc_1 = require("./commands/misc");
const conditions_1 = require("./commands/conditions");
const jumps_1 = require("./commands/jumps");
const selects_1 = require("./commands/selects");
const devices_1 = require("./commands/devices");
const Utils_1 = require("./Utils");
const constants_1 = __importDefault(require("./data/constants"));
const regexes = {
    strStart: new RegExp("^\".+$"),
    strEnd: new RegExp(".+\"$"),
};
exports.Execution = {
    display: function (e) {
        if (e instanceof Ic10Error_1.Ic10Error) {
            const string = `(${e.line}) - ${e.message}:`;
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
        console.log(e);
        return e;
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
    device;
    sleeping;
    debugCommands;
    inGameCommands;
    constructor(code = '', settings = {}) {
        this.code = code;
        this.memory = new Memory_1.Memory();
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
        if (code) {
            this.init(code);
        }
        this.output = {
            debug: '',
            log: '',
            error: '',
        };
        this.sleeping = 0;
        this.debugCommands = (0, debug_1.makeDebugCommands)(this);
        const conditions = (0, conditions_1.makeConditions)(this);
        this.inGameCommands = {
            ...(0, arithmetic_1.makeArithmeticCommands)(this),
            ...(0, stack_1.makeStackCommands)(this),
            ...(0, misc_1.makeMiscCommands)(this),
            ...(0, jumps_1.makeJumpCommands)(this, conditions),
            ...(0, selects_1.makeSelectCommands)(this, conditions),
            ...(0, devices_1.makeDeviceCommands)(this)
        };
    }
    setSettings(settings = {}) {
        this.settings = Object.assign({}, this.settings, settings);
        return this;
    }
    getSettings() {
        return Object.assign({}, this.settings);
    }
    init(text, device) {
        this.memory.reset();
        Object.entries(constants_1.default).map(([key, value]) => {
            this.memory.define(key, parseFloat(value));
        });
        if (device !== undefined) {
            const ics = device.slots
                .filter(s => s.has("OccupantHash") && s.get("OccupantHash") === Device_1.IcHash);
            if (ics.length === 1) {
                this.device = device;
                this.memory.environ.db = device;
            }
        }
        this.lines = text.split(/\r?\n/);
        const commands = this.lines
            .map((line) => {
            const args = this.splitString(line.trim());
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
                        if (arg.startsWith("#"))
                            break;
                        if (arg.startsWith("$"))
                            arg = parseInt(arg.replaceAll(/[^0-9a-fA-F]/, ""), 16).toString();
                        if (arg.startsWith("%"))
                            arg = parseInt(arg.replaceAll(/[^01]/, ""), 2).toString();
                        if (mode === 0)
                            argNumber++;
                        if (regexes.strStart.test(arg))
                            mode = 1;
                        if (argNumber in newArgs)
                            newArgs[argNumber] += ' ' + arg;
                        else
                            newArgs[argNumber] = arg;
                        if (regexes.strEnd.test(arg))
                            mode = 0;
                    }
                }
                commands[commandsKey].args = Object.values(newArgs);
            }
            else
                commands.push({ command: '', args: [] });
        }
        this.commands = commands;
        this.position = 0;
        while (this.position < this.commands.length) {
            let { command } = this.commands[this.position];
            this.position++;
            if (command?.match(/^\w+:$/)) {
                let label = command.replace(":", "");
                this.labels[command.replace(":", "")] = this.position;
                this.memory.define(label, this.position);
            }
        }
        this.position = 0;
        this.sleeping = 0;
        this.updateDevice();
        return this;
    }
    splitString(str) {
        if (!str)
            return [];
        let result = [];
        let inQuotes = false;
        let currentWord = '';
        for (let i = 0; i < str.length; i++) {
            if (str[i] === ' ' && !inQuotes) {
                result.push(currentWord);
                currentWord = '';
            }
            else if (str[i] === '"' || str[i] === "'") {
                inQuotes = !inQuotes;
                currentWord += str[i];
            }
            else {
                currentWord += str[i];
            }
        }
        result.push(currentWord);
        return result;
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
        if (this.sleeping > 0) {
            this.sleeping--;
            return true;
        }
        else
            this.sleeping = 0;
        if (line === 0) {
            this.memory.environ.db.properties.Error = 0;
        }
        if (line >= 0) {
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
                const runCommand = (cmd) => {
                    if (command === undefined)
                        throw new Ic10Error_1.Ic10Error('Unknown function', command);
                    cmd.call(this, ...args);
                    this.updateDevice();
                    this.debug(command, args);
                };
                const scopes = [
                    this.inGameCommands,
                    this.debugCommands
                ];
                let cmd = undefined;
                for (const scope of scopes) {
                    if (command in scope) {
                        cmd = scope[command];
                        break;
                    }
                }
                if (cmd === undefined && !isComment)
                    throw new Ic10Error_1.Ic10Error('Unknown function', command);
                else if (cmd !== undefined)
                    runCommand(cmd);
            }
            catch (e) {
                if (e instanceof Ic10Error_1.Ic10Error)
                    e.line = this.position;
                this.memory.environ.db.properties.Error = 1;
                if (e instanceof Ic10Error_1.Ic10DiagnosticError || e instanceof Ic10Error_1.Ic10Error)
                    this.settings.executionCallback.call(this, e);
                else
                    throw e;
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
    runUntilSync(cond, maxIterations = 0) {
        let status = true;
        let n = 0;
        do {
            status = this.prepareLine();
            n++;
        } while (!cond(status) && (maxIterations <= 0 || n <= maxIterations));
        return n;
    }
    debug(command, args) {
        if (!this.settings.debug)
            return;
        this.settings.debugCallback.call(this, command, args);
    }
    updateDevice() {
        if (this.device === undefined)
            return;
        this.device.slots.forEach(slot => {
            if (slot.has("LineNumber"))
                slot.set("LineNumber", this.position);
        });
    }
    connectDevice(name, hash, slotCount, fields, additionalOptions) {
        const d = new Device_1.DebugDevice(slotCount, fields, additionalOptions);
        try {
            const deviceData = (0, Utils_1.findDevice)(hash);
            d.propertiesAccess = deviceData.params;
            for (const paramsKey in deviceData.params) {
                d.properties[paramsKey] = 0;
            }
            d.properties.PrefabHash = deviceData.PrefabHash;
        }
        catch (e) {
            if (typeof hash === 'number') {
                d.properties.PrefabHash = hash;
            }
            else {
                d.properties.PrefabHash = (0, Utils_1.hashStr)(hash);
            }
        }
        this.memory.environ.set(name, d);
    }
}
exports.InterpreterIc10 = InterpreterIc10;
exports.default = InterpreterIc10;
//# sourceMappingURL=main.js.map