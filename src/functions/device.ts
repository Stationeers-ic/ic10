import {icFunction} from "../functions";
import {z} from "zod";
//import {Scope} from "./core";
// import {Ic10DiagnosticError, Ic10Error} from "../Ic10Error";
// import {Device} from "../devices/Device";
// import {isChannel, isDeviceParameter} from "../icTypes";
// import {isDevice} from "../types";
//
// export const BatchModes = {
//     Average: 0,
//     Sum: 1,
//     Minimum: 2,
//     Maximum: 3
// } as const
//
// export const makeDeviceCommands = (scope: Scope) => {
//
//     function __transformBatch(values: number[], mode: string) {
//         const modeMapping: Record<string, number | undefined> = BatchModes
//
//         const m = modeMapping[mode] ?? scope.memory.getValue(mode)
//
//         switch (m) {
//             case BatchModes.Average:
//                 return values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length
//             case BatchModes.Sum:
//                 return values.reduce((partial_sum, a) => partial_sum + a, 0)
//             case BatchModes.Minimum:
//                 return Math.min(...values)
//             case BatchModes.Maximum:
//                 return Math.max(...values)
//         }
//
//         throw new Ic10Error("Unknown batch mode", mode)
//     }
//
//     function __getDevices(hash: number, name?: number) {
//         const devices: Device[] = []
//
//         //TODO: check all devices in the network
//         for (let i = 0; i <= 5; i++) {
//             const d = scope.memory.findDevice('d' + i);
//
//             if (d === undefined)
//                 continue
//
//             if (d.get("PrefabHash") == hash && (name === undefined || d.nameHash === name))
//                 devices.push(d)
//         }
//
//         return devices
//     }
//
//     /*
//     * @l@
//     * [en] Reading the value of parameter op3 from port op2
//     * [ru] Чтение значения параметра op3 из порта op2
//     */
//     const l = (register: string, device: string, property: string) => {
//         const r = scope.memory.getRegister(register)
//         const a = scope.memory.getDeviceOrDeviceOutput(device)
//         if (isDevice(a)) {
//             if (!isDeviceParameter(property))
//                 throw new Ic10DiagnosticError(`Wrong third argument, expected device parameter`, property)
//         } else {
//             if (!isChannel(property))
//                 throw new Ic10DiagnosticError(`Wrong third argument, expected channel`, property)
//         }
//         r.value = a.get(property)
//     }
//
//     /*
//     * @ls@
//     * [en] Read value op4 from slot op3 of port op2
//     * [ru] Чтение из устройства op2, слота op3, параметра op4 в регистр op1
//     */
//     const ls = (register: string, device: string, slot: string, property: string) => {
//         const r = scope.memory.getRegister(register)
//         const d = scope.memory.getDevice(device)
//         r.value = d.getSlot(scope.memory.getValue(slot), property) as number
//     }
//
//     /*
//     * @s@
//     * [en] Writing a value to the op2 parameter of port op1
//     * [ru] Запись значения в параметр op2 порта op1
//     */
//     const s = (device: string, property: string, value: string) => {
//         const a = scope.memory.getDeviceOrDeviceOutput(device)
//         if (isDevice(a)) {
//             if (!isDeviceParameter(property)) {
//                 throw new Ic10DiagnosticError(`Wrong second argument (${property}). Must be "Device parameter"`, property)
//             }
//         } else {
//             if (!isChannel(property)) {
//                 throw new Ic10DiagnosticError(`Wrong second argument (${property}). Must be "Channel"`, property)
//             }
//         }
//         a.set(property, scope.memory.getValue(value))
//     }
//
//     /*
//     * @lb@
//     * [en] Batch read in op1 from all devices with hash op2 of parameter op3 in op4 mode
//     * [ru] Пакетное чтение в op1 из всех устройств с хешем op2 параметра op3 в режиме op4
//     */
//     const lb = (register: string, deviceHash: string, property: string, mode: string) => {
//         const hash = scope.memory.getValue(deviceHash)
//
//         const devices = __getDevices(hash)
//
//         if (devices.length === 0)
//             throw new Ic10DiagnosticError('Can`t find device with hash', hash)
//
//         const values = devices.map(d => d.get(property) as number)
//
//         scope.memory.getRegister(register).value = __transformBatch(values, mode)
//     }
//
//     /*
//     * @lr@
//     * [en] Read reagent value op4 in op3 mode from port op2
//     * [ru] Чтение значения реагента op4 в режиме op3 из порта op2
//     */
//     const lr = (register: string, device: string, mode: string, reagent: string) => {
//         const d = scope.memory.getDevice(device)
//
//         const r = scope.memory.getValue(reagent)
//         const m = scope.memory.getValue(mode)
//
//         scope.memory.getRegister(register).value = d.getReagent(m, r)
//     }
//
//     /*
//     * @sb@
//     * [en] Batch write to all devices with hash op1 to parameter op2 of value op3
//     * [ru] Пакетная запись во все устройства с хешем op1 в параметр op2 значения op3
//     */
//     const sb = (deviceHash: string, property: string, value: string) => {
//         const hash = scope.memory.getValue(deviceHash)
//         const v = scope.memory.getValue(value)
//         const devices = __getDevices(hash)
//
//         devices.forEach(d => d.set(property, v))
//     }
//
//     /*
//     * @lbn@
//     * [en]
//     * [ru] Чтение c устройства по хеш op2 и HASH("name") op3 параметра op4 режимом чтение op5 в регистр op1
//     */
//     const lbn = (targetRegister: string, deviceHash: string, nameHash: string, property: string, batchMode: string) => {
//         const hash = scope.memory.getValue(deviceHash);
//         const name = scope.memory.getValue(nameHash)
//         const devices = __getDevices(hash, name)
//
//         const values = devices.map(d => d.get(property) as number)
//         if (values.length === 0)
//             throw new Ic10Error("Can't find device with hash", hash)
//
//         scope.memory.getRegister(targetRegister).value = __transformBatch(values, batchMode)
//     }
//
//     /*
//     * @sbn@
//     * [en]
//     * [ru] Записывает в устройство хеш op1, хеш имя HASH("name") op2, параметр op3 значение op4
//     */
//     const sbn = (deviceHash: string, nameHash: string, property: string, value: string) => {
//         const hash = scope.memory.getValue(deviceHash)
//         const v = scope.memory.getValue(value)
//         const name = scope.memory.getValue(nameHash)
//         const devices = __getDevices(hash, name)
//
//         devices.forEach(d => d.set(property, v))
//     }
//
//     /*
//     * @lbs@
//     * [en]
//     * [ru] Пакетное чтение слотов.
//     */
//     const lbs = (register: string, deviceHash: string, slotIndex: string, property: string, batchMode: string) => {
//         const hash = scope.memory.getValue(deviceHash)
//         const slot = scope.memory.getValue(slotIndex)
//         const devices = __getDevices(hash)
//
//         const values = devices.map(d => d.getSlot(slot, property) as number)
//
//         scope.memory.getRegister(register).value = __transformBatch(values, batchMode)
//     }
//
//     /*
//     * @lbns@
//     * [en]
//     * [ru] Чтение из устройства хеш op2, имя устройства HASH("name") op3, слота op4, параметра op5, способом op6 в регистр op1
//     */
//     const lbns = (register: string, deviceHash: string, nameHash: string, slotIndex: string, property: string, batchMode: string) => {
//         const hash = scope.memory.getValue(deviceHash)
//         const name = scope.memory.getValue(nameHash)
//         const slot = scope.memory.getValue(slotIndex)
//         const devices = __getDevices(hash, name)
//
//         const values = devices.map(d => d.getSlot(slot, property) as number)
//
//         scope.memory.getRegister(register).value = __transformBatch(values, batchMode)
//     }
//
//     /*
//     * @ss@
//     * [en]
//     * [ru] Запись в слот в устройства потр ор1, слот ор2, параметр ор3, значения ор4
//     */
//     const ss = (device: string, slotIndex: string, property: string, value: string) => {
//         const d = scope.memory.getDevice(device)
//         const v = scope.memory.getValue(value)
//         const slot = scope.memory.getValue(slotIndex);
//
//         d.getSlot(slot).set(property, v)
//     }
//
//     /*
//     * @sbs@
//     */
//     const sbs = (deviceHash: string, slotIndex: string, property: string, value: string) => {
//         const hash = scope.memory.getValue(deviceHash)
//         const v = scope.memory.getValue(value)
//         const slot = scope.memory.getValue(slotIndex);
//
//         const devices = __getDevices(hash)
//
//         devices.map(d => d.getSlot(slot).set(property, v))
//     }
//
//     return {
//         l, ls, s, lb, lr, sb, lbn, sbn, lbs, lbns, ss, sbs
//     }
// }
export const device: { [key: string]: icFunction } = {
    s: (env, data) => {
        const [op1, op2, op3] = z.tuple([z.string(), z.string(), z.string().or(z.number())]).parse(data)
        env.set(`${env.getAlias(op1)}.${env.getAlias(op2)}`, env.get(op3))
    },
    l: (env, data) => {
        const [op1, op2, op3] = z.tuple([z.string(), z.string(), z.string()]).parse(data)
        env.set(op1, env.get(`${env.getAlias(op2)}.${env.getAlias(op3)}`))
    },

    sb: (env, data) => {
        const [hash, logic, register] = z.tuple([z.string(), z.string(), z.string().or(z.number())]).parse(data)
        env.getDeviceByHash(env.get(hash)).forEach((d) => {
            env.set(`${d}.${logic}`, env.get(register))
        })
    },
    lb: (env, data) => {
        const [register, hash, logic, mode] = z.tuple([z.string(), z.string(), z.string(), z.string()]).parse(data)
        const values: number[] = []
        env.getDeviceByHash(env.get(hash)).forEach((d) => {
            values.push(env.get(`${d}.${logic}`))
        })
        switch (env.get(mode)) {
            case 0:
                env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
                break
            case 1:
                env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0))
                break
            case 2:
                env.set(register, Math.min(...values))
                break
            case 3:
                env.set(register, Math.max(...values))
                break
        }
    },
    lbn: (env, data) => {
        const [register, hash, name, logic, mode] = z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]).parse(data)
        const values: number[] = []
        env.getDeviceByHashAndName(env.get(hash), env.get(name)).forEach((d) => {
            values.push(env.get(`${d}.${logic}`))
        })
        switch (env.get(mode)) {
            case 0:
                env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
                break
            case 1:
                env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0))
                break
            case 2:
                env.set(register, Math.min(...values))
                break
            case 3:
                env.set(register, Math.max(...values))
                break
        }
    },
    lr: (env, data) => {
        const [register, device, reagentMode, hash] = z.tuple([z.string(), z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(register, env.get(`${device}.reagents.${reagentMode}.${hash}`))
    },
    sbn: (env, data) => {
        const [hash, name, logic, register] = z.tuple([z.string().or(z.number()), z.string().or(z.number()), z.string().or(z.number()), z.string()]).parse(data)
        env.getDeviceByHashAndName(env.get(hash), env.get(name)).forEach((d) => {
            env.set(`${d}.${logic}`, env.get(register))
        })
    },
    lbs: (env, data) => {
        const [register, hash, slot, logic, mode] = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number()), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        const values: number[] = []
        env.getDeviceByHash(env.get(hash)).forEach((d) => {
            values.push(env.get(`${d}.slots.${slot}.${logic}`))
        })
        switch (env.get(mode)) {
            case 0:
                env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
                break
            case 1:
                env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0))
                break
            case 2:
                env.set(register, Math.min(...values))
                break
            case 3:
                env.set(register, Math.max(...values))
                break
        }
    },
    lbns: (env, data) => {
        const [register, hash, name, slot, logic, mode] = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number()), z.string().or(z.number()), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        const values: number[] = []
        env.getDeviceByHashAndName(env.get(hash), env.get(name)).forEach((d) => {
            values.push(env.get(`${d}.slots.${slot}.${logic}`))
        })
        switch (env.get(mode)) {
            case 0:
                env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length)
                break
            case 1:
                env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0))
                break
            case 2:
                env.set(register, Math.min(...values))
                break
            case 3:
                env.set(register, Math.max(...values))
                break
        }
    },
    ss: (env, data) => {
        const [device, slot, property, value] = z.tuple([z.string(), z.string().or(z.number()), z.string(), z.string().or(z.number())]).parse(data)
        env.set(`${device}.slots.${slot}.${property}`, env.get(value))
    },
    sbs: (env, data) => {
        const [hash, slot, property, value] = z.tuple([z.string().or(z.number()), z.string().or(z.number()), z.string(), z.string().or(z.number())]).parse(data)
        env.getDeviceByHash(env.get(hash)).forEach((d) => {
            env.set(`${d}.slots.${slot}.${property}`, env.get(value))
        })
    },
}