import Environment from "../abstract/Environment";
type PathFor = (env: Environment, string: string) => string;
type PathForAsync = (env: Environment, string: string) => Promise<string>;
declare const pathFor_DynamicDevicePortAsync: PathForAsync;
declare const pathFor_DynamicRegisterAsync: PathForAsync;
declare const pathFor_DynamicDevicePort: PathFor;
declare const pathFor_DynamicRegister: PathFor;
declare const pathFor_PortWithConnection: PathFor;
declare const PortWithConnection: (port: string) => {
    port: string;
    connection: null | string;
};
export { pathFor_DynamicDevicePort, pathFor_DynamicRegister, pathFor_DynamicDevicePortAsync, pathFor_DynamicRegisterAsync, PortWithConnection, pathFor_PortWithConnection, };
