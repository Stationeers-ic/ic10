import {z} from "zod";
import {conditions} from "./conditions";
import {
	DeviceOrAlias,
	LineIndex,
	Ralias,
	RaliasOrValue,
	RelativeLineIndex,
	StringOrNumberOrNaN,
	Value,
} from "../ZodTypes";

const jValidate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex]);
const jrValidate = z.tuple([RaliasOrValue, RaliasOrValue, RelativeLineIndex]);
const jApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, LineIndex]);
const jrApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, RelativeLineIndex]);
const j = (env, data) => {
    const d = z.tuple([LineIndex]).parse(data);
    const line = Value.min(0).int().parse(env.get(d[0]));
    env.jump(line);
};
const jr = (env, data) => {
    const d = z.tuple([RelativeLineIndex]).parse(data);
    const line = Value.min(0)
        .int()
        .parse(env.getPosition() + env.get(d[0]));
    env.jump(line);
};
const jal = (env, data) => {
    const d = z.tuple([LineIndex]).parse(data);
    const line = Value.min(0).int().parse(env.get(d[0]));
    env.set("r17", env.getPosition());
    env.jump(line);
};
const beq = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.eq(env, [x, y]))
        j(env, [line]);
};
const bge = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.ge(env, [x, y]))
        j(env, [line]);
};
const bgt = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.gt(env, [x, y]))
        j(env, [line]);
};
const ble = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.le(env, [x, y]))
        j(env, [line]);
};
const blt = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.lt(env, [x, y]))
        j(env, [line]);
};
const bne = (env, data) => {
    const [x, y, line] = jValidate.parse(data);
    if (conditions.ne(env, [x, y]))
        j(env, [line]);
};
const bap = (env, data) => {
    const [x, y, c, line] = jApValidate.parse(data);
    if (conditions.ap(env, [x, y, c]))
        j(env, [line]);
};
const bna = (env, data) => {
    const [x, y, c, line] = jApValidate.parse(data);
    if (conditions.na(env, [x, y, c]))
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
const beqz = (env, data) => beq(env, [...data, 0]);
const bgez = (env, data) => bge(env, [...data, 0]);
const bgtz = (env, data) => bgt(env, [...data, 0]);
const blez = (env, data) => ble(env, [...data, 0]);
const bltz = (env, data) => blt(env, [...data, 0]);
const bnez = (env, data) => bne(env, [...data, 0]);
const bapz = (env, [x, y]) => bap(env, [x, 0, y]);
const bnaz = (env, [x, y]) => bna(env, [x, 0, y]);
const breq = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.eq(env, [a, b]))
        jr(env, [offset]);
};
const brge = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.ge(env, [a, b]))
        jr(env, [offset]);
};
const brgt = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.gt(env, [a, b]))
        jr(env, [offset]);
};
const brle = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.le(env, [a, b]))
        jr(env, [offset]);
};
const brlt = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.lt(env, [a, b]))
        jr(env, [offset]);
};
const brne = (env, data) => {
    const [a, b, offset] = jrValidate.parse(data);
    if (conditions.ne(env, [a, b]))
        jr(env, [offset]);
};
const brap = (env, data) => {
    const [x, y, c, offset] = jrApValidate.parse(data);
    if (conditions.ap(env, [x, y, c]))
        jr(env, [offset]);
};
const brna = (env, data) => {
    const [x, y, c, offset] = jrApValidate.parse(data);
    if (conditions.na(env, [x, y, c]))
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
const breqz = (env, data) => breq(env, [...data, 0]);
const brgez = (env, data) => brge(env, [...data, 0]);
const brgtz = (env, data) => brgt(env, [...data, 0]);
const brlez = (env, data) => brle(env, [...data, 0]);
const brltz = (env, data) => brlt(env, [...data, 0]);
const brnez = (env, data) => brne(env, [...data, 0]);
const brapz = (env, [x, y]) => bap(env, [x, 0, y]);
const brnaz = (env, [x, y]) => bna(env, [x, 0, y]);
const beqal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.eq(env, [a, b]))
        jal(env, [line]);
};
const bgeal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.ge(env, [a, b]))
        jal(env, [line]);
};
const bgtal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.gt(env, [a, b]))
        jal(env, [line]);
};
const bleal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.le(env, [a, b]))
        jal(env, [line]);
};
const bltal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.lt(env, [a, b]))
        jal(env, [line]);
};
const bneal = (env, data) => {
    const [a, b, line] = jValidate.parse(data);
    if (conditions.ne(env, [a, b]))
        jal(env, [line]);
};
const bapal = (env, data) => {
    const [x, y, c, line] = z
        .tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
        .parse(data);
    if (conditions.ap(env, [x, y, c]))
        jal(env, [line]);
};
const bnaal = (env, data) => {
    const [x, y, c, line] = jApValidate.parse(data);
    if (conditions.na(env, [x, y, c]))
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
const beqzal = (env, data) => beqzal(env, [...data, 0]);
const bgezal = (env, data) => bgezal(env, [...data, 0]);
const bgtzal = (env, data) => bgtzal(env, [...data, 0]);
const blezal = (env, data) => blezal(env, [...data, 0]);
const bltzal = (env, data) => bltzal(env, [...data, 0]);
const bnezal = (env, data) => bnezal(env, [...data, 0]);
const bapzal = (env, [x, y]) => bapzal(env, [x, 0, y]);
const bnazal = (env, [x, y]) => bnazal(env, [x, 0, y]);
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
export default jump;
