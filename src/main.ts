import {Environment} from "./abstract/Environment.js";
import {Line} from "./core/Line.js";
import {InfiniteLoop} from "./errors/InfiniteLoop";

export class InterpreterIc10 {
    constructor(public readonly env: Environment, private code: string) {
    }

    public setCode(code: string) {
        this.code = code
    }

    parseCode() {
        return new Map(
            this.code.split('\n')
                .map((str) => str.trim().replace(/\s+/g, ' '))
                .filter((str) => str)
                .map((str, i) => {
                    const l = new Line(this, str, i)
                    if (l.fn?.endsWith(':')) {
                        const label = l.fn?.split(':')[0]
                        this.env.alias(label, i)
                    }
                    return [i, l]
                })
        )
            ;
    }

    public async run() {
        const lines = this.parseCode()

        const size = lines.size
        while (this.env.line < size) {
            let old = this.env.line
            const line = lines.get(this.env.line)
            if (line) {
                await line.run()
            }
            if (old === this.env.line) {
                this.env.line++
            }

            let whileTrueLine = [...lines].filter(([, l]) => l.runCounter > this.env.InfiniteLoopLimit)
            if (whileTrueLine.length) {
                throw new InfiniteLoop(`Infinite loop detected at line ${whileTrueLine[0][0]}`, 'warn', whileTrueLine[0][0])
            }
        }
    }
}