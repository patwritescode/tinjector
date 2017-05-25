export declare class MetaData {
    constructor(childName: string, interfaceClass: InterfaceMetaInfo);
    childName: string;
    interfaceClass: InterfaceMetaInfo;
}
export declare class InterfaceMetaInfo {
    constructor(name: string, required: Array<string>);
    name: string;
    required: Array<string>;
}
export declare class RuntimeInterface {
    protected metaData: MetaData;
    constructor();
    buildMeta(instance: Array<string>, metaData: MetaData, child: object): MetaData;
}
export declare class Container {
    private registrations;
    private currentRegistration;
    register(objectToRegister: object): Container;
    as(rtinterface: object): Container;
    singleton(): void;
    instancePerLifetimeScope(): void;
    resolve<T>(objToResolve: {
        new (): T;
    }): T;
}
export declare function inject(target: Function | any, key?: string): any;
export declare const container: Container;
