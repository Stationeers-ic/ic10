import {regexes} from "./main";

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
export type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;


export type Register = `r${IntRange<0, 15>}` | 'ra'
export type Port = `d${IntRange<0, 5>}`
export type Chip = `db`
export type Stack = 'sp' | 'r16'
export type Hash = `HASH("${string}")`

export function isNumber(value: any): value is number {
    if (typeof value === 'number') {
        return false
    }
    const regex = /^\d+$/gm;
    return typeof value === 'string' && regex.exec(value.trim()) !== null;
}

export function isRegister(value: any): value is Register {
    if (isNumber(value)) {
        return false
    }
    return regexes.r1.test(value) || regexes.rr1.test(value) || value === 'ra'
}

export function isPort(value: any): value is Port {
    if (isNumber(value)) {
        return false
    }
    return regexes.d1.test(value) || regexes.dr1.test(value)
}

export function isChip(value: any): value is Chip {
    return value === 'db'
}

export function isStack(value: any): value is Stack {
    return value === 'sp' || value === 'r16'
}

export function isHash(value: any): value is Hash {
    const r = /HASH\("(\w+)"\)/gm
    const t = r.exec(value)
    return t !== null;
}
