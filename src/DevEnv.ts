import {Environment} from "./abstract/Environment.js";
import {getProperty, setProperty} from 'dot-prop';
export class DevEnv extends Environment {
    public data: any = {}
    public aliases = new Map<string, string|number>()

    get(name: string): any {
        if (this.aliases.has(name)) {
            return this.aliases.get(name);
        }
        return getProperty(this.data, name);
    }

    set(name: string, value: string|number): void {
        setProperty(this.data, name, value);
    }

    alias(alias: string, value: string|number): void {
        this.aliases.set(alias, value)
    }
}