import EventEmitter from "eventemitter3";
import {Register} from "../ZodTypes";

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
        if (string.startsWith("dr") && string.length <= 4) {
            const register = Register.parse(string.slice(1));
            return `d${this.get(register)}`;
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
