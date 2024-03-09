import Environment from "../abstract/Environment";
declare function dynamicDevicePortAsync(env: Environment, string: string): Promise<string>;
declare function dynamicRegisterAsync(env: Environment, string: string): Promise<string>;
declare function dynamicDevicePort(env: Environment, string: string): string;
declare function dynamicRegister(env: Environment, string: string): string;
export { dynamicDevicePort, dynamicRegister, dynamicDevicePortAsync, dynamicRegisterAsync };
