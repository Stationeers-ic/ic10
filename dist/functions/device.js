import { z } from "zod";
import { DeviceOrAlias, Hash, Logic, Mode, Ralias, RaliasOrValue, SlotIndex, } from "../ZodTypes";
import SyntaxError from "../errors/SyntaxError";
const s = (env, data) => {
    const [op1, op2, op3] = z.tuple([DeviceOrAlias, Logic, RaliasOrValue]).parse(data);
    if (!env.hasDevice(env.getAlias(op1))) {
        throw new SyntaxError(`Device ${env.getAlias(op1)} not found`, "error", env.getPosition());
    }
    env.set(`${env.getAlias(op1)}.${env.getAlias(op2)}`, env.get(op3));
};
const l = (env, data) => {
    const [op1, op2, op3] = z.tuple([Ralias, DeviceOrAlias, Logic]).parse(data);
    if (!env.hasDevice(env.getAlias(op2))) {
        throw new SyntaxError(`Device ${env.getAlias(op2)} not found`, "error", env.getPosition());
    }
    env.set(op1, env.get(`${env.getAlias(op2)}.${env.getAlias(op3)}`));
};
const ls = (env, data) => {
    const [register, device, slot, property] = z.tuple([Ralias, DeviceOrAlias, SlotIndex, Logic]).parse(data);
    env.set(register, env.get(`${device}.Slots.${slot}.${property}`));
};
const sb = (env, data) => {
    const [hash, logic, register] = z.tuple([Hash, Logic, Ralias]).parse(data);
    env.setDeviceByHash(env.get(hash), logic, env.get(register));
};
const sbn = (env, data) => {
    const [hash, name, logic, register] = z.tuple([Hash, Hash, Logic, RaliasOrValue]).parse(data);
    env.setDeviceByHashAndName(env.get(hash), env.get(name), logic, env.get(register));
};
const sbs = (env, data) => {
    const [hash, slot, logic, value] = z
        .tuple([Hash, RaliasOrValue, Logic, RaliasOrValue])
        .parse(data);
    env.setSlotDeviceByHash(env.get(hash), env.get(slot), logic, env.get(value));
};
const lb = (env, data) => {
    const [register, hash, logic, mode] = z.tuple([Ralias, Hash, Logic, Ralias]).parse(data);
    const values = env.getDeviceByHash(env.get(hash), logic);
    switch (env.get(mode)) {
        case 0:
            env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length);
            break;
        case 1:
            env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0));
            break;
        case 2:
            env.set(register, Math.min(...values));
            break;
        case 3:
            env.set(register, Math.max(...values));
            break;
    }
};
const lbn = (env, data) => {
    const [register, hash, name, logic, mode] = z.tuple([Ralias, Hash, Hash, Logic, Ralias]).parse(data);
    const values = env.getDeviceByHashAndName(env.get(hash), env.get(name), logic);
    switch (env.get(mode)) {
        case 0:
            env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length);
            break;
        case 1:
            env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0));
            break;
        case 2:
            env.set(register, Math.min(...values));
            break;
        case 3:
            env.set(register, Math.max(...values));
            break;
    }
};
const lbs = (env, data) => {
    const [register, hash, slot, logic, mode] = z
        .tuple([Ralias, Hash, RaliasOrValue, Logic, Mode])
        .parse(data);
    const values = env.getSlotDeviceByHash(env.get(hash), env.get(slot), logic);
    switch (env.get(mode)) {
        case 0:
            env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length);
            break;
        case 1:
            env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0));
            break;
        case 2:
            env.set(register, Math.min(...values));
            break;
        case 3:
            env.set(register, Math.max(...values));
            break;
    }
};
const lbns = (env, data) => {
    const [register, hash, name, slot, logic, mode] = z
        .tuple([Ralias, Hash, RaliasOrValue, RaliasOrValue, Logic, Mode])
        .parse(data);
    const values = env.getSlotDeviceByHashAndName(env.get(hash), env.get(name), env.get(slot), logic);
    switch (env.get(mode)) {
        case 0:
            env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0) / values.length);
            break;
        case 1:
            env.set(register, values.reduce((partial_sum, a) => partial_sum + a, 0));
            break;
        case 2:
            env.set(register, Math.min(...values));
            break;
        case 3:
            env.set(register, Math.max(...values));
            break;
    }
};
const lr = (env, data) => {
    const [register, device, reagentMode, hash] = z.tuple([Ralias, DeviceOrAlias, RaliasOrValue, Hash]).parse(data);
    env.set(register, env.get(`${device}.Reagents.${reagentMode}.${hash}`));
};
const ss = (env, data) => {
    const [device, slot, property, value] = z.tuple([DeviceOrAlias, SlotIndex, Logic, RaliasOrValue]).parse(data);
    env.set(`${device}.Slots.${slot}.${property}`, env.get(value));
};
const device = {
    l,
    lb,
    lbn,
    lbns,
    lbs,
    lr,
    ls,
    s,
    sb,
    sbn,
    sbs,
    ss,
};
export default device;
