"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantCell = void 0;
const main_1 = require("./main");
const MemoryCell_1 = require("./MemoryCell");
class ConstantCell extends MemoryCell_1.MemoryCell {
    #scope;
    constructor(value, scope, name) {
        super(scope, name);
        this.#scope = scope;
        this.value = value;
    }
    get() {
        return this.value;
    }
    set(value, _ = null) {
        throw main_1.Execution.error(this.#scope.position, 'Can`t change constant');
    }
}
exports.ConstantCell = ConstantCell;
//# sourceMappingURL=ConstantCell.js.map