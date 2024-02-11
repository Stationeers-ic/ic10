import {Environment} from "./abstract/Environment";

export type icFunction =(env: Environment, data: string | number[]) => void|Promise<void>