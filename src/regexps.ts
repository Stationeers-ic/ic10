import { z } from "zod"
import { isKeyOfObject } from "./ZodTypes"

export const line = /^\s*(?<fn>[^#:\s]+:?)(?<args>.*?)(?<comment>#.*)*$/
export const args = /\s*(HASH\(".*?(?="\))"\)|\S+)/g

export const dynamicRegisterReg = /^(?<rr>r+)(?<first>r\d+)$/
export const dynamicRegisterGroups = z.object({
	rr: z.string(),
	first: z.string(),
})
export const dynamicDevice = /^d(?<rr>(r+\d+))$/
export const dynamicDeviceGroups = z.object({
	rr: z.string(),
})
export const Position = z.object({
	value: z.string(),
	start: z.number(),
	end: z.number(),
	length: z.number(),
})
export const Positions = z.object({
	fn: Position,
	args: z.array(Position),
	comment: Position,
})
export type Positions = z.infer<typeof Positions>
export type Position = z.infer<typeof Position>

export const tokenize = (text: string) => {
	const match = line.exec(text)
	if (match === null) return null
	const groups = match.groups
	if (!groups) return null
	const groupPositions: Positions = {
		fn: { value: "", start: 0, end: 0, length: 0 },
		args: [],
		comment: { value: "", start: 0, end: 0, length: 0 },
	}
	Object.entries(groups).forEach(([groupName, group]) => {
		if (group !== undefined) {
			const start = match.index + match[0].indexOf(group)
			const length = group.length
			const end = start + length

			if (isKeyOfObject(groupName, groupPositions)) {
				if (groupName === "args") {
					;[...group.matchAll(args)].forEach((k, i) => {
						const [v, arg] = k
						const argStart = start + v.indexOf(arg) + (k.index ?? 0)
						const argLength = arg.length
						const argEnd = argStart + argLength
						groupPositions[groupName].push({
							value: arg,
							start: argStart,
							end: argEnd,
							length: argLength,
						})
					})
				} else
					groupPositions[groupName] = {
						value: group,
						start,
						end,
						length,
					}
			}
		}
	})
	return Positions.parse(groupPositions)
}

export const hash = new RegExp('^HASH\\("(?<hash>.+?)"\\)$', "")
export const reg = /^(?<prefix>r*)r(?<index>0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a)$/
export const dev = /^d([012345b])$/
export const strStart = /^".+$/
export const strEnd = /.+"$/
