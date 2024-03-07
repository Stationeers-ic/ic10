import EventEmitter from "eventemitter3";
import { dynamicDevice, dynamicDeviceGroups, dynamicRegister, dynamicRegisterGroups } from "../regexps";
export class Environment extends EventEmitter {
    isTest = false;
    InfiniteLoopLimit = 500;
    errors = [];
    errorCounter = 0;
    getCurrentLine() {
        return this.getLine(this.getPosition());
    }
    throw(err) {
        err.lineStart = err.lineStart ?? this.getPosition();
        this.errors.push(err);
        if (err.level === "error")
            this.errorCounter++;
        this.emit(err.level, err);
    }
    async beforeLineRun(line) {
    }
    async afterLineRun(line) {
    }
    dynamicDevicePort(string) {
        if (dynamicDevice.test(string)) {
            const { rr } = dynamicDeviceGroups.parse(dynamicDevice.exec(string)?.groups);
            const r = this.dynamicRegister(rr);
            return `d${this.get(r)}`;
        }
        return string;
    }
    dynamicRegister(string) {
        if (dynamicRegister.test(string)) {
            const { first, rr } = dynamicRegisterGroups.parse(dynamicRegister.exec(string)?.groups);
            let next = this.get(first);
            for (let i = 1; i < rr.length; i++) {
                next = this.get(`r${next}`);
            }
            return `r${next}`;
        }
        return string;
    }
    on(event, fn) {
        return super.on(event, fn, this);
    }
    addListener(event, fn) {
        return super.addListener(event, fn, this);
    }
    once(event, fn) {
        return super.once(event, fn, this);
    }
    removeListener(event, fn) {
        return super.removeListener(event, fn, this);
    }
}
export default Environment;
