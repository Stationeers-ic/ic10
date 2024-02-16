import { icFunction } from "../functions.js"
import { conditions } from "./conditions.js"
import { z } from "zod"
import { RegisterOrAlias, StringOrNumberOrNaN } from "../ZodTypes"

export const select: { [key: string]: icFunction } = {
	seq: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(z.number()), StringOrNumberOrNaN]).parse(data)
		env.set(op1, conditions.eq(env, [op2, op3]) ? 1 : 0)
	},
	seqz: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string(z.number())]).parse(data)
		env.set(op1, conditions.eq(env, [op2, 0]) ? 1 : 0)
	},
	sge: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(z.number()), StringOrNumberOrNaN]).parse(data)
		env.set(op1, conditions.ge(env, [op2, op3]) ? 1 : 0)
	},
	sgez: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string(z.number())]).parse(data)
		env.set(op1, conditions.ge(env, [op2, 0]) ? 1 : 0)
	},
	sgt: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(z.number()), StringOrNumberOrNaN]).parse(data)
		env.set(op1, conditions.gt(env, [op2, op3]) ? 1 : 0)
	},
	sgtz: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string(z.number())]).parse(data)
		env.set(op1, conditions.gt(env, [op2, 0]) ? 1 : 0)
	},
	sle: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(z.number()), StringOrNumberOrNaN]).parse(data)
		env.set(op1, conditions.le(env, [op2, op3]) ? 1 : 0)
	},
	slez: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string(z.number())]).parse(data)
		env.set(op1, conditions.le(env, [op2, 0]) ? 1 : 0)
	},
	slt: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(z.number()), StringOrNumberOrNaN]).parse(data)
		env.set(op1, conditions.lt(env, [op2, op3]) ? 1 : 0)
	},
	sltz: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string(z.number())]).parse(data)
		env.set(op1, conditions.lt(env, [op2, 0]) ? 1 : 0)
	},
	sne: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(z.number()), StringOrNumberOrNaN]).parse(data)
		env.set(op1, conditions.ne(env, [op2, op3]) ? 1 : 0)
	},
	snez: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string(z.number())]).parse(data)
		env.set(op1, conditions.ne(env, [op2, 0]) ? 1 : 0)
	},
	sap: (env, data) => {
		const [op1, op2, op3, op4] = z
			.tuple([z.string(), z.string(z.number()), z.string(z.number()), z.string(z.number())])
			.parse(data)
		env.set(op1, conditions.ap(env, [op2, op3, op4]) ? 1 : 0)
	},
	sapz: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(z.number()), z.string(z.number())]).parse(data)
		env.set(op1, conditions.ap(env, [op2, op3, 0]) ? 1 : 0)
	},
	sna: (env, data) => {
		const [op1, op2, op3, op4] = z
			.tuple([z.string(), z.string(z.number()), z.string(z.number()), z.string(z.number())])
			.parse(data)
		env.set(op1, conditions.na(env, [op2, op3, op4]) ? 1 : 0)
	},
	snaz: (env, data) => {
		const [op1, op2, op3] = z.tuple([z.string(), z.string(z.number()), z.string(z.number())]).parse(data)
		env.set(op1, conditions.na(env, [op2, op3, 0]) ? 1 : 0)
	},
	sdse: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string()]).parse(data)
		env.set(op1, conditions.dse(env, [op2]) ? 1 : 0)
	},
	sdns: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string()]).parse(data)
		env.set(op1, conditions.dns(env, [op2]) ? 1 : 0)
	},
	snan: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string()]).parse(data)
		env.set(op1, conditions.nan(env, [op2]) ? 1 : 0)
	},
	snanz: (env, data) => {
		const [op1, op2] = z.tuple([z.string(), z.string()]).parse(data)
		env.set(op1, conditions.nanz(env, [op2]) ? 1 : 0)
	},
	select: (env, data) => {
		const d = z.tuple([RegisterOrAlias, StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
		env.set(d[0], env.get(d[1]) ? env.get(d[2]) : env.get(d[3]))
	},
}
