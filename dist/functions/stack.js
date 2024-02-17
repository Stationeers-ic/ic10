import { z } from "zod";
import { Ralias, RaliasOrValue } from "../ZodTypes";
export const stack = {
    push: (env, data) => {
        const d = z.tuple([RaliasOrValue]).parse(data);
        env.push(d[0]);
    },
    pop: (env, data) => {
        const d = z.tuple([Ralias]).parse(data);
        env.set(d[0], env.pop());
    },
    peek: (env, data) => {
        const d = z.tuple([Ralias]).parse(data);
        env.set(d[0], env.peek());
    },
};
