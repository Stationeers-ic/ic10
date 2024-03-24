import type { icInstruction, icPartialInstruction } from "./types"
import arithmetic from "./arithmetic"
import jump from "./jump"
import select from "./select"
import misc from "./misc"
import device from "./device"
import stack from "./stack"
import { AnyInstructionName } from "../ZodTypes"
import allInstructions from "../data/instructions"

export type { icInstruction } from "./types"

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

//						validated in tests									validated in tests
export const instructions: Record<AnyInstructionName, icInstruction> = instructionsPartial as Record<
	AnyInstructionName,
	icInstruction
>
export default instructions
