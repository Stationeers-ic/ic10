import { Line } from "./core/Line";
import { InfiniteLoop } from "./errors/InfiniteLoop";
import { Err } from "./abstract/Err";
export class InterpreterIc10 {
    code;
    stopRun = false;
    env;
    constructor(env, code) {
        this.env = env;
        this.code = code;
        this.parseCode();
    }
    setCode(code) {
        this.code = code;
        this.parseCode();
        return this;
    }
    parseCode() {
        this.env.lines = this.code
            .split("\n")
            .map((str) => (str.trim() === "" ? null : str))
            .map((str, i) => {
            if (str === null)
                return null;
            const line = new Line(this, str, i);
            if (line.fn?.endsWith(":")) {
                const label = line.fn?.split(":")[0];
                this.env.alias(label, i);
            }
            return line;
        });
        return this;
    }
    stop() {
        this.stopRun = true;
    }
    async step() {
        const old = this.env.line;
        const line = this.env.getCurrentLine();
        if (line === null) {
            this.env.line++;
            return false;
        }
        if (line === undefined)
            return "EOF";
        await line.run();
        if (line.runCounter > this.env.InfiniteLoopLimit) {
            this.env.throw(new InfiniteLoop(`Infinite loop detected at line ${line.lineIndex}`, "error", line.lineIndex));
        }
        if (old === this.env.line) {
            this.env.line++;
        }
        await this.env.afterLineRun(line);
        return true;
    }
    async testCode() {
        this.env.isTest = true;
        for (const line in this.env.lines) {
            await this.env.lines[line]?.run();
        }
    }
    async run(codeLines = 10_000, dryRun = 100_000) {
        codeLines = Math.max(codeLines, Number.MAX_SAFE_INTEGER);
        dryRun = Math.max(dryRun, Number.MAX_SAFE_INTEGER);
        this.stopRun = false;
        if (this.env.errorCounter !== 0)
            return "ERR";
        try {
            let result = false;
            while (codeLines > 0 && dryRun > 0 && this.stopRun === false) {
                result = await this.step();
                if (typeof result === "string")
                    return result;
                if (this.env.errorCounter !== 0)
                    return "ERR";
                if (result)
                    codeLines--;
                else
                    dryRun--;
            }
        }
        catch (e) {
            if (e instanceof Err) {
                this.env.throw(e);
            }
            else {
                throw e;
            }
        }
        if (codeLines <= 0 || dryRun <= 0)
            return "safeGuard";
        if (this.stopRun)
            return "STOP";
        return "ERR";
    }
}
export default InterpreterIc10;
