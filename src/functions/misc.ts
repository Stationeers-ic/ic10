import {icFunction} from "../functions";
import {z} from "zod";

export const misc: { [key: string]: icFunction } = {
    alias: (env, data) => {
        const d = z.tuple([z.string(), z.string()]).parse(data)
        env.alias(d[0], d[1])
    },
    define: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.alias(d[0], env.get(d[1]))
    },
    move: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]))
    },
}