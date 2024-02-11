export abstract class Environment{
    abstract get(name: string): any;
    abstract set(name: string, value: any): void;
}