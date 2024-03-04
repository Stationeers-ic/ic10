import {z} from "zod";
import {Ralias, RaliasOrValue} from "../ZodTypes";

const push = (env, data) => {
    const d = z.tuple([RaliasOrValue]).parse(data);
    env.push(d[0]);
};
const pop = (env, data) => {
    const d = z.tuple([Ralias]).parse(data);
    env.set(d[0], env.pop());
};
const peek = (env, data) => {
    const d = z.tuple([Ralias]).parse(data);
    env.set(d[0], env.peek());
};
export const stack = {
    push,
    pop,
    peek,
};
export default stack;
