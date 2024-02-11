export abstract class Environment{
    abstract get(name: string | number):  string | number | undefined ;

    abstract alias(alias: string, value: string|number): void;

    abstract set(name: string, value: string | number): void;
}