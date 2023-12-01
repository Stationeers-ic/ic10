import {CommandBuilder} from "./core";
import {Ic10DiagnosticError, keywordErrorMsg} from "../Ic10Error";
import {isKeyword, isKeywordNoConst} from "../icTypes";

export const makeArithmeticCommands: CommandBuilder = scope => {
    function op<Args extends number[]>(op: (...args: Args) => number, register: string, ...args: { [K in keyof Args]: string }) {
        const r = scope.memory.getRegister(register)

        const inputs = args.map(v => scope.memory.getValue(v)) as Args

        r.value = op(...inputs)
    }

    /*
    * @alias@
    * [en] Specify an alias for a register or data channel
    * [ru] Задат псевдоним для регистра или канала данных
    */
    const alias = (alias: string, target: string) => {
        if (isKeyword(alias)) {
            throw new Ic10DiagnosticError(keywordErrorMsg('alias'), alias)
        }
        scope.memory.alias(alias, target)
    }

    /*
    * @move@
    * [en] Value assignment
    * [ru] Присвоение значения
    */
    const move = (register: string, value: string) => {
        if (isKeyword(register))
            throw new Ic10DiagnosticError(keywordErrorMsg('register'), register)

        if (isKeywordNoConst(value)) {
            throw new Ic10DiagnosticError(keywordErrorMsg('value'), value)
        }
        op(v => v, register, value)
    }

    /*
    * @define@
    * [en] Set a name for the constant
    * [ru] Задать имя для константы
    */
    const define = (alias: string, value: number | string) => {
        if (isKeyword(alias)) {
            throw new Ic10DiagnosticError(keywordErrorMsg('constant'), alias)
        }
        scope.memory.define(alias, value)
    }

    /*
    * @select@
    * [en] Ternary select. If op2 is true then op1 := op3, otherwise op1 := op4
    * [ru] Тернарный select. Если op2 истинно, то op1 := op3, иначе op1 := op4
    */
    const select = (register: string, a: string, b: string, c: string) =>
        op((a, b, c) => a ? b : c, register, a, b, c)

    /*
    * @add@
    * [en] Sum
    * [ru] Сумма
    */
    const add = (register: string, a: string, b: string) =>
        op((a, b) => a + b, register, a, b)

    /*
    * @sub@
    * [en] Difference
    * [ru] Разность
    */
    const sub =(register: string, a: string, b: string) =>
        op((a, b) => a - b, register, a, b)

    /*
    * @mul@
    * [en] Work
    * [ru] Произведение
    */
    const mul = (register: string, a: string, b: string) =>
        op((a, b) => a * b, register, a, b)

    /*
    * @div@
    * [en] Division
    * [ru] Деление
    */
    const div = (register: string, a: string, b: string) =>
        op((a, b) => Number(a / b) || 0, register, a, b)

    /*
    * @mod@
    * [en] Remainder of integer division of op2 by op3 (the result is not equivalent to the % operator, and will be positive for any signs of op2 and op3)
    * [ru] Остаток от целочисленного деления op2 на op3 (результат не эквивалентен оператору %, и будет положителен при любых знаках op2 и op3)
    */
    const mod = (register: string, a: string, b: string) =>
        op((a, b) => a % b, register, a, b)

    /*
    * @sqrt@
    * [en] Square root
    * [ru] Квадратный корень
    */
    const sqrt = (register: string, v: string) =>
        op(Math.sqrt, register, v)

    /*
    * @round@
    * [en] Rounding to nearest integer
    * [ru] Округление к ближайшему целому
    */
    const round = (register: string, v: string) =>
        op(Math.round, register, v)

    /*
    * @trunc@
    * [en] The integer part of number
    * [ru] Целая часть числа
    */
    const trunc = (register: string, v: string) =>
        op(Math.trunc, register, v)

    /*
    * @ceil@
    * [en] Round up to nearest integer
    * [ru] Округление до ближайшего целого вверх
    */
    const ceil = (register: string, v: string) =>
        op(Math.ceil, register, v)

    /*
    * @floor@
    * [en] Rounding down to nearest integer
    * [ru] Округление до ближайшего целого вниз
    */
    const floor = (register: string, v: string) =>
        op(Math.floor, register, v)

    /*
    * @max@
    * [en] Maximum of two
    * [ru] Максимальное из двух
    */
    const max = (register: string, a: string, b: string) =>
        op(Math.max, register, a, b)

    /*
    * @min@
    */
    const min = (register: string, a: string, b: string) =>
        op(Math.min, register, a, b)

    /*
    * @abs@
    * [en] The absolute value of the number
    * [ru] Абсолютная величина числа
    */
    const abs = (register: string, v: string) =>
        op(Math.abs, register, v)

    /*
    * @log@
    * [en] natural logarithm
    * [ru] Натуральный логарифм
    */
    const log = (register: string, v: string) =>
        op(Math.log, register, v)

    /*
    * @exp@
    * [en] Exhibitor
    * [ru] Экспонента
    */
    const exp = (register: string, v: string) =>
        op(Math.exp, register, v)

    /*
    * @rand@
    * [en] Random value from 0 to 1 inclusive
    * [ru] Случайная величина от 0 до 1 включительно
    */
    const rand = (register: string, v: string) =>
        op(_ => Math.random(), register, v)

    /*
    * @sll@
    */
    const sll = (register: string, a: string, b: string) =>
        op((a, b) => (a << b), register, a, b)

    /*
    * @srl@
    */
    const srl = (register: string, a: string, b: string) =>
        op((a, b) => (a >>> b), register, a, b)

    /*
    * @sla@
    */
    const sla = (register: string, a: string, b: string) =>
        op((a, b) => (a << b) + Number(a < 0) * ((2 << b) -1), register, a, b)

    /*
    * @sra@
    */
    const sra = (register: string, a: string, b: string) =>
        op((a, b) => (a >> b), register, a, b)

    /*
    * @sin@
    * [en] Sinus*
    * [ru] Синус*
    */
    const sin = (register: string, v: string) =>
        op(Math.sin, register, v)

    /*
    * @cos@
    * [en] Cosine*
    * [ru] Косинус*
    */
    const cos = (register: string, v: string) =>
        op(Math.cos, register, v)

    /*
    * @tan@
    * [en] Tangent*
    * [ru] Тангенс*
    */
    const tan = (register: string, v: string) =>
        op(Math.tan, register, v)

    /*
    * @asin@
    * [en] Arcsine*
    * [ru] Арксинус*
    */
    const asin = (register: string, v: string) =>
        op(Math.asin, register, v)

    /*
    * @acos@
    * [en] Arccosine*
    * [ru] Арккосинус*
    */
    const acos = (register: string, v: string) =>
        op(Math.acos, register, v)

    /*
    * @atan@
    * [en] Arctangent*
    * [ru] Арктангенс*
    */
    const atan = (register: string, v: string) =>
        op(Math.atan, register, v)

    /*
    * @atan2@
    * [en] Arc tangent with 2 arguments
    * [ru] Арктангенс с 2 аргументами
    */
    const atan2 = (register: string, a: string, b: string) =>
        op(Math.atan2, register, a, b)


    /*
    * @and@
    * [en] Logical AND, one if both op2 and op3 are true, zero otherwise
    * [ru] Логическое И, единица, если и op2 и op3 истинны, ноль в противном случае
    */
    const and = (register: string, a: string, b: string) =>
        op((a, b) => a & b, register, a, b)

    /*
    * @or@
    * [en] Logical OR, zero if both op2 and op3 are false, one otherwise
    * [ru] Логическое ИЛИ, ноль, если и op2 и op3 ложны, единица в противном случае
    */
    const or = (register: string, a: string, b: string) =>
        op((a, b) => a | b, register, a, b)

    /*
    * @xor@
    * [en] XOR, one if one and only one of op2 and op3 is true, zero otherwise
    * [ru] Исключающее ИЛИ, единица, если одно и только одно из op2 и op3 истинно, ноль в противном случае
    */
    const xor = (register: string, a: string, b: string) =>
        op((a, b) => a ^ b, register, a, b)

    /*
    * @nor@
    * [en] Inverse OR, one if both op2 and op3 are false, zero otherwise
    * [ru] Инверсное ИЛИ, единица, если и op2 и op3 ложны, ноль в противном случае
    */
    const nor = (register: string, a: string, b: string) =>
        op((a, b) => ~(a | b), register, a, b)

    return {
        alias, move, define, select,
        add, sub, mul, div, mod, sqrt,
        round, trunc, ceil, floor, max, min, abs, log, exp,
        rand,
        sll, srl, sla, sra,
        sin, cos, tan, asin, acos, atan, atan2,
        and, or, xor, nor
    }
}
