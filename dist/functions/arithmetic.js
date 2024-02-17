import { z } from "zod";
import { BitWarn } from "../errors/BitWarn";
import { Ralias, RaliasOrValue } from "../ZodTypes";
function jsThing(value) {
    if (Object.is(value, -0))
        return 0;
    if (Object.is(value, -Infinity))
        return Infinity;
    return value;
}
export const arithmetic = {};
arithmetic.add = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) + env.get(d[2])));
};
arithmetic.sub = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) - env.get(d[2])));
};
arithmetic.mul = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) * env.get(d[2])));
};
arithmetic.div = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) / env.get(d[2])));
};
arithmetic.mod = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) % env.get(d[2])));
};
arithmetic.sqrt = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.sqrt(env.get(d[1]))));
};
arithmetic.round = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.round(env.get(d[1]))));
};
arithmetic.trunc = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.trunc(env.get(d[1]))));
};
arithmetic.ceil = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.ceil(env.get(d[1]))));
};
arithmetic.floor = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.floor(env.get(d[1]))));
};
arithmetic.max = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.max(env.get(d[1]), env.get(d[2]))));
};
arithmetic.min = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.min(env.get(d[1]), env.get(d[2]))));
};
arithmetic.abs = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.abs(env.get(d[1]))));
};
arithmetic.log = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.log(env.get(d[1]))));
};
arithmetic.exp = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.exp(env.get(d[1]))));
};
arithmetic.rand = (env, data) => {
    const d = z.tuple([Ralias]).parse(data);
    env.set(d[0], jsThing(Math.random()));
};
arithmetic.sll = (env, data) => {
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
arithmetic.srl = (env, data) => {
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
arithmetic.sla = (env, data) => {
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
arithmetic.sra = (env, data) => {
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
arithmetic.sin = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.sin(env.get(d[1]))));
};
arithmetic.cos = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.cos(env.get(d[1]))));
};
arithmetic.tan = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.tan(env.get(d[1]))));
};
arithmetic.asin = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.asin(env.get(d[1]))));
};
arithmetic.acos = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.acos(env.get(d[1]))));
};
arithmetic.atan = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.atan(env.get(d[1]))));
};
arithmetic.atan2 = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(Math.atan2(env.get(d[1]), env.get(d[2]))));
};
arithmetic.and = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) & env.get(d[2])));
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
arithmetic.or = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) | env.get(d[2])));
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
arithmetic.xor = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(env.get(d[1]) ^ env.get(d[2])));
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
arithmetic.nor = (env, data) => {
    const d = z.tuple([Ralias, RaliasOrValue, RaliasOrValue]).parse(data);
    env.set(d[0], jsThing(~(env.get(d[1]) | env.get(d[2]))));
    env.throw(new BitWarn("JavaScript use 32bit number, But game use 64 BIT. Can cause problems with big numbers", "warn"));
};
