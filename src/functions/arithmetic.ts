import {icFunction} from "../types";
import {z} from "zod";
//import {CommandBuilder} from "./core";
// import {Ic10DiagnosticError, keywordErrorMsg} from "../Ic10Error";
// import {isKeyword, isKeywordNoConst} from "../icTypes";
// import {hash2Int, isHash} from "../Utils";
//
// export const makeArithmeticCommands: CommandBuilder = scope => {
//     function op<Args extends number[]>(op: (...args: Args) => number, register: string, ...args: { [K in keyof Args]: string }) {
//         const r = scope.memory.getRegister(register)
//
//         const inputs = args.map(v => scope.memory.getValue(v)) as Args
//
//         r.value = op(...inputs)
//     }
//
//     /*
//     * @alias@
//     * [en] Specify an alias for a register or data channel
//     * [ru] Задат псевдоним для регистра или канала данных
//     */
//     const alias = (alias: string, target: string) => {
//         if (isKeyword(alias)) {
//             throw new Ic10DiagnosticError(keywordErrorMsg('alias'), alias)
//         }
//         scope.memory.alias(alias, target)
//     }
//
//     /*
//     * @move@
//     * [en] Value assignment
//     * [ru] Присвоение значения
//     */
//     const move = (register: string, value: string) => {
//         if (isKeyword(register))
//             throw new Ic10DiagnosticError(keywordErrorMsg('register'), register)
//
//         if (isKeywordNoConst(value)) {
//             throw new Ic10DiagnosticError(keywordErrorMsg('value'), value)
//         }
//         op(v => v, register, value)
//     }
//
//     /*
//     * @define@
//     * [en] Set a name for the constant
//     * [ru] Задать имя для константы
//     */
//     const define = (alias: string, value: number | string) => {
//         if (isKeyword(alias)) {
//             throw new Ic10DiagnosticError(keywordErrorMsg('constant'), alias)
//         }
//         if(typeof value === "string" && isHash(value)){
//             value = hash2Int(value)
//         }
//         scope.memory.define(alias, value)
//     }
//
//     /*
//     * @select@
//     * [en] Ternary select. If op2 is true then op1 := op3, otherwise op1 := op4
//     * [ru] Тернарный select. Если op2 истинно, то op1 := op3, иначе op1 := op4
//     */
//     const select = (register: string, a: string, b: string, c: string) =>
//         op((a, b, c) => a ? b : c, register, a, b, c)
//
//     /*
//     * @add@
//     * [en] Sum
//     * [ru] Сумма
//     */
//     const add = (register: string, a: string, b: string) =>
//         op((a, b) => a + b, register, a, b)
//
//     /*
//     * @sub@
//     * [en] Difference
//     * [ru] Разность
//     */
//     const sub =(register: string, a: string, b: string) =>
//         op((a, b) => a - b, register, a, b)
//
//     /*
//     * @mul@
//     * [en] Work
//     * [ru] Произведение
//     */
//     const mul = (register: string, a: string, b: string) =>
//         op((a, b) => a * b, register, a, b)
//
//     /*
//     * @div@
//     * [en] Division
//     * [ru] Деление
//     */
//     const div = (register: string, a: string, b: string) =>
//         op((a, b) => Number(a / b) || 0, register, a, b)
//
//     /*
//     * @mod@
//     * [en] Remainder of integer division of op2 by op3 (the result is not equivalent to the % operator, and will be positive for any signs of op2 and op3)
//     * [ru] Остаток от целочисленного деления op2 на op3 (результат не эквивалентен оператору %, и будет положителен при любых знаках op2 и op3)
//     */
//     const mod = (register: string, a: string, b: string) =>
//         op((a, b) => a % b, register, a, b)
//
//     /*
//     * @sqrt@
//     * [en] Square root
//     * [ru] Квадратный корень
//     */
//     const sqrt = (register: string, v: string) =>
//         op(Math.sqrt, register, v)
//
//     /*
//     * @round@
//     * [en] Rounding to nearest integer
//     * [ru] Округление к ближайшему целому
//     */
//     const round = (register: string, v: string) =>
//         op(Math.round, register, v)
//
//     /*
//     * @trunc@
//     * [en] The integer part of number
//     * [ru] Целая часть числа
//     */
//     const trunc = (register: string, v: string) =>
//         op(Math.trunc, register, v)
//
//     /*
//     * @ceil@
//     * [en] Round up to nearest integer
//     * [ru] Округление до ближайшего целого вверх
//     */
//     const ceil = (register: string, v: string) =>
//         op(Math.ceil, register, v)
//
//     /*
//     * @floor@
//     * [en] Rounding down to nearest integer
//     * [ru] Округление до ближайшего целого вниз
//     */
//     const floor = (register: string, v: string) =>
//         op(Math.floor, register, v)
//
//     /*
//     * @max@
//     * [en] Maximum of two
//     * [ru] Максимальное из двух
//     */
//     const max = (register: string, a: string, b: string) =>
//         op(Math.max, register, a, b)
//
//     /*
//     * @min@
//     */
//     const min = (register: string, a: string, b: string) =>
//         op(Math.min, register, a, b)
//
//     /*
//     * @abs@
//     * [en] The absolute value of the number
//     * [ru] Абсолютная величина числа
//     */
//     const abs = (register: string, v: string) =>
//         op(Math.abs, register, v)
//
//     /*
//     * @log@
//     * [en] natural logarithm
//     * [ru] Натуральный логарифм
//     */
//     const log = (register: string, v: string) =>
//         op(Math.log, register, v)
//
//     /*
//     * @exp@
//     * [en] Exhibitor
//     * [ru] Экспонента
//     */
//     const exp = (register: string, v: string) =>
//         op(Math.exp, register, v)
//
//     /*
//     * @rand@
//     * [en] Random value from 0 to 1 inclusive
//     * [ru] Случайная величина от 0 до 1 включительно
//     */
//     const rand = (register: string, v: string) =>
//         op(_ => Math.random(), register, v)
//
//     /*
//     * @sll@
//     */
//     const sll = (register: string, a: string, b: string) =>
//         op((a, b) => (a << b), register, a, b)
//
//     /*
//     * @srl@
//     */
//     const srl = (register: string, a: string, b: string) =>
//         op((a, b) => (a >>> b), register, a, b)
//
//     /*
//     * @sla@
//     */
//     const sla = (register: string, a: string, b: string) =>
//         op((a, b) => (a << b) + Number(a < 0) * ((2 << b) -1), register, a, b)
//
//     /*
//     * @sra@
//     */
//     const sra = (register: string, a: string, b: string) =>
//         op((a, b) => (a >> b), register, a, b)
//
//     /*
//     * @sin@
//     * [en] Sinus*
//     * [ru] Синус*
//     */
//     const sin = (register: string, v: string) =>
//         op(Math.sin, register, v)
//
//     /*
//     * @cos@
//     * [en] Cosine*
//     * [ru] Косинус*
//     */
//     const cos = (register: string, v: string) =>
//         op(Math.cos, register, v)
//
//     /*
//     * @tan@
//     * [en] Tangent*
//     * [ru] Тангенс*
//     */
//     const tan = (register: string, v: string) =>
//         op(Math.tan, register, v)
//
//     /*
//     * @asin@
//     * [en] Arcsine*
//     * [ru] Арксинус*
//     */
//     const asin = (register: string, v: string) =>
//         op(Math.asin, register, v)
//
//     /*
//     * @acos@
//     * [en] Arccosine*
//     * [ru] Арккосинус*
//     */
//     const acos = (register: string, v: string) =>
//         op(Math.acos, register, v)
//
//     /*
//     * @atan@
//     * [en] Arctangent*
//     * [ru] Арктангенс*
//     */
//     const atan = (register: string, v: string) =>
//         op(Math.atan, register, v)
//
//     /*
//     * @atan2@
//     * [en] Arc tangent with 2 arguments
//     * [ru] Арктангенс с 2 аргументами
//     */
//     const atan2 = (register: string, a: string, b: string) =>
//         op(Math.atan2, register, a, b)
//
//
//     /*
//     * @and@
//     * [en] AND, Sets bits to 1 if the same bits in op2 and op3 are also 1
//     * [ru] И, Устанавливает биты в 1, если одни и те же биты в op2 и op3 также равны 1
//     */
//     const and = (register: string, a: string, b: string) =>
//         op((a, b) => a & b, register, a, b)
//
//     /*
//     * @or@
//     * [en] OR, Sets bits to 1 if the same bit is 1 in op2 or op3
//     * [ru] ИЛИ. Устанавливает биты в 1, если тот же бит равен 1 в op2 или op3
//     */
//     const or = (register: string, a: string, b: string) =>
//         op((a, b) => a | b, register, a, b)
//
//     /*
//     * @xor@
//     * [en] Exclusive OR, Sets all bits to 1 which are different between op2 and op3
//     * [ru] Исключающее ИЛИ, устанавливает все биты в 1, которые различаются между op2 и op3
//     */
//     const xor = (register: string, a: string, b: string) =>
//         op((a, b) => a ^ b, register, a, b)
//
//     /*
//     * @nor@
//     * [en] Inverse OR, sets all bits to 1 that are 0 in op2 or op3 and all bits to 0 that are 1 in op2 or op3
//     * [ru] Инверсное ИЛИ, единица, устанавливает все биты в 1, которые равны 0 в op2 или op3, и все биты в 0, которые равны 1 в op2 или op3
//     */
//     const nor = (register: string, a: string, b: string) =>
//         op((a, b) => ~(a | b), register, a, b)
//
//     return {
//         alias, move, define, select,
//         add, sub, mul, div, mod, sqrt,
//         round, trunc, ceil, floor, max, min, abs, log, exp,
//         rand,
//         sll, srl, sla, sra,
//         sin, cos, tan, asin, acos, atan, atan2,
//         and, or, xor, nor
//     }
// }
export const arithmetic: { [key: string]: icFunction } = {
    add: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) + env.get(d[2]))
    },
    sub: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) - env.get(d[2]))
    },
    mul: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) * env.get(d[2]))
    },
    div: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) / env.get(d[2]))
    },
    mod: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) % env.get(d[2]))
    },
    sqrt: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.sqrt(env.get(d[1])))
    },
    round: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.round(env.get(d[1])))
    },
    trunc: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.trunc(env.get(d[1])))
    },
    ceil: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.ceil(env.get(d[1])))
    },
    floor: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.floor(env.get(d[1])))
    },
    max: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.max(env.get(d[1]), env.get(d[2])))
    },
    min: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.min(env.get(d[1]), env.get(d[2])))
    },
    abs: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.abs(env.get(d[1])))
    },
    log: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.log(env.get(d[1])))
    },
    exp: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.exp(env.get(d[1])))
    },
    rand: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.random())
    },
    sll: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) << env.get(d[2]))
    },
    srl: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) >>> env.get(d[2]))
    },
    sla: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], (env.get(d[1]) << env.get(d[2])) + Number(env.get(d[1]) < 0) * ((2 << env.get(d[2])) - 1))
    },
    sra: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) >> env.get(d[2]))
    },
    sin: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.sin(env.get(d[1])))
    },
    cos: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.cos(env.get(d[1])))
    },
    tan: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.tan(env.get(d[1])))
    },
    asin: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.asin(env.get(d[1])))
    },
    acos: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.acos(env.get(d[1])))
    },
    atan: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.atan(env.get(d[1])))
    },
    atan2: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], Math.atan2(env.get(d[1]), env.get(d[2])))
    },
    and: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) & env.get(d[2]))
    },
    or: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) | env.get(d[2]))
    },
    xor: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], env.get(d[1]) ^ env.get(d[2]))
    },
    nor: (env, data) => {
        const d = z.tuple([z.string(), z.string().or(z.number()), z.string().or(z.number())]).parse(data)
        env.set(d[0], ~(env.get(d[1]) | env.get(d[2])))
    },
}