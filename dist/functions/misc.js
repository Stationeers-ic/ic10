import { z } from "zod";
import { Alias, AliasOrValue, Ralias, RaliasOrValue, RaliasOrValueOrNaN, RegisterOrDevice, } from "../ZodTypes";
const alias = (env, data) => {
    const [alias, dr] = z.tuple([Alias, RegisterOrDevice]).parse(data);
    env.alias(alias, dr);
};
const define = (env, data) => {
    const d = z.tuple([Alias, AliasOrValue]).parse(data);
    env.alias(d[0], env.get(d[1]));
};
const move = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], env.get(d[1]));
};
const yield_ = (env, data) => { };
const sleep = async (env, data) => {
    const [time] = z.tuple([RaliasOrValueOrNaN]).parse(data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, env.get(time) * 1000);
    });
};
const hcf = (env, data) => {
    env.hcf();
};
export const misc = {
    alias,
    define,
    move,
    yield: yield_,
    sleep,
    hcf,
};
export default misc;
