export declare abstract class Environment {
    abstract get(name: string | number): number;
    abstract alias(alias: string, value: string | number): void;
    abstract set(name: string, value: string | number): void;
}
