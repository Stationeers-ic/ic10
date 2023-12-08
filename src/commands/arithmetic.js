"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeArithmeticCommands = void 0;
const Ic10Error_1 = require("../Ic10Error");
const icTypes_1 = require("../icTypes");
const Utils_1 = require("../Utils");
const makeArithmeticCommands = scope => {
    function op(op, register, ...args) {
        const r = scope.memory.getRegister(register);
        const inputs = args.map(v => scope.memory.getValue(v));
        r.value = op(...inputs);
    }
    const alias = (alias, target) => {
        if ((0, icTypes_1.isKeyword)(alias)) {
            throw new Ic10Error_1.Ic10DiagnosticError((0, Ic10Error_1.keywordErrorMsg)('alias'), alias);
        }
        scope.memory.alias(alias, target);
    };
    const move = (register, value) => {
        if ((0, icTypes_1.isKeyword)(register))
            throw new Ic10Error_1.Ic10DiagnosticError((0, Ic10Error_1.keywordErrorMsg)('register'), register);
        if ((0, icTypes_1.isKeywordNoConst)(value)) {
            throw new Ic10Error_1.Ic10DiagnosticError((0, Ic10Error_1.keywordErrorMsg)('value'), value);
        }
        op(v => v, register, value);
    };
    const define = (alias, value) => {
        if ((0, icTypes_1.isKeyword)(alias)) {
            throw new Ic10Error_1.Ic10DiagnosticError((0, Ic10Error_1.keywordErrorMsg)('constant'), alias);
        }
        if (typeof value === "string" && (0, Utils_1.isHash)(value)) {
            value = (0, Utils_1.hash2Int)(value);
        }
        scope.memory.define(alias, value);
    };
    const select = (register, a, b, c) => op((a, b, c) => a ? b : c, register, a, b, c);
    const add = (register, a, b) => op((a, b) => a + b, register, a, b);
    const sub = (register, a, b) => op((a, b) => a - b, register, a, b);
    const mul = (register, a, b) => op((a, b) => a * b, register, a, b);
    const div = (register, a, b) => op((a, b) => Number(a / b) || 0, register, a, b);
    const mod = (register, a, b) => op((a, b) => a % b, register, a, b);
    const sqrt = (register, v) => op(Math.sqrt, register, v);
    const round = (register, v) => op(Math.round, register, v);
    const trunc = (register, v) => op(Math.trunc, register, v);
    const ceil = (register, v) => op(Math.ceil, register, v);
    const floor = (register, v) => op(Math.floor, register, v);
    const max = (register, a, b) => op(Math.max, register, a, b);
    const min = (register, a, b) => op(Math.min, register, a, b);
    const abs = (register, v) => op(Math.abs, register, v);
    const log = (register, v) => op(Math.log, register, v);
    const exp = (register, v) => op(Math.exp, register, v);
    const rand = (register, v) => op(_ => Math.random(), register, v);
    const sll = (register, a, b) => op((a, b) => (a << b), register, a, b);
    const srl = (register, a, b) => op((a, b) => (a >>> b), register, a, b);
    const sla = (register, a, b) => op((a, b) => (a << b) + Number(a < 0) * ((2 << b) - 1), register, a, b);
    const sra = (register, a, b) => op((a, b) => (a >> b), register, a, b);
    const sin = (register, v) => op(Math.sin, register, v);
    const cos = (register, v) => op(Math.cos, register, v);
    const tan = (register, v) => op(Math.tan, register, v);
    const asin = (register, v) => op(Math.asin, register, v);
    const acos = (register, v) => op(Math.acos, register, v);
    const atan = (register, v) => op(Math.atan, register, v);
    const atan2 = (register, a, b) => op(Math.atan2, register, a, b);
    const and = (register, a, b) => op((a, b) => a & b, register, a, b);
    const or = (register, a, b) => op((a, b) => a | b, register, a, b);
    const xor = (register, a, b) => op((a, b) => a ^ b, register, a, b);
    const nor = (register, a, b) => op((a, b) => ~(a | b), register, a, b);
    return {
        alias, move, define, select,
        add, sub, mul, div, mod, sqrt,
        round, trunc, ceil, floor, max, min, abs, log, exp,
        rand,
        sll, srl, sla, sra,
        sin, cos, tan, asin, acos, atan, atan2,
        and, or, xor, nor
    };
};
exports.makeArithmeticCommands = makeArithmeticCommands;
//# sourceMappingURL=arithmetic.js.map