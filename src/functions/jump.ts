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

const j: icFunction = async (env, data) => {
	const d = z.tuple([LineIndex]).parse(data)
	const line = Value.min(0)
		.int()
		.parse(await env.get(d[0]))
	await env.jump(line)
}
const jr: icFunction = async (env, data) => {
	const d = z.tuple([RelativeLineIndex]).parse(data)
	const line = Value.min(0)
		.int()
		.parse((await env.getPosition()) + (await env.get(d[0])))
	await env.jump(line)
}
const jal: icFunction = async (env, data) => {
	const d = z.tuple([LineIndex]).parse(data)
	const line = Value.min(0)
		.int()
		.parse(await env.get(d[0]))
	await env.set("r17", await env.getPosition())
	await env.jump(line)
}
const beq: icFunction = async (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (await conditions.eq(env, [x, y])) await j(env, [line])
}
const bge: icFunction = async (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (await conditions.ge(env, [x, y])) await j(env, [line])
}
const bgt: icFunction = async (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (await conditions.gt(env, [x, y])) await j(env, [line])
}
const ble: icFunction = async (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (await conditions.le(env, [x, y])) await j(env, [line])
}
const blt: icFunction = async (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (await conditions.lt(env, [x, y])) await j(env, [line])
}
const bne: icFunction = async (env, data) => {
	const [x, y, line] = jValidate.parse(data)
	if (await conditions.ne(env, [x, y])) await j(env, [line])
}
const bap: icFunction = async (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (await conditions.ap(env, [x, y, c])) await j(env, [line])
}
const bna: icFunction = async (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (await conditions.na(env, [x, y, c])) await j(env, [line])
}
const bdse: icFunction = async (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (await conditions.dse(env, [d])) await j(env, [line])
}
const bdns: icFunction = async (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (await conditions.dns(env, [d])) await j(env, [line])
}
const bnan: icFunction = async (env, data) => {
	const [v, line] = z.tuple([Ralias, LineIndex]).parse(data)
	if (await conditions.nan(env, [v])) await j(env, [line])
}
const beqz: icFunction = async (env, data) => beq(env, [...data, 0])
const bgez: icFunction = async (env, data) => bge(env, [...data, 0])
const bgtz: icFunction = async (env, data) => bgt(env, [...data, 0])
const blez: icFunction = async (env, data) => ble(env, [...data, 0])
const bltz: icFunction = async (env, data) => blt(env, [...data, 0])
const bnez: icFunction = async (env, data) => bne(env, [...data, 0])
const bapz: icFunction = async (env, [x, y]) => bap(env, [x, 0, y])
const bnaz: icFunction = async (env, [x, y]) => bna(env, [x, 0, y])

const breq: icFunction = async (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (await conditions.eq(env, [a, b])) await jr(env, [offset])
}
const brge: icFunction = async (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (await conditions.ge(env, [a, b])) await jr(env, [offset])
}
const brgt: icFunction = async (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (await conditions.gt(env, [a, b])) await jr(env, [offset])
}
const brle: icFunction = async (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (await conditions.le(env, [a, b])) await jr(env, [offset])
}
const brlt: icFunction = async (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (await conditions.lt(env, [a, b])) await jr(env, [offset])
}
const brne: icFunction = async (env, data) => {
	const [a, b, offset] = jrValidate.parse(data)
	if (await conditions.ne(env, [a, b])) await jr(env, [offset])
}
const brap: icFunction = async (env, data) => {
	const [x, y, c, offset] = jrApValidate.parse(data)
	if (await conditions.ap(env, [x, y, c])) await jr(env, [offset])
}
const brna: icFunction = async (env, data) => {
	const [x, y, c, offset] = jrApValidate.parse(data)
	if (await conditions.na(env, [x, y, c])) await jr(env, [offset])
}
const brdse: icFunction = async (env, data) => {
	const [d, offset] = z.tuple([DeviceOrAlias, RelativeLineIndex]).parse(data)
	if (await conditions.dse(env, [d])) await jal(env, [offset])
}
const brdns: icFunction = async (env, data) => {
	const [d, offset] = z.tuple([DeviceOrAlias, RelativeLineIndex]).parse(data)
	if (await conditions.dns(env, [d])) await jal(env, [offset])
}
const brnan: icFunction = async (env, data) => {
	const [v, offset] = z.tuple([Ralias, RelativeLineIndex]).parse(data)
	if (await conditions.nan(env, [v])) await jr(env, [offset])
}
const breqz: icFunction = async (env, data) => breq(env, [...data, 0])
const brgez: icFunction = async (env, data) => brge(env, [...data, 0])
const brgtz: icFunction = async (env, data) => brgt(env, [...data, 0])
const brlez: icFunction = async (env, data) => brle(env, [...data, 0])
const brltz: icFunction = async (env, data) => brlt(env, [...data, 0])
const brnez: icFunction = async (env, data) => brne(env, [...data, 0])
const brapz: icFunction = async (env, [x, y]) => bap(env, [x, 0, y])
const brnaz: icFunction = async (env, [x, y]) => bna(env, [x, 0, y])

const beqal: icFunction = async (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (await conditions.eq(env, [a, b])) await jal(env, [line])
}
const bgeal: icFunction = async (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (await conditions.ge(env, [a, b])) await jal(env, [line])
}
const bgtal: icFunction = async (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (await conditions.gt(env, [a, b])) await jal(env, [line])
}
const bleal: icFunction = async (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (await conditions.le(env, [a, b])) await jal(env, [line])
}
const bltal: icFunction = async (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (await conditions.lt(env, [a, b])) await jal(env, [line])
}
const bneal: icFunction = async (env, data) => {
	const [a, b, line] = jValidate.parse(data)
	if (await conditions.ne(env, [a, b])) await jal(env, [line])
}
const bapal: icFunction = async (env, data) => {
	const [x, y, c, line] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (await conditions.ap(env, [x, y, c])) await jal(env, [line])
}
const bnaal: icFunction = async (env, data) => {
	const [x, y, c, line] = jApValidate.parse(data)
	if (await conditions.na(env, [x, y, c])) await jal(env, [line])
}
const bdseal: icFunction = async (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (await conditions.dse(env, [d])) await jal(env, [line])
}
const bdnsal: icFunction = async (env, data) => {
	const [d, line] = z.tuple([DeviceOrAlias, LineIndex]).parse(data)
	if (await conditions.dns(env, [d])) await jal(env, [line])
}
const beqzal: icFunction = async (env, data) => beqzal(env, [...data, 0])
const bgezal: icFunction = async (env, data) => bgezal(env, [...data, 0])
const bgtzal: icFunction = async (env, data) => bgtzal(env, [...data, 0])
const blezal: icFunction = async (env, data) => blezal(env, [...data, 0])
const bltzal: icFunction = async (env, data) => bltzal(env, [...data, 0])
const bnezal: icFunction = async (env, data) => bnezal(env, [...data, 0])
const bapzal: icFunction = async (env, [x, y]) => bapzal(env, [x, 0, y])
const bnazal: icFunction = async (env, [x, y]) => bnazal(env, [x, 0, y])

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
