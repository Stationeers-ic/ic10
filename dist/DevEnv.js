import Environment from"./abstract/Environment";
import { getProperty, setProperty } from "dot-prop";
import { z } from "zod";
import { NotReservedWord, NumberOrNan, StringOrNumberOrNaN } from "./ZodTypes";
import SyntaxError from "./errors/SyntaxError";
import { v4 as uuid } from "uuid";
const ZodDevice = z.union([
    z.record(z.number()),
    z.record(z.record(z.number())),
    z.record(z.record(z.record(z.number())))
]);
export class DevEnv extends Environment {
    line = 0;
    lines = [];
    devices = new Map();
    devicesAttached = new Map();
    data = {};
    stack = new Array(512);
    aliases = new Map();
    constructor(data = {}) {
        super();
        this.aliases.set("sp", "r16");
        this.aliases.set("ra", "r17");
        this.aliases.set("NaN", NaN);
        this.aliases.set("Average", 0);
        this.aliases.set("Sum", 1);
        this.aliases.set("Minimum", 2);
        this.aliases.set("Maximum", 3);
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
    }
    addLine(line) {
        this.lines.push(line);
        return this;
    }
    setLine(index, line) {
        this.lines[index] = line;
        return this;
    }
    getLine(index) {
        return this.lines[index];
    }
    getPosition() {
        return this.line;
    }
    addPosition(modify) {
        this.line += modify;
        return this;
    }
    setPosition(index) {
        this.line = index;
        return this;
    }
    appendDevice(hash, name) {
        const id = uuid();
        const device = {
            PrefabHash: hash,
        };
        if (name) {
            device.Name = name;
        }
        this.devices.set(id, device);
        return id;
    }
    removeDevice(id) {
        const d = this.devices.get(id);
        if (d) {
            this.devices.delete(id);
        }
        return this;
    }
    attachDevice(id, port) {
        this.devicesAttached.set(port, id);
        this.devicesAttached.set(id, port);
        return this;
    }
    detachDevice(id) {
        const port = this.devicesAttached.get(id);
        if (port) {
            this.devicesAttached.delete(port);
        }
        this.devicesAttached.delete(id);
        return this;
    }
    get(name) {
        if (typeof name === "number")
            return name;
        let x = parseFloat(name);
        if (!isNaN(x))
            return x;
        if (this.aliases.has(name)) {
            return NumberOrNan.parse(this.get(StringOrNumberOrNaN.parse(this.aliases.get(name))));
        }
        if (/^d\d+/.test(name)) {
            const [port, a, b, c, d] = name.split(".");
            const id = z.string().parse(this.devicesAttached.get(port));
            const device = this.devices.get(id);
            return NumberOrNan.parse(getProperty(device, [a, b, c, d].filter((i) => i !== undefined).join(".")));
        }
        name = this.dynamicRegister(name);
        name = this.dynamicDevicePort(name);
        return NumberOrNan.parse(getProperty(this.data, name) ?? 0);
    }
    set(name, value) {
        if (this.aliases.has(name)) {
            name = NotReservedWord.parse(this.aliases.get(name));
        }
        if (/^d\d+/.test(name)) {
            const [port, a, b, c, d] = z.tuple([z.string(), z.string().optional(), z.string().optional(), z.string().optional(), z.string().optional()]).parse(name.split("."));
            const id = z.string().parse(this.devicesAttached.get(port));
            const device = this.devices.get(id);
            if (device === undefined) {
                throw new SyntaxError(`Device ${id} not found`, "error", this.line);
            }
            setProperty(device, [a, b, c, d].filter((i) => i !== undefined).join("."), value);
            return this;
        }
        name = this.dynamicRegister(name);
        name = this.dynamicDevicePort(name);
        setProperty(this.data, name, value);
        return this;
    }
    alias(name, value) {
        name = NotReservedWord.parse(name);
        value = StringOrNumberOrNaN.parse(value);
        this.aliases.set(name, value);
        return this;
    }
    jump(line) {
        const oldLine = this.line;
        if (typeof line === "number") {
            this.setPosition(line);
        }
        else {
            this.setPosition(this.get(line));
        }
        if (oldLine === this.line) {
            this.throw(new SyntaxError(`Jump to the same line ${this.line} is not allowed`, "error", this.line));
        }
        return this;
    }
    peek() {
        let sp = z.number().min(0).max(512).parse(this.get("sp"));
        const val = this.stack[sp - 1];
        return z.number().parse(val);
    }
    pop() {
        let sp = z.number().min(0).max(512).parse(this.get("sp"));
        const val = this.stack[--sp];
        this.set("sp", sp);
        return z.number().parse(val);
    }
    push(name) {
        let sp = z.number().min(0).max(512).parse(this.get("sp"));
        this.stack[sp++] = this.get(name);
        this.set("sp", sp);
        return this;
    }
    getAlias(alias) {
        if (this.aliases.has(alias))
            return z.string().parse(this.aliases.get(alias));
        return alias;
    }
    hasDevice(port) {
        return this.devicesAttached.has(port);
    }
    hcf() {
        console.log("Died");
        this.jump(this.getLines().length);
        return this;
    }
    getLines() {
        return this.lines;
    }
    getDeviceByHash(hash, logic) {
        const output = Array.from(this.devices).filter(([, device]) => {
            return device.PrefabHash === hash;
        }).map(([, device]) => device?.[logic]).filter((i) => typeof i === "number");
        return z.array(z.number()).parse(output);
    }
    getDeviceByHashAndName(hash, name, logic) {
        const output = Array.from(this.devices).filter(([, device]) => {
            return device.PrefabHash === hash && device.Name === name;
        }).map(([, device]) => device?.[logic]).filter((i) => typeof i === "number");
        return z.array(z.number()).parse(output);
    }
    getSlotDeviceByHash(hash, slot, logic) {
        const output = Array.from(this.devices).filter(([, device]) => {
            return device.PrefabHash === hash;
        }).map(([, device]) => device?.Slots?.[slot]?.[logic]).filter((i) => typeof i === "number");
        return z.array(z.number()).parse(output);
    }
    getSlotDeviceByHashAndName(hash, name, slot, logic) {
        const output = Array.from(this.devices).filter(([, device]) => {
            return device.PrefabHash === hash && device.Name === name;
        }).map(([, device]) => device?.Slots?.[slot]?.[logic]).filter((i) => typeof i === "number");
        return z.array(z.number()).parse(output);
    }
    setDeviceByHash(hash, logic, value) {
        const devices = Array.from(this.devices).filter(([, device]) => {
            return device.PrefabHash === hash;
        });
        return this;
    }
    setDeviceByHashAndName(hash, name, logic, value) {
        const devices = Array.from(this.devices).filter(([, device]) => {
            return device.PrefabHash === hash && device.Name === name;
        });
        return this;
    }
    setSlotDeviceByHash(hash, slot, logic, value) {
        const devices = Array.from(this.devices).filter(([, device]) => {
            return device.PrefabHash === hash;
        });
        return this;
    }
}
export default DevEnv;
