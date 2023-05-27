"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHash = exports.isStack = exports.isChip = exports.isPort = exports.isRegister = exports.isNumber = void 0;
const main_1 = require("./main");
function isNumber(value) {
    if (typeof value === 'number') {
        return false;
    }
    const regex = /^\d+$/gm;
    return typeof value === 'string' && regex.exec(value.trim()) !== null;
}
exports.isNumber = isNumber;
function isRegister(value) {
    if (isNumber(value)) {
        return false;
    }
    return main_1.regexes.r1.test(value) || main_1.regexes.rr1.test(value) || value === 'ra';
}
exports.isRegister = isRegister;
function isPort(value) {
    if (isNumber(value)) {
        return false;
    }
    return main_1.regexes.d1.test(value) || main_1.regexes.dr1.test(value);
}
exports.isPort = isPort;
function isChip(value) {
    return value === 'db';
}
exports.isChip = isChip;
function isStack(value) {
    return value === 'sp' || value === 'r16';
}
exports.isStack = isStack;
function isHash(value) {
    const r = /HASH\("(\w+)"\)/gm;
    const t = r.exec(value);
    return t !== null;
}
exports.isHash = isHash;
//# sourceMappingURL=types.js.map