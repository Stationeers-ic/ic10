import { z } from "zod";
import { conditions } from "./conditions";
import { DeviceOrAlias, LineIndex, Ralias, RaliasOrValue, RelativeLineIndex, StringOrNumberOrNaN } from "../ZodTypes";
const jValidate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex]);
const jrValidate = z.tuple([RaliasOrValue, RaliasOrValue, RelativeLineIndex]);
const jApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, LineIndex]);
const jrApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, RelativeLineIndex]);
const j = (env, data) => {
    const d = z.tuple([LineIndex]).parse(data);
    env.jump(env.get(d[0]));
};
const jr = (env, data) => {
    const d = z.tuple([RelativeLineIndex]).parse(data);
    env.jump(env.line + env.get(d[0]));
};
const jal = (env, data) => {
    const d = z.tuple([LineIndex]).parse(data);
    env.set("r17", env.line);
    env.jump(env.get(d[0]));
};
const beq = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.eq(env, [x, y]))
        j(env, [line]);
};
const beqz = (env, data) => {
    const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.eq(env, [x, 0]))
        j(env, [line]);
};
const bge = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.ge(env, [x, y]))
        j(env, [line]);
};
const bgez = (env, data) => {
    const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.ge(env, [x, 0]))
        j(env, [line]);
};
const bgt = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.gt(env, [x, y]))
        j(env, [line]);
};
const bgtz = (env, data) => {
    const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.gt(env, [x, 0]))
        j(env, [line]);
};
const ble = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.le(env, [x, y]))
        j(env, [line]);
};
const blez = (env, data) => {
    const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.le(env, [x, 0]))
        j(env, [line]);
};
const blt = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.lt(env, [x, y]))
        j(env, [line]);
};
const bltz = (env, data) => {
    const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.lt(env, [x, 0]))
        j(env, [line]);
};
const bne = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.ne(env, [x, y]))
        j(env, [line]);
};
const bnez = (env, data) => {
    const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.ne(env, [x, 0]))
        j(env, [line]);
};
const bap = (env, data) => {
    const [x, y, c, line] = jApValidate.parse(data);
    if (conditions.ap(env, [x, y, c]))
        j(env, [line]);
};
const bapz = (env, data) => {
    const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.ap(env, [x, y]))
        j(env, [line]);
};
const bna = (env, data) => {
    const [x, y, c, line] = jApValidate.parse(data);
    if (conditions.na(env, [x, y, c]))
        j(env, [line]);
};
const bnaz = (env, data) => {
    const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.na(env, [x, y, 0]))
        j(env, [line]);
};
const bdse = (env, data) => {
    const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data);
    if (conditions.dse(env, [d]))
        j(env, [line]);
};
const bdns = (env, data) => {
    const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data);
    if (conditions.dns(env, [d]))
        j(env, [line]);
};
const bnan = (env, data) => {
    const [v, line] = z.tuple([Ralias, LineIndex]).parse(data);
    if (conditions.nan(env, [v]))
        j(env, [line]);
};
const breq = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.eq(env, [a, b]))
        jr(env, [offset]);
};
const breqz = (env, data) => {
    const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.eq(env, [a, 0]))
        jr(env, [offset]);
};
const brge = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.ge(env, [a, b]))
        jr(env, [offset]);
};
const brgez = (env, data) => {
    const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.ge(env, [a, 0]))
        jr(env, [offset]);
};
const brgt = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.gt(env, [a, b]))
        jr(env, [offset]);
};
const brgtz = (env, data) => {
    const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.gt(env, [a, 0]))
        jr(env, [offset]);
};
const brle = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.le(env, [a, b]))
        jr(env, [offset]);
};
const brlez = (env, data) => {
    const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.le(env, [a, 0]))
        jr(env, [offset]);
};
const brlt = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.lt(env, [a, b]))
        jr(env, [offset]);
};
const brltz = (env, data) => {
    const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.lt(env, [a, 0]))
        jr(env, [offset]);
};
const brne = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.ne(env, [a, b]))
        jr(env, [offset]);
};
const brnez = (env, data) => {
    const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.ne(env, [a, 0]))
        jr(env, [offset]);
};
const brap = (env, data) => {
    const [x, y, c, offset] = jrApValidate.parse(data);
    if (conditions.ap(env, [x, y, c]))
        jr(env, [offset]);
};
const brapz = (env, data) => {
    const [x, y, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.ap(env, [x, y]))
        jr(env, [offset]);
};
const brna = (env, data) => {
    const [x, y, c, offset] = jrApValidate.parse(data);
    if (conditions.na(env, [x, y, c]))
        jr(env, [offset]);
};
const brnaz = (env, data) => {
    const [x, y, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.na(env, [x, y, 0]))
        jr(env, [offset]);
};
const brdse = (env, data) => {
    const [d, offset] = z.tuple([DeviceOrAlias, RelativeLineIndex]).parse(data);
    if (conditions.dse(env, [d]))
        jal(env, [offset]);
};
const brdns = (env, data) => {
    const [d, offset] = z.tuple([DeviceOrAlias, RelativeLineIndex]).parse(data);
    if (conditions.dns(env, [d]))
        jal(env, [offset]);
};
const brnan = (env, data) => {
    const [v, offset] = z.tuple([Ralias, RelativeLineIndex]).parse(data);
    if (conditions.nan(env, [v]))
        jr(env, [offset]);
};
const beqal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.eq(env, [a, b]))
        jal(env, [line]);
};
const beqzal = (env, data) => {
    const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.eq(env, [a, 0]))
        jal(env, [line]);
};
const bgeal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.ge(env, [a, b]))
        jal(env, [line]);
};
const bgezal = (env, data) => {
    const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.ge(env, [a, 0]))
        jal(env, [line]);
};
const bgtal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.gt(env, [a, b]))
        jal(env, [line]);
};
const bgtzal = (env, data) => {
    const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.gt(env, [a, 0]))
        jal(env, [line]);
};
const bleal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.le(env, [a, b]))
        jal(env, [line]);
};
const blezal = (env, data) => {
    const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.le(env, [a, 0]))
        jal(env, [line]);
};
const bltal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.lt(env, [a, b]))
        jal(env, [line]);
};
const bltzal = (env, data) => {
    const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.lt(env, [a, 0]))
        jal(env, [line]);
};
const bneal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.ne(env, [a, b]))
        jal(env, [line]);
};
const bnezal = (env, data) => {
    const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.ne(env, [a, 0]))
        jal(env, [line]);
};
const bapal = (env, data) => {
    const [x, y, c, line] = z
        .tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
        .parse(data);
    if (conditions.ap(env, [x, y, c]))
        jal(env, [line]);
};
const bapzal = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.ap(env, [x, y]))
        jal(env, [line]);
};
const bnaal = (env, data) => {
    const [x, y, c, line] = jApValidate.parse(data);
    if (conditions.na(env, [x, y, c]))
        jal(env, [line]);
};
const bnazal = (env, data) => {
    const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data);
    if (conditions.na(env, [x, y, 0]))
        jal(env, [line]);
};
const bdseal = (env, data) => {
    const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data);
    if (conditions.dse(env, [d]))
        jal(env, [line]);
};
const bdnsal = (env, data) => {
    const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data);
    if (conditions.dns(env, [d]))
        jal(env, [line]);
};
export const jump = {
    j,
    jr,
    jal,
    beq,
    beqz,
    bge,
    bgez,
    bgt,
    bgtz,
    ble,
    blez,
    blt,
    bltz,
    bne,
    bnez,
    bap,
    bapz,
    bna,
    bnaz,
    bdse,
    bdns,
    bnan,
    breq,
    breqz,
    brge,
    brgez,
    brgt,
    brgtz,
    brle,
    brlez,
    brlt,
    brltz,
    brne,
    brnez,
    brap,
    brapz,
    brna,
    brnaz,
    brdse,
    brdns,
    brnan,
    beqal,
    beqzal,
    bgeal,
    bgezal,
    bgtal,
    bgtzal,
    bleal,
    blezal,
    bltal,
    bltzal,
    bneal,
    bnezal,
    bapal,
    bapzal,
    bnaal,
    bnazal,
    bdseal,
    bdnsal,
};
