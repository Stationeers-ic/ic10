import {Ic10DiagnosticError, Ic10Error} from "./Ic10Error";
import {Memory} from "./Memory";
import {AdditionalOptions, DebugDevice, Device, IcHash} from "./devices/Device";
import {Scope, ScopeSettings} from "./commands/core";
import {makeDebugCommands} from "./commands/debug";
import {makeArithmeticCommands} from "./commands/arithmetic";
import {makeStackCommands} from "./commands/stack";
import {makeMiscCommands} from "./commands/misc";
import {makeConditions} from "./commands/conditions";
import {makeJumpCommands} from "./commands/jumps";
import {makeSelectCommands} from "./commands/selects";
import {makeDeviceCommands} from "./commands/devices";
import {findDevice, hashStr} from "./Utils";
import {DeviceFieldsType} from "./DeviceProperties";
import DataConstants from "./data/constants"

const regexes = {
    strStart: new RegExp("^\".+$"),
    strEnd: new RegExp(".+\"$"),
}

export type ReturnCode = "hcf" | "end" | "die"

export const Execution = {
    display: function (e: Ic10Error | any) {
        if (e instanceof Ic10Error) {
            const string = `(${e.line}) - ${e.message}:`;
            switch (e.lvl) {
                case 0:
                    console.error('ERROR ' + string, e.obj)
                    break;
                case 1:
                    console.warn('WARN ' + string, e.obj)
                    break;
                case 2:
                    console.info('INFO ' + string, e.obj)
                    break;
                case 3:
                default:
                    console.log('LOG ' + string, e.obj)
                    break;
            }
            return string
        }

        console.log(e)
        return e;
    }
}

// noinspection SpellCheckingInspection
export class InterpreterIc10 implements Scope {
    public code: string
    public commands: { command: string | undefined, args: string[] }[] = []
    public lines: string[] = []
    public memory: Memory
    public position: number = 0
    public interval: any
    public labels: Record<string, number> = {}
    public constants: {}
    public output: {
        debug: string,
        log: string,
        error: string,
    }
    public settings: ScopeSettings;
    public ignoreLine: Array<number>;
    public device?: Device

    public sleeping: number
    private readonly debugCommands: Record<string, (...args: string[]) => void>
    private readonly inGameCommands: Record<string, (...args: string[]) => void>

    constructor(code: string = '', settings: Partial<ScopeSettings> = {}) {
        this.code = code
        this.memory = new Memory()
        this.constants = {}
        this.labels = {}
        this.ignoreLine = []
        this.settings = Object.assign({
            debug: true,
            tickTime: 100,
            debugCallback: (a: string, b: any) => {
                this.output.debug = a + ' ' + JSON.stringify(b)
            },
            logCallback: (a: string, b: any[]) => {
                this.output.log = a + ' ' + b.join('')
            },
            executionCallback: (e: Ic10Error) => {
                this.output.error = <string>Execution.display(e)
            },
        }, settings)
        if (code) {
            this.init(code)
        }
        this.output = {
            debug: '',
            log: '',
            error: '',
        }

        this.sleeping = 0
        this.debugCommands = makeDebugCommands(this)

        const conditions = makeConditions(this)

        this.inGameCommands = {
            ...makeArithmeticCommands(this),
            ...makeStackCommands(this),
            ...makeMiscCommands(this),
            ...makeJumpCommands(this, conditions),
            ...makeSelectCommands(this, conditions),
            ...makeDeviceCommands(this)
        }
    }

    setSettings(settings: Partial<ScopeSettings> = {}): InterpreterIc10 {
        this.settings = Object.assign({}, this.settings, settings)
        return this;
    }

    getSettings(): ScopeSettings {
        return Object.assign({}, this.settings)
    }

    init(text: string, device?: Device): InterpreterIc10 {
        this.memory.reset()
        Object.entries(DataConstants).map(([key, value]) => {
            this.memory.define(key, parseFloat(value))
        })
        if (device !== undefined) {
            const ics = device.slots
                .filter(s => s.has("OccupantHash") && s.get("OccupantHash") === IcHash)

            if (ics.length === 1) {
                this.device = device
                this.memory.environ.db = device
            }
        }

        this.lines = text.split(/\r?\n/);
        const commands = this.lines
            .map((line: string) => {
                const args = this.splitString(line.trim())
                const command = args.shift()
                return {command, args}
            });
        for (const commandsKey in this.lines) {
            if (commands.hasOwnProperty(commandsKey)) {
                let command = commands[commandsKey]
                const newArgs: Record<string, string> = {};
                let mode = 0;
                let argNumber = 0;
                for (let argsKey in command.args) {
                    if (command.args.hasOwnProperty(argsKey)) {
                        let arg = command.args[argsKey]
                        if (arg.startsWith("#"))
                            break;
                        
                        /**
                         * [en] Execute the `$` macro - converts a hexidecimal number to a decimal number.
                         * [ru] Выполните макрос `$` — преобразует шестнадцатеричное число в десятичное.
                         */
                        if (arg.startsWith("$"))
                            arg = parseInt(arg.replaceAll(/[^0-9a-fA-F]/, ""), 16).toString();

                        /**
                         * [en] Execute the `%` macro - converts a binary number to decimal number.
                         * [ru] Выполните макрос `%` — преобразует двоичное число в десятичное число.
                         */
                        if (arg.startsWith("%"))
                            arg = parseInt(arg.replaceAll(/[^01]/, ""), 2).toString();

                        if (mode === 0)
                            argNumber++

                        if (regexes.strStart.test(arg))
                            mode = 1

                        if (argNumber in newArgs)
                            newArgs[argNumber] += ' ' + arg
                        else
                            newArgs[argNumber] = arg

                        if (regexes.strEnd.test(arg))
                            mode = 0
                    }
                }
                commands[commandsKey].args = Object.values(newArgs)
            } else
                commands.push({command: '', args: []})
        }
        this.commands = commands
        this.position = 0
        while (this.position < this.commands.length) {
            let {command} = this.commands[this.position]
            this.position++
            if (command?.match(/^\w+:$/)) {
                let label = command.replace(":", "")
                // @ts-ignore
                this.labels[command.replace(":", "")] = this.position
                this.memory.define(label, this.position)
            }
        }
        this.position = 0
        this.sleeping = 0
        this.updateDevice()
        return this
    }

    splitString(str: string) {
        if (!str) return []
        let result = [];
        let inQuotes = false;
        let currentWord = '';
        for (let i = 0; i < str.length; i++) {
            if (str[i] === ' ' && !inQuotes) {
                result.push(currentWord);
                currentWord = '';
            } else if (str[i] === '"' || str[i] === "'") {
                inQuotes = !inQuotes;
                currentWord += str[i];
            } else {
                currentWord += str[i];
            }
        }

        result.push(currentWord);

        return result;
    }

    /*
    * Stops currently running async execution
    */
    stop(): InterpreterIc10 {
        clearInterval(this.interval)
        return this;
    }

    async run() {
        return new Promise((resolve) => {
            this.interval = setInterval(() => {
                const why = this.prepareLine();
                if (why !== true) {
                    this.settings.debugCallback.call(this, why, [])
                    clearInterval(this.interval)
                }
            }, this.settings.tickTime)
            resolve(this)
        })
    }

    prepareLine(line = -1, isDebugger = false): ReturnCode | true {
        if (this.sleeping > 0) {
            this.sleeping--
            return true
        } else
            this.sleeping = 0

        if (line === 0) {
            this.memory.environ.db.properties.Error = 0// why not :)
        }
        if (line >= 0) {
            this.position = line;
        }
        if (!(this.position in this.commands)) {
            return 'end';
        }
        let {command, args} = this.commands[this.position]
        this.position++
        let isComment = true
        if (command && command != '' && !command.trim().endsWith(":")) {
            isComment = command.startsWith("#")
            for (const argsKey in args) {
                let a = parseFloat(args[argsKey])
                if (!isNaN(a)) {
                    args[argsKey] = String(a)
                }
            }
            try {
                if (command === "#die") return 'die'
                command = command.replace("#", "_")

                type Cmd = (...args: string[]) => void

                const runCommand = (cmd: Cmd) => {
                    if (command === undefined) throw new Ic10Error('Unknown function', command)

                    cmd.call(this, ...args)
                    this.updateDevice()
                    this.debug(command, args)
                }

                const scopes: Record<string, Cmd>[] = [
                    this.inGameCommands,
                    this.debugCommands
                ]

                let cmd: Cmd | undefined = undefined

                for (const scope of scopes) {
                    if (command in scope) {
                        cmd = scope[command]
                        break
                    }
                }

                if (cmd === undefined && !isComment)
                    throw new Ic10Error('Unknown function', command)
                else if (cmd !== undefined)
                    runCommand(cmd)
            } catch (e) {
                if (e instanceof Ic10Error)
                    e.line = this.position

                //mark as error for later executions
                this.memory.environ.db.properties.Error = 1
                if (e instanceof Ic10DiagnosticError || e instanceof Ic10Error)
                    this.settings.executionCallback.call(this, e)
                else
                    throw e
            }
        }
        if (command === "hcf")
            return 'hcf'

        if (isComment) {
            this.ignoreLine.push(this.position)
        }
        if (!isDebugger) {
            return isComment && this.position < this.commands.length
                ? this.prepareLine()
                : this.position < this.commands.length ? true : 'end'
        } else {
            return this.position < this.commands.length ? true : 'end'
        }
    }

    runUntilSync(cond: (status: true | ReturnCode) => boolean, maxIterations: number = 0) {
        let status: ReturnCode | true = true
        let n = 0;
        do {
            status = this.prepareLine()
            n++
        } while (!cond(status) && (maxIterations <= 0 || n <= maxIterations))

        return n
    }

    private debug(command: string, args: string[]) {
        if (!this.settings.debug)
            return

        this.settings.debugCallback.call(this, command, args)
    }

    private updateDevice() {
        if (this.device === undefined)
            return

        this.device.slots.forEach(slot => {
            if (slot.has("LineNumber"))
                slot.set("LineNumber", this.position)
        })
    }

    public connectDevice(name: string, hash: string | number, slotCount: number, fields: Partial<DeviceFieldsType>, additionalOptions?: Partial<AdditionalOptions>) {
        const d = new DebugDevice(slotCount, fields, additionalOptions)
        try {
            const deviceData = findDevice(hash)
            d.propertiesAccess = deviceData.params
            for (const paramsKey in deviceData.params) {
                d.properties[paramsKey] = 0
            }
            d.properties.PrefabHash = deviceData.PrefabHash
        } catch (e) {
            if (typeof hash === 'number') {
                d.properties.PrefabHash = hash
            } else {
                d.properties.PrefabHash = hashStr(hash)
            }
        }
        this.memory.environ.set(name, d)
    }
}

export default InterpreterIc10;

