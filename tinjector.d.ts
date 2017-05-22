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
