import EventEmitter from "eventemitter3";
import { Register } from "../ZodTypes";
/*
 * Окружение для интерпретатора
 * Хранит все данные необходимые для интерпретации
 */
export class Environment extends EventEmitter {
    /*
     * Тестовый режим
     */
    isTest = false;
    /*
     * Текущая строка
     */
    line = 0;
    /*
     * Все строки текущего выполнения
     */
    lines = [];
    InfiniteLoopLimit = 500;
    errors = [];
    errorCounter = 0;
    getLine(index) {
        return this.lines[index];
    }
    getCurrentLine() {
        return this.lines[this.line];
    }
    throw(err) {
        err.lineStart = err.lineStart ?? this.line;
        this.errors.push(err);
        if (err.level === "error")
            this.errorCounter++;
        this.emit(err.level, err);
    }
    async afterLineRun(line) { }
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
