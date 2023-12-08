import InterpreterIc10, {ReturnCode} from "../src/main";
import {Device} from "../src/devices/Device";
import {ScopeSettings} from "../src/commands/core";

export const interpreterIc10 = new InterpreterIc10();

interpreterIc10.setSettings({
    executionCallback: (err) => { throw err }
})

export const joinTemplate = (strings: TemplateStringsArray, values: any[]) =>
    strings
        .map((s, i) => `${s}${values[i] ?? ""}`)
        .join("")

export function ic10(strings: TemplateStringsArray, ...values: any[]) {
    return joinTemplate(strings, values)
        .split('\n')
        .map(line => line.trimStart())
        .join("\n")
}

//TODO: allow specifying network layouts
type ExecutionConfig = {
    maxLines?: number
    device?: Device
    connectedDevices?: {
        d0?: Device
        d1?: Device
        d2?: Device
        d3?: Device
        d4?: Device
        d5?: Device
    }
    breakWhen?: (status: true | ReturnCode) => boolean
    ic10Conf?: Partial<ScopeSettings>
}

const isTemplateStringsArray = (arg: ExecutionConfig | TemplateStringsArray): arg is TemplateStringsArray => Array.isArray(arg)

export function run(config: ExecutionConfig): (strings: TemplateStringsArray, ...values: any[]) => void
export function run(strings: TemplateStringsArray, ...values: any[]): void

export function run(arg1: ExecutionConfig | TemplateStringsArray, ...values: any[]) {
    let config: ExecutionConfig = {}

    const execute = (code: string, config: ExecutionConfig) => {
        const settings = interpreterIc10.getSettings()

        interpreterIc10.setSettings(config.ic10Conf ?? settings)
        interpreterIc10.init(code, config.device)

        const connectedDevices = config.connectedDevices ?? {}

        const devices = Array(6).fill(0).map((_, i) => `d${i}`)

        const connected: Record<string, Device> = connectedDevices

        devices.forEach(dn => {
            interpreterIc10.memory.environ.set(dn, connected[dn])
        })

        interpreterIc10.memory.environ.d0 = connectedDevices.d0

        interpreterIc10.runUntilSync(config.breakWhen ?? (() => false), config.maxLines ?? 10000)

        interpreterIc10.setSettings(settings)
    }

    if (isTemplateStringsArray(arg1)) {
        execute(ic10(arg1, ...values), config)
        return
    }

    config = arg1

    return function parser(strings: TemplateStringsArray, ...values: any[]) {
        const code = ic10(strings, ...values)

        execute(code, config)
    }
}

export const m = {
    dev: (d: string) => interpreterIc10.memory.getDevice(d),
    reg: (r: string) => interpreterIc10.memory.getRegister(r),
    val: (v: string) => interpreterIc10.memory.getValue(v),
    chan: (c: string) => interpreterIc10.memory.getDeviceOutput(c),
    stack: () => interpreterIc10.memory.stack.getStack(),
    findValue: (a:string) => interpreterIc10.memory.findValue(a)
}

export const makeDebugger = () => {
    type DebugInfo = {cmd: string, args: string[]}[]

    const debugInfo: DebugInfo = []

    const debugCallback = (cmd: string, args: string[]) => {
        debugInfo.push({cmd, args})
    }

    return {
        debugCallback,
        debugInfo
    }
}
