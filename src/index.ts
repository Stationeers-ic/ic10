export { InterpreterIc10 } from "./InterpreterIc10"
export { DevEnv } from "./core/DevEnv"
export { Err } from "./abstract/Err"
export { Line } from "./core/Line"
export { Environment } from "./abstract/Environment"
export { Interpreter, isStop } from "./abstract/Interpreter"
export { BitWarn } from "./errors/BitWarn"
export { InfiniteLoop } from "./errors/InfiniteLoop"
export { SyntaxError } from "./errors/SyntaxError"
export { EnvError } from "./errors/EnvError"
export { instructions, instructionsNames } from "./instructions"

export {
	parse as lexerParse,
	ErrorTypes as lexerErrorTypes,
	getErrors,
	getLines as lexerGetLines,
	TOKEN_TYPES as LexerTOKEN_TYPES,
} from "./diagnostics"

export { str as hash } from "crc-32"
//types
export type { Line as LexerLine, Error as LexerError } from "./diagnostics"
export type { icInstruction } from "./instructions"
export type { StopType } from "./abstract/Interpreter"
