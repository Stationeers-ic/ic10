export abstract class Environment{
    public line: number = 0;

    abstract jump(line: string | number): void;

    abstract get(name: string | number): number ;
    abstract alias(alias: string, value: string|number): void;
    abstract set(name: string, value: number): void;

    abstract push(name: string | number): void;
    abstract pop(): number;
    abstract peek(): number;

}