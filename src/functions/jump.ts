import { icFunction } from "../functions"
import { z } from "zod"
import { conditions } from "./conditions"
import { StringOrNumberOrNaN } from "../ZodTypes"



export const jump: Record<string, icFunction> = {}
jump.j = (env, data) => {
	const d = z.tuple([StringOrNumberOrNaN]).parse(data)
	env.jump(d[0])
}
jump.jr = (env, data) => {
	const d = z.tuple([StringOrNumberOrNaN]).parse(data)
	env.jump(env.line + env.get(d[0]))
}
jump.jal = (env, data) => {
	const d = z.tuple([StringOrNumberOrNaN]).parse(data)
	env.set("ra", env.line)
	env.jump(env.line + env.get(d[0]))
}
jump.beq = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [x, y])) jump.j(env, [line])
}
jump.beqz = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [x, 0])) jump.j(env, [line])
}
jump.bge = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [x, y])) jump.j(env, [line])
}
jump.bgez = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [x, 0])) jump.j(env, [line])
}
jump.bgt = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [x, y])) jump.j(env, [line])
}
jump.bgtz = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [x, 0])) jump.j(env, [line])
}
jump.ble = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [x, y])) jump.j(env, [line])
}
jump.blez = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [x, 0])) jump.j(env, [line])
}
jump.blt = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [x, y])) jump.j(env, [line])
}
jump.bltz = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [x, 0])) jump.j(env, [line])
}
jump.bne = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [x, y])) jump.j(env, [line])
}
jump.bnez = (env, data) => {
	const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [x, 0])) jump.j(env, [line])
}
jump.bap = (env, data) => {
	const [x, y, c, line] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (conditions.ap(env, [x, y, c])) jump.j(env, [line])
}
jump.bapz = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ap(env, [x, y])) jump.j(env, [line])
}
jump.bna = (env, data) => {
	const [x, y, c, line] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (conditions.na(env, [x, y, c])) jump.j(env, [line])
}
jump.bnaz = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.na(env, [x, y, 0])) jump.j(env, [line])
}
jump.bdse = (env, data) => {
	const [d, line] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
	if (conditions.dse(env, [d])) jump.j(env, [line])
}
jump.bdns = (env, data) => {
	const [d, line] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
	if (conditions.dns(env, [d])) jump.j(env, [line])
}
jump.bnan = (env, data) => {
	const [v, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.nan(env, [v])) jump.j(env, [line])
}
jump.breq = (env, data) => {
	const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [a, b])) jump.jr(env, [offset])
}
jump.breqz = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [a, 0])) jump.jr(env, [offset])
}
jump.brge = (env, data) => {
	const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [a, b])) jump.jr(env, [offset])
}
jump.brgez = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [a, 0])) jump.jr(env, [offset])
}
jump.brgt = (env, data) => {
	const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [a, b])) jump.jr(env, [offset])
}
jump.brgtz = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [a, 0])) jump.jr(env, [offset])
}
jump.brle = (env, data) => {
	const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [a, b])) jump.jr(env, [offset])
}
jump.brlez = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [a, 0])) jump.jr(env, [offset])
}
jump.brlt = (env, data) => {
	const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [a, b])) jump.jr(env, [offset])
}
jump.brltz = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [a, 0])) jump.jr(env, [offset])
}
jump.brne = (env, data) => {
	const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [a, b])) jump.jr(env, [offset])
}
jump.brnez = (env, data) => {
	const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [a, 0])) jump.jr(env, [offset])
}
jump.brap = (env, data) => {
	const [x, y, c, offset] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (conditions.ap(env, [x, y, c])) jump.jr(env, [offset])
}
jump.brapz = (env, data) => {
	const [x, y, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ap(env, [x, y])) jump.jr(env, [offset])
}
jump.brna = (env, data) => {
	const [x, y, c, offset] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (conditions.na(env, [x, y, c])) jump.jr(env, [offset])
}
jump.brnaz = (env, data) => {
	const [x, y, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.na(env, [x, y, 0])) jump.jr(env, [offset])
}
jump.brdse = (env, data) => {
	const [d, offset] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
	if (conditions.dse(env, [d])) jump.jal(env, [offset])
}
jump.brdns = (env, data) => {
	const [d, offset] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
	if (conditions.dns(env, [d])) jump.jal(env, [offset])
}
jump.brnan = (env, data) => {
	const [v, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.nan(env, [v])) jump.jr(env, [offset])
}
jump.beqal = (env, data) => {
	const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [a, b])) jump.jal(env, [line])
}
jump.beqzal = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.eq(env, [a, 0])) jump.jal(env, [line])
}
jump.bgeal = (env, data) => {
	const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [a, b])) jump.jal(env, [line])
}
jump.bgezal = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ge(env, [a, 0])) jump.jal(env, [line])
}
jump.bgtal = (env, data) => {
	const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [a, b])) jump.jal(env, [line])
}
jump.bgtzal = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.gt(env, [a, 0])) jump.jal(env, [line])
}
jump.bleal = (env, data) => {
	const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [a, b])) jump.jal(env, [line])
}
jump.blezal = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.le(env, [a, 0])) jump.jal(env, [line])
}
jump.bltal = (env, data) => {
	const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [a, b])) jump.jal(env, [line])
}
jump.bltzal = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.lt(env, [a, 0])) jump.jal(env, [line])
}
jump.bneal = (env, data) => {
	const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [a, b])) jump.jal(env, [line])
}
jump.bnezal = (env, data) => {
	const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ne(env, [a, 0])) jump.jal(env, [line])
}
jump.bapal = (env, data) => {
	const [x, y, c, line] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (conditions.ap(env, [x, y, c])) jump.jal(env, [line])
}
jump.bapzal = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.ap(env, [x, y])) jump.jal(env, [line])
}
jump.bnaal = (env, data) => {
	const [x, y, c, line] = z
		.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
		.parse(data)
	if (conditions.na(env, [x, y, c])) jump.jal(env, [line])
}
jump.bnazal = (env, data) => {
	const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	if (conditions.na(env, [x, y, 0])) jump.jal(env, [line])
}
jump.bdseal = (env, data) => {
	const [d, line] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
	if (conditions.dse(env, [d])) jump.jal(env, [line])
}
jump.bdnsal = (env, data) => {
	const [d, line] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
	if (conditions.dns(env, [d])) jump.jal(env, [line])
}
