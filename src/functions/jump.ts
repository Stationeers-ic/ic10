import { icFunction } from "../functions"
import { z } from "zod"
import { conditions } from "./conditions"
import { DeviceOrAlias, LineIndex, Ralias, RaliasOrValue, RelativeLineIndex, StringOrNumberOrNaN } from "../ZodTypes"

const jValidate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex])
const jrValidate = z.tuple([RaliasOrValue, RaliasOrValue, RelativeLineIndex])
const jApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, LineIndex])
const jrApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, RelativeLineIndex])

const j: icFunction = (env, data) => {
	const d = z.tuple([LineIndex]).parse(data)
	env.jump(env.get(d[0]))
}
const jr: icFunction = (env, data) => {
	const d = z.tuple([RelativeLineIndex]).parse(data)
	env.jump(env.line + env.get(d[0]))
}
const jal: icFunction = (env, data) => {
	const d = z.tuple([LineIndex]).parse(data)
	env.set("r17", env.line)
	env.jump(env.get(d[0]))
}
const beq: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.eq(env, [x, y])) j(env, [line])
}
const beqz: icFunction = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [x, 0])) j(env, [line])
}
const bge: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.ge(env, [x, y])) j(env, [line])
}
const bgez: icFunction = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [x, 0])) j(env, [line])
}
const bgt: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.gt(env, [x, y])) j(env, [line])
}
const bgtz: icFunction = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [x, 0])) j(env, [line])
}
const ble: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.le(env, [x, y])) j(env, [line])
}
const blez: icFunction = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [x, 0])) j(env, [line])
}
const blt: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.lt(env, [x, y])) j(env, [line])
}
const bltz: icFunction = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [x, 0])) j(env, [line])
}
const bne: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.ne(env, [x, y])) j(env, [line])
}
const bnez: icFunction = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [x, 0])) j(env, [line])
}
const bap: icFunction = (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (conditions.ap(env, [x, y, c])) j(env, [line])
}
const bapz: icFunction = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ap(env, [x, y])) j(env, [line])
}
const bna: icFunction = (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (conditions.na(env, [x, y, c])) j(env, [line])
}
const bnaz: icFunction = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.na(env, [x, y, 0])) j(env, [line])
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
const breq: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.eq(env, [a, b])) jr(env, [offset])
}
const breqz: icFunction = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [a, 0])) jr(env, [offset])
}
const brge: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.ge(env, [a, b])) jr(env, [offset])
}
const brgez: icFunction = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [a, 0])) jr(env, [offset])
}
const brgt: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.gt(env, [a, b])) jr(env, [offset])
}
const brgtz: icFunction = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [a, 0])) jr(env, [offset])
}
const brle: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.le(env, [a, b])) jr(env, [offset])
}
const brlez: icFunction = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [a, 0])) jr(env, [offset])
}
const brlt: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.lt(env, [a, b])) jr(env, [offset])
}
const brltz: icFunction = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [a, 0])) jr(env, [offset])
}
const brne: icFunction = (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (conditions.ne(env, [a, b])) jr(env, [offset])
}
const brnez: icFunction = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [a, 0])) jr(env, [offset])
}
const brap: icFunction = (env, data) => {
	const [x, y, c, offset] = jrApValidate.parse(data)
	if (conditions.ap(env, [x, y, c])) jr(env, [offset])
}
const brapz: icFunction = (env, data) => {
	const [x, y, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ap(env, [x, y])) jr(env, [offset])
}
const brna: icFunction = (env, data) => {
	const [x, y, c, offset] = jrApValidate.parse(data)
	if (conditions.na(env, [x, y, c])) jr(env, [offset])
}
const brnaz: icFunction = (env, data) => {
	const [x, y, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.na(env, [x, y, 0])) jr(env, [offset])
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
const beqal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.eq(env, [a, b])) jal(env, [line])
}
const beqzal: icFunction = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [a, 0])) jal(env, [line])
}
const bgeal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.ge(env, [a, b])) jal(env, [line])
}
const bgezal: icFunction = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [a, 0])) jal(env, [line])
}
const bgtal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.gt(env, [a, b])) jal(env, [line])
}
const bgtzal: icFunction = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [a, 0])) jal(env, [line])
}
const bleal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.le(env, [a, b])) jal(env, [line])
}
const blezal: icFunction = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [a, 0])) jal(env, [line])
}
const bltal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.lt(env, [a, b])) jal(env, [line])
}
const bltzal: icFunction = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [a, 0])) jal(env, [line])
}
const bneal: icFunction = (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (conditions.ne(env, [a, b])) jal(env, [line])
}
const bnezal: icFunction = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [a, 0])) jal(env, [line])
}
const bapal: icFunction = (env, data) => {
	const [x, y, c, line] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (conditions.ap(env, [x, y, c])) jal(env, [line])
}
const bapzal: icFunction = (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (conditions.ap(env, [x, y])) jal(env, [line])
}
const bnaal: icFunction = (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (conditions.na(env, [x, y, c])) jal(env, [line])
}
const bnazal: icFunction = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.na(env, [x, y, 0])) jal(env, [line])
}
const bdseal: icFunction = (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (conditions.dse(env, [d])) jal(env, [line])
}
const bdnsal: icFunction = (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (conditions.dns(env, [d])) jal(env, [line])
}
export const jump= {
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
