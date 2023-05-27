"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const MemoryCell_1 = require("./MemoryCell");
const DeviceProperties_1 = require("./DeviceProperties");
const main_1 = require("./main");
class Device extends MemoryCell_1.MemoryCell {
    number;
    hash;
    properties;
    #scope;
    constructor(scope, name, number) {
        super(scope, name);
        this.#scope = scope;
        this.hash = 100000000;
        this.#scope = scope;
        this.number = number;
        this.properties = new DeviceProperties_1.DeviceProperties(scope);
    }
    get scope() {
        return this.#scope;
    }
    get(variable) {
        if (!variable) {
            return this;
        }
        if (variable == 'hash') {
            return this.hash;
        }
        if (variable in this.properties) {
            return this.properties.get(variable);
        }
        else {
            throw main_1.Execution.error(this.#scope.position, 'Unknown variable', variable);
        }
    }
    set(variable, value) {
        if (variable in this.properties) {
            this.properties.set(variable, value);
        }
        else {
            throw main_1.Execution.error(this.#scope.position, 'Unknown variable', variable);
        }
        return this;
    }
    getSlot(op1, op2 = null) {
        if (typeof op1 === "number")
            op1 = String(op1);
        if (op1 in this.properties.slots) {
            const index = parseInt(op1);
            if (op2) {
                return this.properties.slots[index]?.get(op2);
            }
            else {
                return this.properties.slots[index];
            }
        }
        else {
            throw main_1.Execution.error(this.#scope.position, 'Unknown Slot', op1);
        }
    }
    setSlot(op1, op2, value) {
        if (op1 in this.properties.slots) {
            const index = parseInt(op1);
            if (op2) {
                return this.properties.slots[index].set(op2, value);
            }
            else {
                throw main_1.Execution.error(this.#scope.position, 'Unknown Slot', op1);
            }
        }
    }
}
exports.Device = Device;
//# sourceMappingURL=Device.js.map