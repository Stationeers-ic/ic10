import { z } from "zod";
import { Alias, AliasOrValue, Ralias, RaliasOrValue, RaliasOrValueOrNaN } from "../ZodTypes";
import { RegisterOrDevice } from "../RegisterOrDevice";
export const misc = {
    alias: (env, data) => {
        const [alias, dr] = z.tuple([Alias, RegisterOrDevice]).parse(data);
        env.alias(alias, dr);
    },
    define: (env, data) => {
        const d = z.tuple([Alias, AliasOrValue]).parse(data);
        env.alias(d[0], env.get(d[1]));
    },
    move: (env, data) => {
        const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
        env.set(d[0], env.get(d[1]));
    },
    // TODO: ?
    yield: (env, data) => { },
    sleep: async (env, data) => {
        const [time] = z.tuple([RaliasOrValueOrNaN]).parse(data);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, env.get(time) * 1000);
        });
    },
    hcf: (env, data) => {
        env.hcf();
    },
};
