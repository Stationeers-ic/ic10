import {icFunction} from "../functions";
import {z} from "zod";
import {dev, reg} from "../regexps";

export const misc: { [key: string]: icFunction } = {
    alias: (env, data) => {
        const [alias, dr,] = z.tuple([
            z.string(),
            z.union([
                z.string().regex(reg),
                z.string().regex(dev)
            ])
        ]).parse(data)
        env.alias(alias, dr)
    },
    define: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.alias(d[0], env.get(d[1]))
    },
    move: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]))
    },
    yield: (env, data) => {
    },
    sleep: async (env, data) => {
        const [time] = z.tuple([z.string().or(z.number())]).parse(data)
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, env.get(time) * 1000)
        })
    }
}