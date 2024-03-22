import Line from "./core/Line";
import InfiniteLoop from "./errors/InfiniteLoop";
import Err from "./abstract/Err";
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
    setEnv(env) {
        this.env = env;
        this.parseCode();
        return this;
    }
    parseCode() {
        this.code
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
        })
            .forEach((line) => {
            this.env.addLine(line);
        });
        return this;
    }
    async testCode() {
        this.env.isTest = true;
        const lines = await this.env.getLines();
        for (const line in lines) {
            lines[line]?.run();
        }
    }
    async step() {
        try {
            const old = await this.env.getPosition();
            const line = await this.env.getCurrentLine();
            if (line === null) {
                await this.env.addPosition(1);
                await this.env.afterLineRun();
                return false;
            }
            if (line === undefined)
                return "EOF";
            await this.env.beforeLineRun(line);
            await line.run();
            if (line.runCounter > this.env.InfiniteLoopLimit) {
                await this.env.throw(new InfiniteLoop(`Infinite loop detected at line ${line.lineIndex}`, "error", line.lineIndex));
            }
            if (old === (await this.env.getPosition())) {
                await this.env.addPosition(1);
            }
            await this.env.afterLineRun(line);
        }
        catch (e) {
            if (e instanceof Err) {
                this.env.throw(e);
            }
            else {
                throw e;
            }
            return "ERR";
        }
        return true;
    }
    async run(codeLines = 10_000, dryRun = 100_000) {
        codeLines = Math.min(codeLines, Number.MAX_SAFE_INTEGER);
        dryRun = Math.min(dryRun, Number.MAX_SAFE_INTEGER);
        this.stopRun = false;
        if ((await this.env.getErrorCount()) !== 0)
            return "ERR";
        let result = false;
        while (codeLines > 0 && dryRun > 0 && !this.stopRun) {
            result = await this.step();
            if (typeof result === "string")
                return result;
            if ((await this.env.getErrorCount()) !== 0)
                return "ERR";
            if (result)
                codeLines--;
            else
                dryRun--;
        }
        if (codeLines <= 0 || dryRun <= 0)
            return "safeGuard";
        if (this.stopRun)
            return "STOP";
        return "ERR";
    }
    stop() {
        this.stopRun = true;
    }
}
export default InterpreterIc10;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJwcmV0ZXJJYzEwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0ludGVycHJldGVySWMxMC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLElBQUksTUFBTSxhQUFhLENBQUE7QUFDOUIsT0FBTyxZQUFZLE1BQU0sdUJBQXVCLENBQUE7QUFDaEQsT0FBTyxHQUFHLE1BQU0sZ0JBQWdCLENBQUE7QUFFaEMsTUFBTSxPQUFPLGVBQWU7SUFDM0IsSUFBSSxDQUFRO0lBQ1osT0FBTyxHQUFZLEtBQUssQ0FBQTtJQUN4QixHQUFHLENBQWE7SUFFaEIsWUFBWSxHQUFnQixFQUFFLElBQVk7UUFDekMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7SUFDakIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFZO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUNoQixPQUFPLElBQUksQ0FBQTtJQUNaLENBQUM7SUFFTSxNQUFNLENBQUMsR0FBZ0I7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDaEIsT0FBTyxJQUFJLENBQUE7SUFDWixDQUFDO0lBRU0sU0FBUztRQUNmLElBQUksQ0FBQyxJQUFJO2FBQ1AsS0FBSyxDQUFDLElBQUksQ0FBQzthQUVYLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzlDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNm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