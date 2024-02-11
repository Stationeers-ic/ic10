import {z} from "zod";
import {icFunction} from "../functions";
export const arithmetic: { [key: string]: icFunction } = {
    add: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) + env.get(d[2]))
    },
    sub: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) - env.get(d[2]))
    },
    mul: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) * env.get(d[2]))
    },
    div: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) / env.get(d[2]))
    },
    mod: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) % env.get(d[2]))
    },
    sqrt: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.sqrt(env.get(d[1])))
    },
    round: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.round(env.get(d[1])))
    },
    trunc: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.trunc(env.get(d[1])))
    },
    ceil: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.ceil(env.get(d[1])))
    },
    floor: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.floor(env.get(d[1])))
    },
    max: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.max(env.get(d[1]), env.get(d[2])))
    },
    min: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.min(env.get(d[1]), env.get(d[2])))
    },
    abs: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.abs(env.get(d[1])))
    },
    log: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.log(env.get(d[1])))
    },
    exp: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.exp(env.get(d[1])))
    },
    rand: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.random())
    },
    sll: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) << env.get(d[2]))
    },
    srl: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) >>> env.get(d[2]))
    },
    sla: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], (env.get(d[1]) << env.get(d[2])) + Number(env.get(d[1]) < 0) * ((2 << env.get(d[2])) - 1))
    },
    sra: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) >> env.get(d[2]))
    },
    sin: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.sin(env.get(d[1])))
    },
    cos: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.cos(env.get(d[1])))
    },
    tan: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.tan(env.get(d[1])))
    },
    asin: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.asin(env.get(d[1])))
    },
    acos: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.acos(env.get(d[1])))
    },
    atan: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.atan(env.get(d[1])))
    },
    atan2: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.atan2(env.get(d[1]), env.get(d[2])))
    },
    and: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) & env.get(d[2]))
    },
    or: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) | env.get(d[2]))
    },
    xor: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) ^ env.get(d[2]))
    },
    nor: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], ~(env.get(d[1]) | env.get(d[2])))
    },
}