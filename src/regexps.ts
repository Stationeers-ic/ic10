export const line = new RegExp("^\\s*(?<function>^[^#:\\s]+:?)(?<args>[^:]*?)(?<comment>#.*)*$", "")

export const getRegexGroupPositions = (text: string, regex: RegExp): number[][] => {
	const positions: number[][] = []
	let match: RegExpExecArray | null

	while ((match = regex.exec(text)) !== null) {
		let groupPositions: number[] = []
		for (let i = 1; i < match.length; i++) {
			const group = match[i]
			if (group !== undefined) {
				const start = match.index + match[0].indexOf(group)
				const end = start + group.length
				groupPositions.push(start, end)
			}
		}
		positions.push(groupPositions)
		if (!regex.global) {
			// For non-global regexes, prevent infinite loops.
			break
		}
	}

	return positions
}

export const hash = new RegExp('^HASH\\("(?<hash>.+?)"\\)$', "")
export const reg = /^(?<prefix>r*)r(?<index>0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a)$/
export const dev = /^d([012345b])$/
export const strStart = /^".+$/
export const strEnd = /.+"$/
