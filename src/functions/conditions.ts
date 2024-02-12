//import {Scope} from "./core";
//
// export const makeConditions = (scope: Scope) => {
//     const eq = (a: number, b: number = 0) => a == b
//
//     const ge = (a: number, b: number = 0) => a >= b
//
//     const gt = (a: number, b: number = 0) => a > b
//
//     const le = (a: number, b: number = 0) => a <= b
//
//     const lt = (a: number, b: number = 0) => a < b
//
//     const ne = (a: number, b: number = 0) => a != b
//
//     const ap = (x: number, y: number, c: number = 0) => !na(x, y, c)
//
//     const na = (x: number, y: number, c: number = 0) => Math.abs(x - y) > c * Math.max(Math.abs(x), Math.abs(y))
//
//     const dse = (d: string) => scope.memory.findDevice(d) !== undefined
//
//     const dns = (d: string) => !dse(d)
//
//     const nan = (v: number) => isNaN(scope.memory.getValue(v))
//
//     const nanz = (v: number) => !nan(v)
//
//     return { eq, ge, gt, le, lt, ne, ap, na, dse, dns, nan, nanz }
// }
//
// export type Conditions = ReturnType<typeof makeConditions>

import {icCondition} from "../functions";
import {z} from "zod";

const eq: icCondition = (env, data): boolean => {
    const [x, y] = z.tuple([z.string().or(z.number()), z.string().or(z.number())]).parse(data)
    return env.get(x) == env.get(y)
}
const ge: icCondition = (env, data): boolean => {
    const [x, y] = z.tuple([z.string().or(z.number()), z.string().or(z.number())]).parse(data)
    return env.get(x) >= env.get(y)
}
const gt: icCondition = (env, data): boolean => {
    const [x, y] = z.tuple([z.string().or(z.number()), z.string().or(z.number())]).parse(data)
    return env.get(x) > env.get(y)
}
const le: icCondition = (env, data): boolean => {
    const [x, y] = z.tuple([z.string().or(z.number()), z.string().or(z.number())]).parse(data)
    return env.get(x) <= env.get(y)
}
const lt: icCondition = (env, data): boolean => {
    const [x, y] = z.tuple([z.string().or(z.number()), z.string().or(z.number())]).parse(data)
    return env.get(x) < env.get(y)
}
const ne: icCondition = (env, data): boolean => {
    const [x, y] = z.tuple([z.string().or(z.number()), z.string().or(z.number())]).parse(data)
    return env.get(x) != env.get(y)
}
const na: icCondition = (env, data): boolean => {
    const [x, y, c] = z.tuple([z.string().or(z.number()), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
    return Math.abs(env.get(x) - env.get(y)) > env.get(c) * Math.max(Math.abs(env.get(x)), Math.abs(env.get(y)))
}
const ap: icCondition = (env, data): boolean => {
    const [x, y, c] = z.tuple([z.string().or(z.number()), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
    return !na(env, [env.get(x), env.get(y), env.get(c)])
}
const dse: icCondition = (env, data): boolean => {
    const [d] = z.tuple([z.string()]).parse(data)
    return env.hasDevice(env.getAlias(d))
}
const dns: icCondition = (env, data): boolean => {
    const [d] = z.tuple([z.string()]).parse(data)
    return !env.hasDevice(env.getAlias(d))
}
const nan: icCondition = (env, data): boolean => {
    const [v] = z.tuple([z.string().or(z.number())]).parse(data)
    return isNaN(env.get(v))
}
const nanz: icCondition = (env, data): boolean => {
    const [v] = z.tuple([z.string().or(z.number())]).parse(data)
    return !isNaN(env.get(v))
}

export const conditions = {eq, ge, gt, le, lt, ne, ap, na, dse, dns, nan, nanz}