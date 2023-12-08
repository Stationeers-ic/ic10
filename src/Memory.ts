import {Ports} from "./Ports";
import {RegisterCell} from "./RegisterCell";
import {MemoryStack} from "./MemoryStack";
import {Device} from "./devices/Device";
import {ConstantCell} from "./ConstantCell";
import {hash2Int, hashStr, isHash, isNumber, isRecPort, isRegister, isSimplePort, patterns} from "./Utils";
import {ValueCell} from "./ValueCell";
import {DeviceOutput} from "./DeviceOutput";
import {Ic10Error} from "./Ic10Error";
import {isDevice} from "./types";

export class Memory {
    public cells: Array<RegisterCell>
    public stack: MemoryStack
    public environ: Ports
    public aliases: Record<string, ValueCell | Device> = {}
    public aliasesRevert:{[key:string]:string} ={}

    constructor() {
        this.cells = new Array<RegisterCell>(18)
        this.environ = new Ports()
        this.stack = new MemoryStack(512, "r16")

        for (let i = 0; i < 18; i++) {
            const n = `r${i}`
            if (i === 16) {
                this.cells[i] = this.stack
            } else {
                this.cells[i] = new RegisterCell(n)
            }
            this.cells[i].value = 0
        }
    }

    reset() {
        for (let r of this.cells)
            r.value = 0

        this.stack.getStack().fill(0)
        this.aliases = {}
        this.environ = new Ports()
    }

    findRegister(name: string | number): RegisterCell | undefined {
        const mapping: Record<string, string | undefined> = {
            sp: "r16",
            ra: "r17"
        }

        name = mapping[name] ?? name

        if (typeof name === "string") {
            if (isRegister(name)) {
                let m = patterns.reg.exec(name)

                if (!m)
                    throw new Ic10Error('Internal error')

                const prefix = m.groups?.prefix ?? ""
                const indexStr = m.groups?.index ?? "none"

                const index: number = parseInt(indexStr)

                let cell = this.cells[index]
                for (let i = 0; i < prefix.length; ++i) {
                    cell = this.cells[cell.value]

                    if (cell === undefined)
                        break
                }

                if (cell !== undefined)
                    return cell
            }

            if (name in this.aliases) {
                const mem = this.aliases[name]

                if (mem instanceof RegisterCell)
                    return mem
            }

            return undefined
        }

        if (name >= 18)
            throw new Ic10Error('Unknown register', name)

        return this.cells[name]
    }

    getRegister(name: string | number): RegisterCell {
        const reg = this.findRegister(name)

        if (!reg)
            throw new Ic10Error('Not a register', name)

        return reg
    }

    findDevice(name: string | number): Device | undefined {
        if (typeof name === "number")
            name = `d${name}`

        if (isSimplePort(name))
            return this.environ.get(name)

        if (isRecPort(name)) {
            const m = patterns.recDev.exec(name)

            if (!m)
                throw new Ic10Error('Internal error')

            const prefix = (m.groups?.prefix ?? "")
            const indexStr = m.groups?.index ?? "none"

            const index = this.getRegister(`${prefix}${indexStr}`).value

            return this.environ.get(`d${index}`)
        }

        if (name in this.aliases) {
            const mem = this.aliases[name]
            if (isDevice(mem))
                return mem
        }

        return undefined
    }

    getDevice(name: string | number): Device {
        const device = this.findDevice(name)

        if (!device)
            throw new Ic10Error('Unknown device', name)

        return device
    }

    getDeviceOrDeviceOutput(name: string): Device | DeviceOutput {
        const device = this.findDevice(name)

        if (device !== undefined)
            return device

        return this.getDeviceOutput(name)
    }

    getDeviceOutput(name: string): DeviceOutput {
        const [device, output] = name.split(':')
        if (!output)
            throw new Ic10Error('Empty output', name)

        if (isNaN(parseInt(output)))
            throw new Ic10Error('Invalid output', name)

        return this.getDevice(device).getChannel(parseInt(output))
    }

    findValue(value: string | number): number | undefined {
        if (typeof value === "number")
            return value

        if (isHash(value)) {
            return hash2Int(value)
        }

        const n = Number(value)
        if (!isNaN(n))
            return n

        const v = this.aliases[value]

        if (!v) {
            const r = this.findRegister(value)

            if (r)
                return r.value

            return undefined
        }

        if (v instanceof RegisterCell)
            return v.value
        if (v instanceof ConstantCell)
            return v.value

        return undefined
    }

    getValue(value: string | number): number {
        const v = this.findValue(value)

        if (v === undefined)
            throw new Ic10Error('Unknown value', v)

        return v
    }

    alias(name: string | number, link: string): Memory {
        const register = this.findRegister(link)

        if (register !== undefined) {
            this.aliases[name] = register
            if (typeof name === "string") {
                this.aliasesRevert[register.name] = name
            }
            return this
        }

        const device = this.findDevice(link)

        if (device !== undefined) {
            this.aliases[name] = device
            if (typeof name === "string") {
                this.aliasesRevert[link] = name
            }
            return this
        }

        throw new Ic10Error('Invalid alias value', link)
    }

    define(name: string, value: string | number) {
        if (typeof value === "string") {
            if (!isNumber(value))
                throw new Ic10Error("Not a number", value)

            value = parseFloat(value)
        }

        this.aliases[name] = new ConstantCell(value, name)
    }

    toLog() {
        const out: { [key: string]: any } = {};
        for (let i = 0; i < 18; i++) {
            if (i === 16) {
                out['r' + i] = this.cells[i].value
            } else {
                out['r' + i] = this.cells[i].value
                out['stack'] = this.cells[i].value
            }
        }
        return out
    }
}
