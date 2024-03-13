import type { icPartialInstruction, icInstruction } from "./types"
export type { icInstruction } from "./types"
import arithmetic from "./arithmetic"
import jump from "./jump"
import select from "./select"
import misc from "./misc"
import device from "./device"
import stack from "./stack"
import { AnyInstructionName } from "../ZodTypes"
import allInstructions from "../data/instructions"

const instructionsPartial: Record<AnyInstructionName, icPartialInstruction> = {
	...arithmetic,
	...misc,
	...jump,
	...select,
	...device,
	...stack,
}

allInstructions.forEach(({ name, preview, description, deprecated }) => {
	const data = AnyInstructionName.safeParse(name)
	if (!data.success) return console.error(`${name} is not implemented`)
	const n = data.data
	instructionsPartial[n].description = description
	instructionsPartial[n].example = preview
	instructionsPartial[n].deprecated = deprecated || false
})

//						validated in types									validated in types
export const instructions: Record<AnyInstructionName, icInstruction> = instructionsPartial as Record<
	AnyInstructionName,
	icInstruction
>
export default instructions
