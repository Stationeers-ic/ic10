// getProperty, setProperty

export function getProperty<T = any>(object: any, path: string | string[], defaultValue?: T): any {
	const pathArray = Array.isArray(path) ? path : path.split(".")
	const property = pathArray.reduce((obj, key) => {
		// (obj && obj[key]) || undefined
		if (typeof obj === "object" && obj !== null) {
			return obj[key]
		}
		return undefined
	}, object)
	return property === undefined ? defaultValue : property
}

export function setProperty<T = any>(object: any, path: string | string[], value: T): any {
	const pathArray = Array.isArray(path) ? path : path.split(".")
	const key = pathArray.pop()
	if (!key) {
		return object
	}
	const target = pathArray.reduce((obj, key) => {
		if (obj[key] === undefined || typeof obj[key] !== "object") {
			obj[key] = {}
		}
		return obj[key]
	}, object)
	target[key] = value
	return object
}
