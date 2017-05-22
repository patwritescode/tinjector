class MetaData {
    constructor(childName: string, interfaceClass: InterfaceMetaInfo) {
        this.childName = childName;
        this.interfaceClass = interfaceClass;
    }
    childName: string;
    interfaceClass: InterfaceMetaInfo;
}

class InterfaceMetaInfo {
    constructor(name: string, required: Array<string>) {
        this.name = name;
        this.required = required;
    }
    name: string;
    required: Array<string>;
}

class RuntimeInterface {
    protected metaData: MetaData;
    constructor() {
        this.metaData = new MetaData(this.constructor.name, new InterfaceMetaInfo("RuntimeInterface", []));
        this.buildMeta([], this.metaData, this);
    }

    buildMeta(instance: Array<string>, metaData: MetaData, child: object): MetaData {
        const props = Object.getOwnPropertyNames(child) || [];
        // Check if next child is base Interface
        if (Reflect.getPrototypeOf(child).constructor.name === "RuntimeInterface") {
            metaData.interfaceClass.name = child.constructor.name;
            // Make sure the interface is not being explicitly created.
            if (metaData.childName == child.constructor.name) {
                throw `Cannot initialize interface ${metaData.childName}`;
            }
            // Check for missing interface implementations after walking the inheritance chain.
            const mismatch: Array<string> = [];
            for (const key in props) {
                const propKey = props[key];
                if (propKey !== "constructor") {
                    metaData.interfaceClass.required.push(propKey);
                    if (instance.indexOf(propKey) < 0) {
                        mismatch.push(propKey);
                    }
                }
            }
            // If there are any mismatches then the interface isn't properly implemented.
            if (mismatch.length > 0) {
                throw `${metaData.childName} does not properly implement ${mismatch}`;
            }
            return;
        }
        else {
            // Catalog the properties of the child classes
            for (const key in props) {
                const propKey = props[key];
                if (propKey !== "constructor") {
                    instance.push(propKey);
                }
            }
        }
        // if there is another child in the inheritance chain continue down the chain.
        const nextChild = Reflect.getPrototypeOf(child);
        if (nextChild) {
            return this.buildMeta(instance, metaData, nextChild);
        }
        return metaData;
    }
}
class Registration {
    constructor(objectToRegister: object) {
        this.registeredObject = objectToRegister;
    }
    public registeredObject: object;
    public registeredRTInterface: object;
    public singletonReference: Function;
}

export class Container {
    private registrations: Array<Registration> = [];
    private currentRegistration: Registration;
    register(objectToRegister: object): Container {
        this.currentRegistration = new Registration(objectToRegister);
        return this;
    }
    as(rtinterface: object): Container {
        if (!this.currentRegistration) throw `You have not registered a class yet`;
        this.currentRegistration.registeredRTInterface = rtinterface;
        return this;
    }
    singleton(): void {
        if (!this.currentRegistration) throw `You have not registered a class yet`;
        this.currentRegistration.singletonReference = Reflect.construct(this.currentRegistration.registeredObject as Function, []);
        this.registrations.push(this.currentRegistration);
    }

    instancePerLifetimeScope(): void {
        if (!this.currentRegistration) throw `You have not registered a class yet`;
        this.registrations.push(this.currentRegistration);
    }

    resolve<T>(objToResolve: { new (): T; }): T {
        if (!objToResolve) throw `Valid class or RuntimeInterface required.`;
        const resolvedRegistration = this.registrations.filter(r => r.registeredObject == objToResolve || r.registeredRTInterface == objToResolve)[0];
        if (!resolvedRegistration) {
            throw `${objToResolve.name} is not registered as a class or RuntimeInterface`;
        }
        else if (objToResolve == resolvedRegistration.registeredObject && resolvedRegistration.registeredRTInterface) {
            throw `You must resolve ${objToResolve.name} through its registered RuntimeInterface`;
        }
        return Reflect.construct(resolvedRegistration.registeredObject as Function, []) as T;
    }
}

export function inject(target: Function | any, key?: string) {
    let types = null;
    if (key) {
        types = Reflect.getMetadata("design:paramtypes", target, key);
    }
    else {
        types = Reflect.getMetadata("design:paramtypes", target);
        // create a new copy of the constructor with the parameters fulfilled
        // TODO: bind on types instead of just static test
        const newConstructor: any = () => {
            // const newObj = new target(container.resolve(IDataApi));
            // return newObj;
        }
        newConstructor.prototype = target.prototype;
        return newConstructor;
    }
    var typeString = types.map(a => a.name).join();
    console.log(`${key || target.name} param types: ${typeString}`);
}

export const container = new Container();