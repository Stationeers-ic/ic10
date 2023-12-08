import {crc32} from "crc";
import devices from "./data/devices";
import {Ic10Error} from "./Ic10Error";

export const patterns = {
    reg: /^(?<prefix>r*)r(?<index>0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a)$/,
    dev: /^d([012345b])$/,
    recDev: /^d(?<prefix>r+)(?<index>0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a)$/,
    strStart: /^".+$/,
    strEnd: /.+"$/,
    hash: /^HASH\("(?<hash>.+)"\)$/
}

export const hashStr = (name: string) => crc32(name) | 0

export const isHash = (value: string): boolean => patterns.hash.test(value)
export const isNumber = (value: string): boolean => {
    const regex = /^-?\d+(?:.\d+)?$/gm;
    return regex.exec(value.trim()) !== null;
}

export const hash2Int = (value: string)=>{
    if(!isHash(value)) return NaN
    const m = patterns.hash.exec(value)
    if (!m)
        throw new Ic10Error('Internal error')
    const hash = m.groups?.hash ?? ""
    return hashStr(hash)
}

export const isPort = (value: string): boolean => isSimplePort(value) || isRecPort(value)
export const isRecPort = (value: string): boolean => patterns.recDev.test(value)
export const isSimplePort = (value: string): boolean => patterns.dev.test(value)
export const isRegister = (value: string): boolean => patterns.reg.test(value)

export const findDevice = (HashOrName: string | number) => {
    let hash: number = 0;
    if (typeof HashOrName === "number") hash = HashOrName;
    if (typeof HashOrName === "string") hash = hashStr(HashOrName)
    const _hash = String(hash);

    const deviceName = devices['assoc'][_hash as keyof typeof devices['assoc']]

    return devices['devices'][deviceName as keyof typeof devices['devices']]
}
