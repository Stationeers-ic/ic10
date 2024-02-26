import { icFunction } from "../functions"
import { z } from "zod"
import { conditions } from "./conditions"
import {
	DeviceOrAlias,
	LineIndex,
	Ralias,
	RaliasOrValue,
	RelativeLineIndex,
	StringOrNumberOrNaN,
	Value,
} from "../ZodTypes"

const jValidate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex])
const jrValidate = z.tuple([RaliasOrValue, RaliasOrValue, RelativeLineIndex])
const jApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, LineIndex])
const jrApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, RelativeLineIndex])

const j: icFunction = (env, data) => {
	const d = z.tuple([LineIndex]).parse(data)
	const line = Value.min(0).int().parse(env.get(d[0]))
	env.jump(line)
}
const jr: icFunction = (env, data) => {
	const d = z.tuple([RelativeLineIndex]).parse(data)
	const line = Value.min(0)
		.int()
		.parse(env.line + env.get(d[0]))
	env.jump(line)
}
const jal: icFunction = (env, data) => {
	const d = z.tuple([LineIndex]).parse(data)
	const line = Value.min(0).int().parse(env.get(d[0]))
	env.set("r17", env.line)
	env.jump(line)
}
const beq: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.eq(env, [x, y])) j(env, [line])
}
const bge: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.ge(env, [x, y])) j(env, [line])
}
const bgt: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.gt(env, [x, y])) j(env, [line])
}
const ble: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.le(env, [x, y])) j(env, [line])
}
const blt: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.lt(env, [x, y])) j(env, [line])
}
const bne: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.ne(env, [x, y])) j(env, [line])
}
const bap: icFunction = (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (conditions.ap(env, [x, y, c])) j(env, [line])
}
const bna: icFunction = (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (conditions.na(env, [x, y, c])) j(env, [line])
}
const bdse: icFunction = (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (conditions.dse(env, [d])) j(env, [line])
}
const bdns: icFunction = (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (conditions.dns(env, [d])) j(env, [line])
}
const bnan: icFunction = (env, data) => {
	const [v, line] = z.tuple([Ralias, LineIndex]).parse(data)
	if (conditions.nan(env, [v])) j(env, [line])
}
const beqz: icFunction = (env, data) => beq(env, [...data, 0])
const bgez: icFunction = (env, data) => bge(env, [...data, 0])
const bgtz: icFunction = (env, data) => bgt(env, [...data, 0])
const blez: icFunction = (env, data) => ble(env, [...data, 0])
const bltz: icFunction = (env, data) => blt(env, [...data, 0])
const bnez: icFunction = (env, data) => bne(env, [...data, 0])
const bapz: icFunction = (env, [x, y]) => bap(env, [x, 0, y])
const bnaz: icFunction = (env, [x, y]) => bna(env, [x, 0, y])

const breq: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.eq(env, [a, b])) jr(env, [offset])
}
const brge: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.ge(env, [a, b])) jr(env, [offset])
}
const brgt: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.gt(env, [a, b])) jr(env, [offset])
}
const brle: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.le(env, [a, b])) jr(env, [offset])
}
const brlt: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.lt(env, [a, b])) jr(env, [offset])
}
const brne: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.ne(env, [a, b])) jr(env, [offset])
}
const brap: icFunction = (env, data) => {
	const [x, y, c, offset] = jrApValidate.parse(data)
	if (conditions.ap(env, [x, y, c])) jr(env, [offset])
}
const brna: icFunction = (env, data) => {
	const [x, y, c, offset] = jrApValidate.parse(data)
	if (conditions.na(env, [x, y, c])) jr(env, [offset])
}
const brdse: icFunction = (env, data) => {
	const [d, offset] = z.tuple([DeviceOrAlias, RelativeLineIndex]).parse(data)
	if (conditions.dse(env, [d])) jal(env, [offset])
}
const brdns: icFunction = (env, data) => {
	const [d, offset] = z.tuple([DeviceOrAlias, RelativeLineIndex]).parse(data)
	if (conditions.dns(env, [d])) jal(env, [offset])
}
const brnan: icFunction = (env, data) => {
	const [v, offset] = z.tuple([Ralias, RelativeLineIndex]).parse(data)
	if (conditions.nan(env, [v])) jr(env, [offset])
}
const breqz: icFunction = (env, data) => breq(env, [...data, 0])
const brgez: icFunction = (env, data) => brge(env, [...data, 0])
const brgtz: icFunction = (env, data) => brgt(env, [...data, 0])
const brlez: icFunction = (env, data) => brle(env, [...data, 0])
const brltz: icFunction = (env, data) => brlt(env, [...data, 0])
const brnez: icFunction = (env, data) => brne(env, [...data, 0])
const brapz: icFunction = (env, [x, y]) => bap(env, [x, 0, y])
const brnaz: icFunction = (env, [x, y]) => bna(env, [x, 0, y])

const beqal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.eq(env, [a, b])) jal(env, [line])
}
const bgeal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.ge(env, [a, b])) jal(env, [line])
}
const bgtal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.gt(env, [a, b])) jal(env, [line])
}
const bleal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.le(env, [a, b])) jal(env, [line])
}
const bltal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.lt(env, [a, b])) jal(env, [line])
}
const bneal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.ne(env, [a, b])) jal(env, [line])
}
const bapal: icFunction = (env, data) => {
	const [x, y, c, line] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (conditions.ap(env, [x, y, c])) jal(env, [line])
}
const bnaal: icFunction = (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (conditions.na(env, [x, y, c])) jal(env, [line])
}
const bdseal: icFunction = (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (conditions.dse(env, [d])) jal(env, [line])
}
const bdnsal: icFunction = (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (conditions.dns(env, [d])) jal(env, [line])
}
const beqzal: icFunction = (env, data) => beqzal(env, [...data, 0])
const bgezal: icFunction = (env, data) => bgezal(env, [...data, 0])
const bgtzal: icFunction = (env, data) => bgtzal(env, [...data, 0])
const blezal: icFunction = (env, data) => blezal(env, [...data, 0])
const bltzal: icFunction = (env, data) => bltzal(env, [...data, 0])
const bnezal: icFunction = (env, data) => bnezal(env, [...data, 0])
const bapzal: icFunction = (env, [x, y]) => bapzal(env, [x, 0, y])
const bnazal: icFunction = (env, [x, y]) => bnazal(env, [x, 0, y])

export const jump = {
	j,
	jr,
	jal,
	beq,
	beqz,
	bge,
	bgez,
	bgt,
	bgtz,
	ble,
	blez,
	blt,
	bltz,
	bne,
	bnez,
	bap,
	bapz,
	bna,
	bnaz,
	bdse,
	bdns,
	bnan,
	breq,
	breqz,
	brge,
	brgez,
	brgt,
	brgtz,
	brle,
	brlez,
	brlt,
	brltz,
	brne,
	brnez,
	brap,
	brapz,
	brna,
	brnaz,
	brdse,
	brdns,
	brnan,
	beqal,
	beqzal,
	bgeal,
	bgezal,
	bgtal,
	bgtzal,
	bleal,
	blezal,
	bltal,
	bltzal,
	bneal,
	bnezal,
	bapal,
	bapzal,
	bnaal,
	bnazal,
	bdseal,
	bdnsal,
}
export default jump
