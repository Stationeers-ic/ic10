export const stringSimilarity = (str1: string, str2: string, caseSensitive: boolean = false) => {
	if (!caseSensitive) {
		str1 = str1.toLowerCase()
		str2 = str2.toLowerCase()
	}

	const dp: number[][] = []

	for (let i = 0; i <= str1.length; i++) {
		dp[i] = []
		for (let j = 0; j <= str2.length; j++) {
			if (i === 0) {
				dp[i][j] = j
			} else if (j === 0) {
				dp[i][j] = i
			} else {
				dp[i][j] = Math.min(
					dp[i - 1][j - 1] + (str1[i - 1] !== str2[j - 1] ? 1 : 0),
					dp[i][j - 1] + 1,
					dp[i - 1][j] + 1,
				)
			}
		}
	}

	return dp[str1.length][str2.length]
}

export function findBestMatch<T extends string>(
	find: string,
	target: T[],
	caseSensitive: boolean = false,
): [target: T, rating: number] | null {
	if (!target.length) return null
	let bestMatchIndex = 0
	let bestMatchRating = stringSimilarity(find, target[0], caseSensitive)

	for (let i = 1; i < target.length; i++) {
		const rating = stringSimilarity(find, target[i], caseSensitive)
		if (rating < bestMatchRating) {
			bestMatchIndex = i
			bestMatchRating = rating
		}
	}

	return [target[bestMatchIndex], bestMatchRating]
}

export default stringSimilarity
