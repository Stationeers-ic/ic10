import {Environment} from "./abstract/Environment";
import {getProperty, setProperty} from 'dot-prop';
export class DevEnv extends Environment {
    public data: any = {}

    get(name: string): any {
        return getProperty(this.data, name);
    }

    set(name: string, value: any): void {
        setProperty(this.data, name, value);
    }
}