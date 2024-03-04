import {z} from "zod";
import {BitWarn} from "../errors/BitWarn";
import {Ralias, RaliasOrValue} from "../ZodTypes";

function jsThing(value) {
    if (Object.is(value, -0))
        return 0;
    if (Object.is(value, -Infinity))
        return Infinity;
    return value;
}
const add = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) + env.get(d[2])));
};
const sub = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) - env.get(d[2])));
};
const mul = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) * env.get(d[2])));
};
const div = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) / env.get(d[2])));
};
const mod = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    let num = env.get(d[1]) % env.get(d[2]);
    if (num < 0)
        num += env.get(d[2]);
    env.set(d[0], jsThing(num));
};
const sqrt = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.sqrt(env.get(d[1]))));
};
const round = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.round(env.get(d[1]))));
};
const trunc = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.trunc(env.get(d[1]))));
};
const ceil = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.ceil(env.get(d[1]))));
};
const floor = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.floor(env.get(d[1]))));
};
const max = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.max(env.get(d[1]), env.get(d[2]))));
};
const min = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.min(env.get(d[1]), env.get(d[2]))));
};
const abs = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.abs(env.get(d[1]))));
};
const log = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.log(env.get(d[1]))));
};
const exp = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.exp(env.get(d[1]))));
};
const rand = (env, data) => {
    const d = z.tuple([Ralias]).parse(data);
    env.set(d[0], jsThing(Math.random()));
};
const sll = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    const l = env.get(d[2]);
    if (l < 0) {
        env.set(d[0], 0);
    }
    else {
        env.set(d[0], jsThing(env.get(d[1]) << l));
    }
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
const srl = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    const l = env.get(d[2]);
    if (l < 0) {
        env.set(d[0], 0);
    }
    else {
        env.set(d[0], jsThing(env.get(d[1]) >>> env.get(d[2])));
    }
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
const sla = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    const l = env.get(d[2]);
    if (l < 0) {
        env.set(d[0], 0);
    }
    else {
        env.set(d[0], jsThing((env.get(d[1]) << env.get(d[2])) + Number(env.get(d[1]) < 0) * ((2 << env.get(d[2])) - 1)));
    }
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
const sra = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    const l = env.get(d[2]);
    if (l < 0) {
        env.set(d[0], 0);
    }
    else {
        env.set(d[0], jsThing(env.get(d[1]) >> env.get(d[2])));
    }
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
const sin = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.sin(env.get(d[1]))));
};
const cos = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.cos(env.get(d[1]))));
};
const tan = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.tan(env.get(d[1]))));
};
const asin = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.asin(env.get(d[1]))));
};
const acos = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.acos(env.get(d[1]))));
};
const atan = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.atan(env.get(d[1]))));
};
const atan2 = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.atan2(env.get(d[1]), env.get(d[2]))));
};
const and = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) & env.get(d[2])));
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
const or = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) | env.get(d[2])));
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
const xor = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) ^ env.get(d[2])));
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
const nor = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(~(env.get(d[1]) | env.get(d[2]))));
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
export const arithmetic = {
    add,
    sub,
    mul,
    div,
    mod,
    sqrt,
    round,
    trunc,
    ceil,
    floor,
    max,
    min,
    abs,
    log,
    exp,
    rand,
    sll,
    srl,
    sla,
    sra,
    sin,
    cos,
    tan,
    asin,
    acos,
    atan,
    atan2,
    and,
    or,
    xor,
    nor,
};
export default arithmetic;
