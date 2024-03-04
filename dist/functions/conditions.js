import {z} from "zod";
import {StringOrNumberOrNaN} from "../ZodTypes";

export const epsilon = 2 ** -23;
const eq = (env, data) => {
    const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    return env.get(x) == env.get(y);
};
const ge = (env, data) => {
    const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    return env.get(x) >= env.get(y);
};
const gt = (env, data) => {
    const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    return env.get(x) > env.get(y);
};
const le = (env, data) => {
    const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    return env.get(x) <= env.get(y);
};
const lt = (env, data) => {
    const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    return env.get(x) < env.get(y);
};
const ne = (env, data) => !conditions.eq(env, data);
const na = (env, data) => {
    const [x, y, c] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    return (Math.abs(env.get(x) - env.get(y)) >
        Math.max(env.get(c) * Math.max(Math.abs(env.get(x)), Math.abs(env.get(y))), 1.1210387714598537e-44));
};
const ap = (env, data) => {
    const [x, y, c] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    return (Math.abs(env.get(x) - env.get(y)) <=
        Math.max(env.get(c) * Math.max(Math.abs(env.get(x)), Math.abs(env.get(y))), 1.1210387714598537e-44));
};
const dse = (env, data) => {
    const [d] = z.tuple([z.string()]).parse(data);
    return env.hasDevice(env.getAlias(d));
};
const dns = (env, data) => !conditions.dse(env, data);
const nan = (env, data) => {
    const [v] = z.tuple([StringOrNumberOrNaN]).parse(data);
    return isNaN(env.get(v));
};
const nanz = (env, data) => !conditions.nan(env, data);
export const conditions = {
    eq,
    ge,
    gt,
    le,
    lt,
    ne,
    na,
    ap,
    dse,
    dns,
    nan,
    nanz,
};
export default conditions;
