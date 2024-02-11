import {Err} from "../abstract/Err.js";

class SyntaxError extends Err {
    constructor(message: string, public level: string, public lineStart?: number, public lineEnd?: number, charStart: number = 0, charEnd: number = 0) {
        super(message);
        this.name = 'SyntaxError';
    }
}