import type { icPartialFunction } from "./types"
import { z } from "zod"
import { conditions } from "./conditions"
import { DeviceOrAlias, LineIndex, Ralias, RaliasOrValue, RelativeLineIndex, Value } from "../ZodTypes"

const jValidate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex])
const jApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, LineIndex])

const jrValidate = z.tuple([RaliasOrValue, RaliasOrValue, RelativeLineIndex])
const jrApValidate = z.tuple([RaliasOrValue, RaliasOrValue, RaliasOrValue, RelativeLineIndex])

const j: icPartialFunction = async (env, data) => {
	const d = z.tuple([LineIndex]).parse(data)
	const line = Value.min(0)
		.int()
		.parse(await env.get(d[0]))
	await env.jump(line)
}
j.validate = z.tuple([LineIndex])
const jr: icPartialFunction = async (env, data) => {
	const d = z.tuple([RelativeLineIndex]).parse(data)
	const line = Value.min(0)
		.int()
		.parse((await env.getPosition()) + (await env.get(d[0])))
	await env.jump(line)
}
jr.validate = z.tuple([RelativeLineIndex])
const jal: icPartialFunction = async (env, data) => {
	const d = z.tuple([LineIndex]).parse(data)
	const line = Value.min(0)
		.int()
		.parse(await env.get(d[0]))
	await env.set("r17", await env.getPosition())
	await env.jump(line)
}
jal.validate = z.tuple([LineIndex])
const beq: icPartialFunction = async (env, data) => {
	const [x, y, line] = beq.validate.parse(data)
	if (await conditions.eq(env, [x, y])) await j(env, [line])
}
beq.validate = jValidate
const bge: icPartialFunction = async (env, data) => {
	const [x, y, line] = bge.validate.parse(data)
	if (await conditions.ge(env, [x, y])) await j(env, [line])
}
bge.validate = jValidate
const bgt: icPartialFunction = async (env, data) => {
	const [x, y, line] = bgt.validate.parse(data)
	if (await conditions.gt(env, [x, y])) await j(env, [line])
}
bgt.validate = jValidate
const ble: icPartialFunction = async (env, data) => {
	const [x, y, line] = ble.validate.parse(data)
	if (await conditions.le(env, [x, y])) await j(env, [line])
}
ble.validate = jValidate
const blt: icPartialFunction = async (env, data) => {
	const [x, y, line] = blt.validate.parse(data)
	if (await conditions.lt(env, [x, y])) await j(env, [line])
}
blt.validate = jValidate
const bne: icPartialFunction = async (env, data) => {
	const [x, y, line] = bne.validate.parse(data)
	if (await conditions.ne(env, [x, y])) await j(env, [line])
}
bne.validate = jValidate
const bap: icPartialFunction = async (env, data) => {
	const [x, y, c, line] = bna.validate.parse(data)
	if (await conditions.ap(env, [x, y, c])) await j(env, [line])
}
bap.validate = jApValidate
const bna: icPartialFunction = async (env, data) => {
	const [x, y, c, line] = bna.validate.parse(data)
	if (await conditions.na(env, [x, y, c])) await j(env, [line])
}
bna.validate = jApValidate
const bdse: icPartialFunction = async (env, data) => {
	const [d, line] = bdse.validate.parse(data)
	if (await conditions.dse(env, [d])) await j(env, [line])
}
bdse.validate = z.tuple([DeviceOrAlias, LineIndex])
const bdns: icPartialFunction = async (env, data) => {
	const [d, line] = bdns.validate.parse(data)
	if (await conditions.dns(env, [d])) await j(env, [line])
}
bdns.validate = z.tuple([DeviceOrAlias, LineIndex])
const bnan: icPartialFunction = async (env, data) => {
	const [v, line] = bnan.validate.parse(data)
	if (await conditions.nan(env, [v])) await j(env, [line])
}
bnan.validate = z.tuple([Ralias, LineIndex])
const beqz: icPartialFunction = async (env, [x, y]) => beq(env, [x, 0, y])
const bgez: icPartialFunction = async (env, [x, y]) => bge(env, [x, 0, y])
const bgtz: icPartialFunction = async (env, [x, y]) => bgt(env, [x, 0, y])
const blez: icPartialFunction = async (env, [x, y]) => ble(env, [x, 0, y])
const bltz: icPartialFunction = async (env, [x, y]) => blt(env, [x, 0, y])
const bnez: icPartialFunction = async (env, [x, y]) => bne(env, [x, 0, y])
const bapz: icPartialFunction = async (env, [x, y, z]) => bap(env, [x, 0, y, z])
const bnaz: icPartialFunction = async (env, [x, y, z]) => bna(env, [x, 0, y, z])
beqz.validate = z.tuple([RaliasOrValue, LineIndex])
bgez.validate = z.tuple([RaliasOrValue, LineIndex])
bgtz.validate = z.tuple([RaliasOrValue, LineIndex])
blez.validate = z.tuple([RaliasOrValue, LineIndex])
bltz.validate = z.tuple([RaliasOrValue, LineIndex])
bnez.validate = z.tuple([RaliasOrValue, LineIndex])
bapz.validate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex])
bnaz.validate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex])

const breq: icPartialFunction = async (env, data) => {
	const [a, b, offset] = breq.validate.parse(data)
	if (await conditions.eq(env, [a, b])) await jr(env, [offset])
}
breq.validate = jrValidate
const brge: icPartialFunction = async (env, data) => {
	const [a, b, offset] = brge.validate.parse(data)
	if (await conditions.ge(env, [a, b])) await jr(env, [offset])
}
brge.validate = jrValidate
const brgt: icPartialFunction = async (env, data) => {
	const [a, b, offset] = brgt.validate.parse(data)
	if (await conditions.gt(env, [a, b])) await jr(env, [offset])
}
brgt.validate = jrValidate
const brle: icPartialFunction = async (env, data) => {
	const [a, b, offset] = brle.validate.parse(data)
	if (await conditions.le(env, [a, b])) await jr(env, [offset])
}
brle.validate = jrValidate
const brlt: icPartialFunction = async (env, data) => {
	const [a, b, offset] = brlt.validate.parse(data)
	if (await conditions.lt(env, [a, b])) await jr(env, [offset])
}
brlt.validate = jrValidate
const brne: icPartialFunction = async (env, data) => {
	const [a, b, offset] = brne.validate.parse(data)
	if (await conditions.ne(env, [a, b])) await jr(env, [offset])
}
brne.validate = jrValidate
const brap: icPartialFunction = async (env, data) => {
	const [x, y, c, offset] = brap.validate.parse(data)
	if (await conditions.ap(env, [x, y, c])) await jr(env, [offset])
}
brap.validate = jrApValidate
const brna: icPartialFunction = async (env, data) => {
	const [x, y, c, offset] = brna.validate.parse(data)
	if (await conditions.na(env, [x, y, c])) await jr(env, [offset])
}
brna.validate = jrApValidate
const brdse: icPartialFunction = async (env, data) => {
	const [d, offset] = brdse.validate.parse(data)
	if (await conditions.dse(env, [d])) await jal(env, [offset])
}
brdse.validate = z.tuple([DeviceOrAlias, RelativeLineIndex])
const brdns: icPartialFunction = async (env, data) => {
	const [d, offset] = brdns.validate.parse(data)
	if (await conditions.dns(env, [d])) await jal(env, [offset])
}
brdns.validate = z.tuple([DeviceOrAlias, RelativeLineIndex])
const brnan: icPartialFunction = async (env, data) => {
	const [v, offset] = brnan.validate.parse(data)
	if (await conditions.nan(env, [v])) await jr(env, [offset])
}
brnan.validate = z.tuple([Ralias, RelativeLineIndex])
const breqz: icPartialFunction = async (env, [x, y]) => breq(env, [x, 0, y])
const brgez: icPartialFunction = async (env, [x, y]) => brge(env, [x, 0, y])
const brgtz: icPartialFunction = async (env, [x, y]) => brgt(env, [x, 0, y])
const brlez: icPartialFunction = async (env, [x, y]) => brle(env, [x, 0, y])
const brltz: icPartialFunction = async (env, [x, y]) => brlt(env, [x, 0, y])
const brnez: icPartialFunction = async (env, [x, y]) => brne(env, [x, 0, y])
const brapz: icPartialFunction = async (env, [x, y, z]) => bap(env, [x, 0, y, z])
const brnaz: icPartialFunction = async (env, [x, y, z]) => bna(env, [x, 0, y, z])
breqz.validate = z.tuple([RaliasOrValue, RelativeLineIndex])
brgez.validate = z.tuple([RaliasOrValue, RelativeLineIndex])
brgtz.validate = z.tuple([RaliasOrValue, RelativeLineIndex])
brlez.validate = z.tuple([RaliasOrValue, RelativeLineIndex])
brltz.validate = z.tuple([RaliasOrValue, RelativeLineIndex])
brnez.validate = z.tuple([RaliasOrValue, RelativeLineIndex])
brapz.validate = z.tuple([RaliasOrValue, RaliasOrValue, RelativeLineIndex])
brnaz.validate = z.tuple([RaliasOrValue, RaliasOrValue, RelativeLineIndex])

const beqal: icPartialFunction = async (env, data) => {
	const [a, b, line] = beqal.validate.parse(data)
	if (await conditions.eq(env, [a, b])) await jal(env, [line])
}
beqal.validate = jValidate
const bgeal: icPartialFunction = async (env, data) => {
	const [a, b, line] = bgeal.validate.parse(data)
	if (await conditions.ge(env, [a, b])) await jal(env, [line])
}
bgeal.validate = jValidate
const bgtal: icPartialFunction = async (env, data) => {
	const [a, b, line] = bgtal.validate.parse(data)
	if (await conditions.gt(env, [a, b])) await jal(env, [line])
}
bgtal.validate = jValidate
const bleal: icPartialFunction = async (env, data) => {
	const [a, b, line] = bleal.validate.parse(data)
	if (await conditions.le(env, [a, b])) await jal(env, [line])
}
bleal.validate = jValidate
const bltal: icPartialFunction = async (env, data) => {
	const [a, b, line] = bltal.validate.parse(data)
	if (await conditions.lt(env, [a, b])) await jal(env, [line])
}
bltal.validate = jValidate
const bneal: icPartialFunction = async (env, data) => {
	const [a, b, line] = bneal.validate.parse(data)
	if (await conditions.ne(env, [a, b])) await jal(env, [line])
}
bneal.validate = jValidate
const bapal: icPartialFunction = async (env, data) => {
	const [x, y, c, line] = bapal.validate.parse(data)
	if (await conditions.ap(env, [x, y, c])) await jal(env, [line])
}
bapal.validate = jrApValidate
const bnaal: icPartialFunction = async (env, data) => {
	const [x, y, c, line] = bnaal.validate.parse(data)
	if (await conditions.na(env, [x, y, c])) await jal(env, [line])
}
bnaal.validate = jApValidate
const bdseal: icPartialFunction = async (env, data) => {
	const [d, line] = bdseal.validate.parse(data)
	if (await conditions.dse(env, [d])) await jal(env, [line])
}
bdseal.validate = z.tuple([DeviceOrAlias, LineIndex])
const bdnsal: icPartialFunction = async (env, data) => {
	const [d, line] = bdnsal.validate.parse(data)
	if (await conditions.dns(env, [d])) await jal(env, [line])
}
bdnsal.validate = z.tuple([DeviceOrAlias, LineIndex])

const beqzal: icPartialFunction = async (env, [x, y]) => beqzal(env, [x, 0, y])
const bgezal: icPartialFunction = async (env, [x, y]) => bgezal(env, [x, 0, y])
const bgtzal: icPartialFunction = async (env, [x, y]) => bgtzal(env, [x, 0, y])
const blezal: icPartialFunction = async (env, [x, y]) => blezal(env, [x, 0, y])
const bltzal: icPartialFunction = async (env, [x, y]) => bltzal(env, [x, 0, y])
const bnezal: icPartialFunction = async (env, [x, y]) => bnezal(env, [x, 0, y])
const bapzal: icPartialFunction = async (env, [x, y, z]) => bapzal(env, [x, 0, y, z])
const bnazal: icPartialFunction = async (env, [x, y, z]) => bnazal(env, [x, 0, y, z])

beqzal.validate = z.tuple([RaliasOrValue, LineIndex])
bgezal.validate = z.tuple([RaliasOrValue, LineIndex])
bgtzal.validate = z.tuple([RaliasOrValue, LineIndex])
blezal.validate = z.tuple([RaliasOrValue, LineIndex])
bltzal.validate = z.tuple([RaliasOrValue, LineIndex])
bnezal.validate = z.tuple([RaliasOrValue, LineIndex])
bapzal.validate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex])
bnazal.validate = z.tuple([RaliasOrValue, RaliasOrValue, LineIndex])

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
