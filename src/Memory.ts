import InterpreterIc10, {Execution, regexes} from "./main";
import {Environ} from "./Environ";
import {MemoryCell} from "./MemoryCell";
import {MemoryStack} from "./MemoryStack";
import {Device} from "./Device";
import {ConstantCell} from "./ConstantCell";
import {Hash, IntRange, isChip, isHash, isNumber, isPort, isRegister, isStack, Port, Register, Stack} from "./types";

export class Memory {
    public cells: Array<MemoryCell | MemoryStack>
    public environ: Environ
    public aliases: Record<string, MemoryCell | Device | ConstantCell>
    readonly #scope: InterpreterIc10;

    constructor(scope: InterpreterIc10) {
        this.#scope = scope;
        this.cells = new Array<MemoryCell>(18)
        this.environ = new Environ(scope)
        this.aliases = {}

        for (let i = 0; i < 18; i++) {
            const n = `r${i}`
            if (i === 16) {
                this.cells[i] = new MemoryStack(scope, n)
            } else {
                this.cells[i] = new MemoryCell(scope, n)
            }
        }
    }

    get scope(): InterpreterIc10 | null {
        return null;
    }

    cell(cell: string | number, op1: any = null, op2: any = null): any {
        if (typeof cell === "string") {
            if (cell == 'sp') cell = 'r16'
            if (cell == 'ra') cell = 'r17'
            if (regexes.rr1.test(cell)) {
                let m = regexes.rr1.exec(cell)
                if (m) {
                    let m1 = this.cell(cell.replace(m[1], this.cell(m[1])), op1, op2) ?? false
                    if (m1 !== false) {
                        return m1
                    }
                    throw Execution.error(this.#scope.position, 'Unknown cell', m1)
                }
                throw Execution.error(this.#scope.position, 'Syntax error')

            }
            if (regexes.r1.test(cell)) {
                let m = regexes.r1.exec(cell)
                if (m && m[1] in this.cells) {
                    const index = parseInt(m[1]);
                    if (op1 === null) {
                        return this.cells[index].get()
                    } else {
                        return this.cells[index].set(null, this.cell(op1))
                    }
                } else {
                    throw Execution.error(this.#scope.position, 'Unknown cell', cell)
                }
            }
            if (regexes.d1.test(cell)) {
                if (cell in this.environ) {
                    if (op1 === null) {
                        throw Execution.error(this.#scope.position, 'Have not `Port`', cell)
                    } else {
                        if (op2 !== null) {
                            return this.environ.get(cell)?.set(op1, this.cell(op2))
                        }
                        return this.environ.get(cell)?.get(op1)
                    }
                } else {
                    throw Execution.error(this.#scope.position, 'Unknown cell', cell)
                }
            }
            if (cell in this.aliases) {
                if (this.aliases[cell].constructor.name === 'MemoryCell') {
                    if (op1 === null) {
                        return this.aliases[cell].get(null)
                    } else {
                        return this.aliases[cell].set(null, this.cell(op1))
                    }
                } else if (this.aliases[cell] instanceof Device) {
                    if (op1 === null) {
                        throw Execution.error(this.#scope.position, 'Have not `Port`', cell)
                    } else {
                        if (op2 !== null) {
                            return this.aliases[cell].set(op1, this.cell(op2))
                        }
                        return this.aliases[cell].get(op1)
                    }
                } else if (this.aliases[cell] instanceof ConstantCell) {
                    return this.aliases[cell].get(null)
                } else {
                    throw Execution.error(this.#scope.position, 'Unknown cell', cell)
                }
            }
            if (String(cell).trim().match(/[\d/.]+/)) {
                return parseFloat(cell)
            }
            throw Execution.error(this.#scope.position, 'Unknown cell', cell)
        }
        return cell
    }

    getCell(cell: Stack): MemoryStack
    getCell(cell: Register): MemoryCell
    getCell(cell: Port): Device
    getCell(cell: Hash): number
    getCell(cell: string | number): MemoryCell | MemoryStack | Device | number
    getCell(cell: string | number): MemoryCell | MemoryStack | Device | number {
        const hash = this.findHash(cell)
        if (hash !== undefined)
            return hash

        const reg = this.findRegister(cell)

        if (reg)
            return reg

        const device = this.findDevice(cell)

        if (device)
            return device

        if (typeof cell === "string" && cell in this.aliases)
            return this.aliases[cell]

        throw Execution.error(this.#scope.position, 'Unknown cell', cell)
    }

    findHash(name: string | number): number | undefined {
        if (isHash(name)) {
            return -1
        }
        return undefined
    }

    findRegister(name: string | number): MemoryCell | undefined {
        if (isRegister(name) || isStack(name)) {
            const mapping: Record<string, string | undefined> = {
                sp: "r16",
                ra: "r17"
            }
            name = mapping[name] ?? name

            if (typeof name === "string") {
                // TODO: was this needed?
                if (regexes.rr1.test(name)) {
                    let m = regexes.rr1.exec(name)
                    if (!m)
                        throw Execution.error(this.#scope.position, 'Syntax error')
                    const index = name.replace(m[1], this.cell(m[1])) as `r${IntRange<0, 16>}`
                    let m1 = this.getRegister(index)
                    if (!m1)
                        throw Execution.error(this.#scope.position, 'Unknown register', m1)

                    return m1
                }
                if (regexes.r1.test(name)) {
                    let m = regexes.r1.exec(name)

                    if (!m)
                        throw Execution.error(this.#scope.position, 'Syntax error')

                    const index: number = parseInt(m[1])

                    if (index in this.cells)
                        return this.cells[index]
                }
                if (name in this.aliases) {
                    const mem = this.aliases[name]

                    if (regexes.r1.test(mem.name))
                        return mem
                }

                return undefined
            }

            if (name >= 18)
                throw Execution.error(this.#scope.position, 'Unknown register', name)

            return this.cells[name]
        }
        if(this.aliases[name]!== undefined && this.aliases[name] instanceof MemoryCell){
            return this.aliases[name]
        }
        return undefined
    }

    getRegister(name: string | number): MemoryCell {
        const reg = this.findRegister(name)

        if (!reg)
            throw Execution.error(this.#scope.position, 'Not a register', name)

        return reg
    }

    findDevice(name: string | number): Device | undefined {
        if (isPort(name) || isChip(name))
            return this.environ.get(name)
        return undefined
    }

    getDevice(name: string | number): Device {
        const device = this.findDevice(name)

        if (!device)
            throw Execution.error(this.#scope.position, 'Unknown device', name)

        return device
    }

    findValue(value: string | number): number | undefined {
        const hash = this.findHash(value)
        if (hash !== undefined)
            return hash
        if (isNumber(value))
            return parseFloat(String(value))

        const v = this.aliases[value]

        if (!v)
            return undefined
        if (!isNumber(v.value))
            return undefined

        return v.value
    }

    getValue(value: string | number): number {
        const v = this.findValue(value)

        if (!v)
            throw Execution.error(this.#scope.position, 'Unknown value', v)

        return v
    }

    alias(name: string | number, link: string | number) {
        const result = this.getCell(link)
        if (!isNumber(result)) {
            this.aliases[name] = result
            if (this.aliases[name] instanceof MemoryCell) {
                this.aliases[name].alias = name;
            }
            return this
        }
        throw Execution.error(this.#scope.position, 'Invalid alias value')
    }

    define(name: string, value: string | number) {
        if (typeof value === "string")
            value = parseInt(value)

        this.aliases[name] = new ConstantCell(value, this.#scope, name)
    }

    toLog() {
        const out: { [key: string]: any } = {};
        for (let i = 0; i < 18; i++) {
            if (i === 16) {
                out['r' + i] = this.cells[i].get()
            } else {
                out['r' + i] = this.cells[i].get()
                out['stack'] = this.cells[i].value
            }
        }
        return out
    }
}
