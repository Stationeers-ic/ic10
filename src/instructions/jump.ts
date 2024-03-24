import type Environment from "../abstract/Environment"
import {
	type icPartialInstruction,
	tupleDA_LI,
	tupleDA_RLI,
	tupleLI,
	tupleR_LI,
	tupleR_RLI,
	tupleRLI,
	tupleRV_LI,
	tupleRV_RLI,
	tupleRV_RV_LI,
	tupleRV_RV_RLI,
	tupleRV_RV_RV_LI,
	tupleRV_RV_RV_RLI,
} from "./types"
import { conditions } from "./conditions"
import { Value } from "../ZodTypes"

const jValidate = tupleRV_RV_LI
const jApValidate = tupleRV_RV_RV_LI

const jrValidate = tupleRV_RV_RLI
const jrApValidate = tupleRV_RV_RV_RLI
async function short(f: "j", env: Environment, line: number): Promise<void>
async function short(f: "jr", env: Environment, offset: number): Promise<void>
async function short(f: "jal", env: Environment, line: number): Promise<void>
async function short(f: "j" | "jr" | "jal", env: Environment, d: number): Promise<void> {
	const to = env.get(d)
	let line = -1
	if (f === "j") {
		line = Value.min(0)
			.int()
			.parse(await to)
	} else {
		const now = env.getPosition()
		if (f === "jr") {
			line = Value.min(0)
				.int()
				.parse((await now) + (await to))
		}
		if (f === "jal") {
			line = Value.min(0)
				.int()
				.parse(await to)
			await env.set("r17", await now)
		}
	}
	if (line < 0) throw new Error("invalid jump")
	await env.jump(line)
}

const j: icPartialInstruction = async (env, data) => {
	const [line] = j.validate.parse(data)
	await short("j", env, line)
}
j.validate = tupleLI
const jr: icPartialInstruction = async (env, data) => {
	const [line] = jr.validate.parse(data)
	await short("jr", env, line)
}
jr.validate = tupleRLI
const jal: icPartialInstruction = async (env, data) => {
	const [line] = jal.validate.parse(data)
	await short("jal", env, line)
}
jal.validate = tupleLI
const beq: icPartialInstruction = async (env, data) => {
	const [x, y, line] = beq.validate.parse(data)
	if (await conditions.eq(env, [x, y])) await short("j", env, line)
}
beq.validate = jValidate
const bge: icPartialInstruction = async (env, data) => {
	const [x, y, line] = bge.validate.parse(data)
	if (await conditions.ge(env, [x, y])) await short("j", env, line)
}
bge.validate = jValidate
const bgt: icPartialInstruction = async (env, data) => {
	const [x, y, line] = bgt.validate.parse(data)
	if (await conditions.gt(env, [x, y])) await short("j", env, line)
}
bgt.validate = jValidate
const ble: icPartialInstruction = async (env, data) => {
	const [x, y, line] = ble.validate.parse(data)
	if (await conditions.le(env, [x, y])) await short("j", env, line)
}
ble.validate = jValidate
const blt: icPartialInstruction = async (env, data) => {
	const [x, y, line] = blt.validate.parse(data)
	if (await conditions.lt(env, [x, y])) await short("j", env, line)
}
blt.validate = jValidate
const bne: icPartialInstruction = async (env, data) => {
	const [x, y, line] = bne.validate.parse(data)
	if (await conditions.ne(env, [x, y])) await short("j", env, line)
}
bne.validate = jValidate
const bap: icPartialInstruction = async (env, data) => {
	const [x, y, c, line] = bna.validate.parse(data)
	if (await conditions.ap(env, [x, y, c])) await short("j", env, line)
}
bap.validate = jApValidate
const bna: icPartialInstruction = async (env, data) => {
	const [x, y, c, line] = bna.validate.parse(data)
	if (await conditions.na(env, [x, y, c])) await short("j", env, line)
}
bna.validate = jApValidate
const bdse: icPartialInstruction = async (env, data) => {
	const [d, line] = bdse.validate.parse(data)
	if (await conditions.dse(env, [d])) await short("j", env, line)
}
bdse.validate = tupleDA_LI
const bdns: icPartialInstruction = async (env, data) => {
	const [d, line] = bdns.validate.parse(data)
	if (await conditions.dns(env, [d])) await short("j", env, line)
}
bdns.validate = tupleDA_LI
const bnan: icPartialInstruction = async (env, data) => {
	const [v, line] = bnan.validate.parse(data)
	if (await conditions.nan(env, [v])) await short("j", env, line)
}
bnan.validate = tupleR_LI
//zzz
const beqz: icPartialInstruction = async (env, data) => {
	const [x, line] = beqz.validate.parse(data)
	if (await conditions.eq(env, [x, 0])) await short("j", env, line)
}
beqz.validate = tupleRV_LI
const bgez: icPartialInstruction = async (env, data) => {
	const [x, line] = bgez.validate.parse(data)
	if (await conditions.ge(env, [x, 0])) await short("j", env, line)
}
bgez.validate = tupleRV_LI
const bgtz: icPartialInstruction = async (env, data) => {
	const [x, line] = bgtz.validate.parse(data)
	if (await conditions.gt(env, [x, 0])) await short("j", env, line)
}
bgtz.validate = tupleRV_LI
const blez: icPartialInstruction = async (env, data) => {
	const [x, line] = blez.validate.parse(data)
	if (await conditions.le(env, [x, 0])) await short("j", env, line)
}
blez.validate = tupleRV_LI
const bltz: icPartialInstruction = async (env, data) => {
	const [x, line] = bltz.validate.parse(data)
	if (await conditions.lt(env, [x, 0])) await short("j", env, line)
}
bltz.validate = tupleRV_LI
const bnez: icPartialInstruction = async (env, data) => {
	const [x, line] = bnez.validate.parse(data)
	if (await conditions.ne(env, [x, 0])) await short("j", env, line)
}
bnez.validate = tupleRV_LI
const bapz: icPartialInstruction = async (env, data) => {
	const [x, c, line] = bnaz.validate.parse(data)
	if (await conditions.ap(env, [x, 0, c])) await short("j", env, line)
}
bapz.validate = tupleRV_RV_LI
const bnaz: icPartialInstruction = async (env, data) => {
	const [x, c, line] = bnaz.validate.parse(data)
	if (await conditions.na(env, [x, 0, c])) await short("j", env, line)
}
bnaz.validate = tupleRV_RV_LI

const breq: icPartialInstruction = async (env, data) => {
	const [a, b, offset] = breq.validate.parse(data)
	if (await conditions.eq(env, [a, b])) await short("jr", env, offset)
}
breq.validate = jrValidate
const brge: icPartialInstruction = async (env, data) => {
	const [a, b, offset] = brge.validate.parse(data)
	if (await conditions.ge(env, [a, b])) await short("jr", env, offset)
}
brge.validate = jrValidate
const brgt: icPartialInstruction = async (env, data) => {
	const [a, b, offset] = brgt.validate.parse(data)
	if (await conditions.gt(env, [a, b])) await short("jr", env, offset)
}
brgt.validate = jrValidate
const brle: icPartialInstruction = async (env, data) => {
	const [a, b, offset] = brle.validate.parse(data)
	if (await conditions.le(env, [a, b])) await short("jr", env, offset)
}
brle.validate = jrValidate
const brlt: icPartialInstruction = async (env, data) => {
	const [a, b, offset] = brlt.validate.parse(data)
	if (await conditions.lt(env, [a, b])) await short("jr", env, offset)
}
brlt.validate = jrValidate
const brne: icPartialInstruction = async (env, data) => {
	const [a, b, offset] = brne.validate.parse(data)
	if (await conditions.ne(env, [a, b])) await short("jr", env, offset)
}
brne.validate = jrValidate
const brap: icPartialInstruction = async (env, data) => {
	const [x, y, c, offset] = brap.validate.parse(data)
	if (await conditions.ap(env, [x, y, c])) await short("jr", env, offset)
}
brap.validate = jrApValidate
const brna: icPartialInstruction = async (env, data) => {
	const [x, y, c, offset] = brna.validate.parse(data)
	if (await conditions.na(env, [x, y, c])) await short("jr", env, offset)
}
brna.validate = jrApValidate
const brdse: icPartialInstruction = async (env, data) => {
	const [d, offset] = brdse.validate.parse(data)
	if (await conditions.dse(env, [d])) await short("jal", env, offset)
}
brdse.validate = tupleDA_RLI
const brdns: icPartialInstruction = async (env, data) => {
	const [d, offset] = brdns.validate.parse(data)
	if (await conditions.dns(env, [d])) await short("jal", env, offset)
}
brdns.validate = tupleDA_RLI
const brnan: icPartialInstruction = async (env, data) => {
	const [v, offset] = brnan.validate.parse(data)
	if (await conditions.nan(env, [v])) await short("jr", env, offset)
}
brnan.validate = tupleR_RLI

//zzz
const breqz: icPartialInstruction = async (env, data) => {
	const [a, offset] = breqz.validate.parse(data)
	if (await conditions.eq(env, [a, 0])) await short("jr", env, offset)
}
breqz.validate = tupleRV_RLI
const brgez: icPartialInstruction = async (env, data) => {
	const [a, offset] = brgez.validate.parse(data)
	if (await conditions.ge(env, [a, 0])) await short("jr", env, offset)
}
brgez.validate = tupleRV_RLI
const brgtz: icPartialInstruction = async (env, data) => {
	const [a, offset] = brgtz.validate.parse(data)
	if (await conditions.gt(env, [a, 0])) await short("jr", env, offset)
}
brgtz.validate = tupleRV_RLI
const brlez: icPartialInstruction = async (env, data) => {
	const [a, offset] = brlez.validate.parse(data)
	if (await conditions.le(env, [a, 0])) await short("jr", env, offset)
}
brlez.validate = tupleRV_RLI
const brltz: icPartialInstruction = async (env, data) => {
	const [a, offset] = brltz.validate.parse(data)
	if (await conditions.lt(env, [a, 0])) await short("jr", env, offset)
}
brltz.validate = tupleRV_RLI
const brnez: icPartialInstruction = async (env, data) => {
	const [a, offset] = brnez.validate.parse(data)
	if (await conditions.ne(env, [a, 0])) await short("jr", env, offset)
}
brnez.validate = tupleRV_RLI
const brapz: icPartialInstruction = async (env, data) => {
	const [x, c, offset] = brapz.validate.parse(data)
	if (await conditions.ap(env, [x, 0, c])) await short("jr", env, offset)
}
brapz.validate = tupleRV_RV_RLI
const brnaz: icPartialInstruction = async (env, data) => {
	const [x, c, offset] = brnaz.validate.parse(data)
	if (await conditions.na(env, [x, 0, c])) await short("jr", env, offset)
}
brnaz.validate = tupleRV_RV_RLI

const beqal: icPartialInstruction = async (env, data) => {
	const [a, b, line] = beqal.validate.parse(data)
	if (await conditions.eq(env, [a, b])) await short("jal", env, line)
}
beqal.validate = jValidate
const bgeal: icPartialInstruction = async (env, data) => {
	const [a, b, line] = bgeal.validate.parse(data)
	if (await conditions.ge(env, [a, b])) await short("jal", env, line)
}
bgeal.validate = jValidate
const bgtal: icPartialInstruction = async (env, data) => {
	const [a, b, line] = bgtal.validate.parse(data)
	if (await conditions.gt(env, [a, b])) await short("jal", env, line)
}
bgtal.validate = jValidate
const bleal: icPartialInstruction = async (env, data) => {
	const [a, b, line] = bleal.validate.parse(data)
	if (await conditions.le(env, [a, b])) await short("jal", env, line)
}
bleal.validate = jValidate
const bltal: icPartialInstruction = async (env, data) => {
	const [a, b, line] = bltal.validate.parse(data)
	if (await conditions.lt(env, [a, b])) await short("jal", env, line)
}
bltal.validate = jValidate
const bneal: icPartialInstruction = async (env, data) => {
	const [a, b, line] = bneal.validate.parse(data)
	if (await conditions.ne(env, [a, b])) await short("jal", env, line)
}
bneal.validate = jValidate
const bapal: icPartialInstruction = async (env, data) => {
	const [x, y, c, line] = bapal.validate.parse(data)
	if (await conditions.ap(env, [x, y, c])) await short("jal", env, line)
}
bapal.validate = jrApValidate
const bnaal: icPartialInstruction = async (env, data) => {
	const [x, y, c, line] = bnaal.validate.parse(data)
	if (await conditions.na(env, [x, y, c])) await short("jal", env, line)
}
bnaal.validate = jApValidate
const bdseal: icPartialInstruction = async (env, data) => {
	const [d, line] = bdseal.validate.parse(data)
	if (await conditions.dse(env, [d])) await short("jal", env, line)
}
bdseal.validate = tupleDA_LI
const bdnsal: icPartialInstruction = async (env, data) => {
	const [d, line] = bdnsal.validate.parse(data)
	if (await conditions.dns(env, [d])) await short("jal", env, line)
}
bdnsal.validate = tupleDA_LI

//zzz
const beqzal: icPartialInstruction = async (env, data) => {
	const [a, line] = beqzal.validate.parse(data)
	if (await conditions.eq(env, [a, 0])) await short("jal", env, line)
}
beqzal.validate = tupleRV_LI
const bgezal: icPartialInstruction = async (env, data) => {
	const [a, line] = bgezal.validate.parse(data)
	if (await conditions.ge(env, [a, 0])) await short("jal", env, line)
}
bgezal.validate = tupleRV_LI
const bgtzal: icPartialInstruction = async (env, data) => {
	const [a, line] = bgtzal.validate.parse(data)
	if (await conditions.gt(env, [a, 0])) await short("jal", env, line)
}
bgtzal.validate = tupleRV_LI
const blezal: icPartialInstruction = async (env, data) => {
	const [a, line] = blezal.validate.parse(data)
	if (await conditions.le(env, [a, 0])) await short("jal", env, line)
}
blezal.validate = tupleRV_LI
const bltzal: icPartialInstruction = async (env, data) => {
	const [a, line] = bltzal.validate.parse(data)
	if (await conditions.lt(env, [a, 0])) await short("jal", env, line)
}
bltzal.validate = tupleRV_LI
const bnezal: icPartialInstruction = async (env, data) => {
	const [a, line] = bnezal.validate.parse(data)
	if (await conditions.ne(env, [a, 0])) await short("jal", env, line)
}
bnezal.validate = tupleRV_LI
const bapzal: icPartialInstruction = async (env, data) => {
	const [x, c, line] = bapzal.validate.parse(data)
	if (await conditions.ap(env, [x, 0, c])) await short("jal", env, line)
}
bapzal.validate = tupleRV_RV_LI
const bnazal: icPartialInstruction = async (env, data) => {
	const [x, c, line] = bnazal.validate.parse(data)
	if (await conditions.na(env, [x, 0, c])) await short("jal", env, line)
}
bnazal.validate = tupleRV_RV_LI

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
