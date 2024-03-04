import {Err} from "../abstract/Err";

export declare class BitWarn extends Err {
    level: "error" | "warn" | "info" | "debug";
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    charStart?: number | undefined;
    charEnd?: number | undefined;
    constructor(message: string, level?: "error" | "warn" | "info" | "debug", lineStart?: number | undefined, lineEnd?: number | undefined, charStart?: number | undefined, charEnd?: number | undefined);
}
export default BitWarn;
