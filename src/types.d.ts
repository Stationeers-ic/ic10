import {Environment} from "./abstract/Environment.js";

export type icFunction =(env: Environment, data: string | number[]) => void|Promise<void>