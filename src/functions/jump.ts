import { icFunction } from "../functions"
import { z } from "zod"
import { conditions } from "./conditions"
import { StringOrNumberOrNaN } from "../ZodTypes"


const j: icFunction = (env, data) => {
	const d = z.tuple([StringOrNumberOrNaN]).parse(data)
	env.jump(d[0])
}
const jr: icFunction = (env, data) => {
	const d = z.tuple([StringOrNumberOrNaN]).parse(data)
	env.jump(env.line + env.get(d[0]))
}
const jal: icFunction = (env, data) => {
	const d = z.tuple([StringOrNumberOrNaN]).parse(data)
	env.set("ra", env.line)
	env.jump(env.line + env.get(d[0]))
}

export const jump: { [key: string]: icFunction } = {
	j,
	jr,
	jal,
	beq: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.eq(env, [x, y])) j(env, [line])
	},
	beqz: (env, data) => {
		const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.eq(env, [x, 0])) j(env, [line])
	},
	bge: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ge(env, [x, y])) j(env, [line])
	},
	bgez: (env, data) => {
		const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ge(env, [x, 0])) j(env, [line])
	},
	bgt: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.gt(env, [x, y])) j(env, [line])
	},
	bgtz: (env, data) => {
		const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.gt(env, [x, 0])) j(env, [line])
	},
	ble: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.le(env, [x, y])) j(env, [line])
	},
	blez: (env, data) => {
		const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.le(env, [x, 0])) j(env, [line])
	},
	blt: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.lt(env, [x, y])) j(env, [line])
	},
	bltz: (env, data) => {
		const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.lt(env, [x, 0])) j(env, [line])
	},
	bne: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ne(env, [x, y])) j(env, [line])
	},
	bnez: (env, data) => {
		const [x, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ne(env, [x, 0])) j(env, [line])
	},
	bap: (env, data) => {
		const [x, y, c, line] = z
			.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
			.parse(data)
		if (conditions.ap(env, [x, y, c])) j(env, [line])
	},
	bapz: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ap(env, [x, y])) j(env, [line])
	},
	bna: (env, data) => {
		const [x, y, c, line] = z
			.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
			.parse(data)
		if (conditions.na(env, [x, y, c])) j(env, [line])
	},
	bnaz: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.na(env, [x, y, 0])) j(env, [line])
	},
	bdse: (env, data) => {
		const [d, line] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
		if (conditions.dse(env, [d])) j(env, [line])
	},
	bdns: (env, data) => {
		const [d, line] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
		if (conditions.dns(env, [d])) j(env, [line])
	},
	bnan: (env, data) => {
		const [v, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.nan(env, [v])) j(env, [line])
	},
	breq: (env, data) => {
		const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.eq(env, [a, b])) jr(env, [offset])
	},
	breqz: (env, data) => {
		const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.eq(env, [a, 0])) jr(env, [offset])
	},
	brge: (env, data) => {
		const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ge(env, [a, b])) jr(env, [offset])
	},
	brgez: (env, data) => {
		const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ge(env, [a, 0])) jr(env, [offset])
	},
	brgt: (env, data) => {
		const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.gt(env, [a, b])) jr(env, [offset])
	},
	brgtz: (env, data) => {
		const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.gt(env, [a, 0])) jr(env, [offset])
	},
	brle: (env, data) => {
		const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.le(env, [a, b])) jr(env, [offset])
	},
	brlez: (env, data) => {
		const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.le(env, [a, 0])) jr(env, [offset])
	},
	brlt: (env, data) => {
		const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.lt(env, [a, b])) jr(env, [offset])
	},
	brltz: (env, data) => {
		const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.lt(env, [a, 0])) jr(env, [offset])
	},
	brne: (env, data) => {
		const [a, b, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ne(env, [a, b])) jr(env, [offset])
	},
	brnez: (env, data) => {
		const [a, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ne(env, [a, 0])) jr(env, [offset])
	},
	brap: (env, data) => {
		const [x, y, c, offset] = z
			.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
			.parse(data)
		if (conditions.ap(env, [x, y, c])) jr(env, [offset])
	},
	brapz: (env, data) => {
		const [x, y, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ap(env, [x, y])) jr(env, [offset])
	},
	brna: (env, data) => {
		const [x, y, c, offset] = z
			.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
			.parse(data)
		if (conditions.na(env, [x, y, c])) jr(env, [offset])
	},
	brnaz: (env, data) => {
		const [x, y, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.na(env, [x, y, 0])) jr(env, [offset])
	},
	brdse: (env, data) => {
		const [d, offset] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
		if (conditions.dse(env, [d])) jal(env, [offset])
	},
	brdns: (env, data) => {
		const [d, offset] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
		if (conditions.dns(env, [d])) jal(env, [offset])
	},
	brnan: (env, data) => {
		const [v, offset] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.nan(env, [v])) jr(env, [offset])
	},
	beqal: (env, data) => {
		const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.eq(env, [a, b])) jal(env, [line])
	},
	beqzal: (env, data) => {
		const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.eq(env, [a, 0])) jal(env, [line])
	},
	bgeal: (env, data) => {
		const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ge(env, [a, b])) jal(env, [line])
	},
	bgezal: (env, data) => {
		const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ge(env, [a, 0])) jal(env, [line])
	},
	bgtal: (env, data) => {
		const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.gt(env, [a, b])) jal(env, [line])
	},
	bgtzal: (env, data) => {
		const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.gt(env, [a, 0])) jal(env, [line])
	},
	bleal: (env, data) => {
		const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.le(env, [a, b])) jal(env, [line])
	},
	blezal: (env, data) => {
		const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.le(env, [a, 0])) jal(env, [line])
	},
	bltal: (env, data) => {
		const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.lt(env, [a, b])) jal(env, [line])
	},
	bltzal: (env, data) => {
		const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.lt(env, [a, 0])) jal(env, [line])
	},
	bneal: (env, data) => {
		const [a, b, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ne(env, [a, b])) jal(env, [line])
	},
	bnezal: (env, data) => {
		const [a, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ne(env, [a, 0])) jal(env, [line])
	},
	bapal: (env, data) => {
		const [x, y, c, line] = z
			.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
			.parse(data)
		if (conditions.ap(env, [x, y, c])) jal(env, [line])
	},
	bapzal: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.ap(env, [x, y])) jal(env, [line])
	},
	bnaal: (env, data) => {
		const [x, y, c, line] = z
			.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN])
			.parse(data)
		if (conditions.na(env, [x, y, c])) jal(env, [line])
	},
	bnazal: (env, data) => {
		const [x, y, line] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		if (conditions.na(env, [x, y, 0])) jal(env, [line])
	},
	bdseal: (env, data) => {
		const [d, line] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
		if (conditions.dse(env, [d])) jal(env, [line])
	},
	bdnsal: (env, data) => {
		const [d, line] = z.tuple([z.string(), StringOrNumberOrNaN]).parse(data)
		if (conditions.dns(env, [d])) jal(env, [line])
	},
}
