import conditions from "./conditions";
import { z } from "zod";
import { DeviceOrAlias, Ralias, RaliasOrValue } from "../ZodTypes";
const booleanToNumber = (x) => (x ? 1 : 0);
const seq = (env, data) => {
    const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, booleanToNumber(conditions.eq(env, [op2, op3])));
};
const sge = (env, data) => {
    const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, booleanToNumber(conditions.ge(env, [op2, op3])));
};
const sgt = (env, data) => {
    const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, booleanToNumber(conditions.gt(env, [op2, op3])));
};
const sle = (env, data) => {
    const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, booleanToNumber(conditions.le(env, [op2, op3])));
};
const slt = (env, data) => {
    const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, booleanToNumber(conditions.lt(env, [op2, op3])));
};
const sne = (env, data) => {
    const [op1, op2, op3] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, booleanToNumber(conditions.ne(env, [op2, op3])));
};
const sap = (env, data) => {
    const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, booleanToNumber(conditions.ap(env, [op2, op3, op4])));
};
const sna = (env, data) => {
    const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, booleanToNumber(conditions.na(env, [op2, op3, op4])));
};
const seqz = (env, data) => seq(env, [...data, 0]);
const sgez = (env, data) => sge(env, [...data, 0]);
const sgtz = (env, data) => sgt(env, [...data, 0]);
const slez = (env, data) => sle(env, [...data, 0]);
const sltz = (env, data) => slt(env, [...data, 0]);
const snez = (env, data) => sne(env, [...data, 0]);
const sapz = (env, [op1, op2, op3]) => sap(env, [op1, op2, 0, op3]);
const snaz = (env, [op1, op2, op3]) => sna(env, [op1, op2, 0, op3]);
const sdse = (env, data) => {
    const [op1, op2] = z.tuple([Ralias, DeviceOrAlias]).parse(data);
    env.set(op1, booleanToNumber(conditions.dse(env, [op2])));
};
const sdns = (env, data) => {
    const [op1, op2] = z.tuple([Ralias, DeviceOrAlias]).parse(data);
    env.set(op1, booleanToNumber(conditions.dns(env, [op2])));
};
const snan = (env, data) => {
    const [op1, op2] = z.tuple([Ralias, Ralias]).parse(data);
    env.set(op1, booleanToNumber(conditions.nan(env, [op2])));
};
const snanz = (env, data) => {
    const [op1, op2] = z.tuple([Ralias, Ralias]).parse(data);
    env.set(op1, booleanToNumber(conditions.nanz(env, [op2])));
};
const sel = (env, data) => {
    const [op1, op2, op3, op4] = z.tuple([Ralias, RaliasOrValue, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(op1, env.get(op2) ? env.get(op3) : env.get(op4));
};
export const select = {
    seq,
    sge,
    sgt,
    sle,
    slt,
    sne,
    sap,
    sna,
    seqz,
    sgez,
    sgtz,
    slez,
    sltz,
    snez,
    sapz,
    snaz,
    sdse,
    sdns,
    snan,
    snanz,
    select: sel,
};
export default select;
