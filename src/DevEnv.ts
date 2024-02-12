import {Environment} from "./abstract/Environment.js";
import {getProperty, setProperty} from 'dot-prop';
import {z} from "zod";

export class DevEnv extends Environment {

    constructor() {
        super()
        this.alias('sp', 'r16')
    }

    public data: any = {}
    public stack: number[] = new Array(512);
    public aliases = new Map<string, string|number>()

    pathValidate(path: string) {
        return true;
    }

    get(name: string | number): number {
        if (typeof name === 'number') return name
        if (!isNaN(parseFloat(name))) return parseFloat(name)
        if (this.aliases.has(name)) {
            return z.number().parse(this.get(z.string().parse(this.aliases.get(name))))
        }
        this.pathValidate(name)
        return z.number().parse(getProperty(this.data, name) ?? 0);
    }

    set(name: string, value: number): void {
        if (this.aliases.has(name)) {
            name = z.string().parse(this.aliases.get(name))
        }
        setProperty(this.data, name, value);
    }

    alias(name: string, value: string | number): void {
        name = z.string().parse(name)
        value = z.string().or(z.number()).parse(value)
        this.aliases.set(name, value)
    }

    jump(line: string | number): void {
        if (typeof line === 'number') this.line = line
        else this.line = this.get(line)
    }

    peek(): number {
        let sp = z.number().min(0).max(512).parse(this.get('sp'))
        const val = this.stack[sp - 1]
        return z.number().parse(val)
    }

    pop(): number {
        let sp = z.number().min(0).max(512).parse(this.get('sp'))
        const val = this.stack[--sp]
        this.set('sp', sp)
        return z.number().parse(val)
    }

    push(name: string | number): void {
        let sp = z.number().min(0).max(512).parse(this.get('sp'))
        this.stack[sp++] = this.get(name)
        this.set('sp', sp)
    }


}