import { z } from "zod"
import { icCondition } from "../functions"
import { StringOrNumberOrNaN } from "../ZodTypes"

// for later use, exported later in file
const epsilon = 2 ** -23

const conditions: Record<string, icCondition> = {}

conditions.eq = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) == env.get(y)
}
conditions.ge = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) >= env.get(y)
}
conditions.gt = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) > env.get(y)
}
conditions.le = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) <= env.get(y)
}
conditions.lt = (env, data) => {
	const [x, y] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return env.get(x) < env.get(y)
}
conditions.ne = (env, data) => !conditions.eq(env, data)

conditions.na = (env, data) => {
	const [x, y, c] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return Math.abs(env.get(x) - env.get(y)) > env.get(c) * Math.max(Math.abs(env.get(x)), Math.abs(env.get(y)))
}
conditions.ap = (env, data) => {
	const [x, y, c] = z.tuple([StringOrNumberOrNaN, StringOrNumberOrNaN, StringOrNumberOrNaN]).parse(data)
	return Math.abs(env.get(x) - env.get(y)) <= env.get(c) * Math.max(Math.abs(env.get(x)), Math.abs(env.get(y)))
}
conditions.dse = (env, data) => {
	const [d] = z.tuple([z.string()]).parse(data)
	return env.hasDevice(env.getAlias(d))
}
conditions.dns = (env, data) => !conditions.dse(env, data)

conditions.nan = (env, data) => {
	const [v] = z.tuple([StringOrNumberOrNaN]).parse(data)
	return isNaN(env.get(v))
}
conditions.nanz = (env, data) => !conditions.nan(env, data)

export { conditions, epsilon }
export default conditions
