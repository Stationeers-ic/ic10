import { Environment } from "./abstract/Environment";
import { getProperty, hasProperty, setProperty } from "dot-prop";
import { z } from "zod";
import { NotReservedWord, NumberOrNan, StringOrNumberOrNaN } from "./ZodTypes";
import SyntaxError from "./errors/SyntaxError";
export class DevEnv extends Environment {
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
    data = {};
    stack = new Array(512);
    aliases = new Map();
    pathValidate(path) {
        return true;
    }
    get(name) {
        if (typeof name === "number")
            return name;
        let x = parseFloat(name);
        if (!isNaN(x))
            return x;
        let y = this.dynamicDevicePort(name);
        if (y !== name) {
            return this.get(y);
        }
        if (this.aliases.has(name)) {
            return NumberOrNan.parse(this.get(StringOrNumberOrNaN.parse(this.aliases.get(name))));
        }
        this.pathValidate(name);
        return NumberOrNan.parse(getProperty(this.data, name) ?? 0);
    }
    set(name, value) {
        let y = this.dynamicDevicePort(name);
        if (y !== name) {
            return setProperty(this.data, y, value);
        }
        if (this.aliases.has(name)) {
            name = NotReservedWord.parse(this.aliases.get(name));
        }
        setProperty(this.data, name, value);
    }
    alias(name, value) {
        name = NotReservedWord.parse(name);
        value = StringOrNumberOrNaN.parse(value);
        this.aliases.set(name, value);
    }
    jump(line) {
        const oldLine = this.line;
        if (typeof line === "number") {
            this.line = line;
        }
        else {
            this.line = this.get(line);
        }
        if (oldLine === this.line) {
            this.throw(new SyntaxError(`Jump to the same line ${this.line} is not allowed`, "error", this.line));
        }
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
    }
    getAlias(alias) {
        if (this.aliases.has(alias))
            return z.string().parse(this.aliases.get(alias));
        return alias;
    }
    hasDevice(name) {
        return hasProperty(this.data, this.getAlias(name));
    }
    getDeviceByHash(hash) {
        return [];
    }
    getDeviceByHashAndName(hash, name) {
        return [];
    }
    hcf() {
        console.log("Died");
        this.jump(this.lines.length);
    }
}
export default DevEnv;
