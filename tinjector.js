class MetaData {
    constructor(childName, interfaceClass) {
        this.childName = childName;
        this.interfaceClass = interfaceClass;
    }
}
class InterfaceMetaInfo {
    constructor(name, required) {
        this.name = name;
        this.required = required;
    }
}
class RuntimeInterface {
    constructor() {
        this.metaData = new MetaData(this.constructor.name, new InterfaceMetaInfo("RuntimeInterface", []));
        this.buildMeta([], this.metaData, this);
    }
    buildMeta(instance, metaData, child) {
        const props = Object.getOwnPropertyNames(child) || [];
        // Check if next child is base Interface
        if (Reflect.getPrototypeOf(child).constructor.name === "RuntimeInterface") {
            metaData.interfaceClass.name = child.constructor.name;
            // Make sure the interface is not being explicitly created.
            if (metaData.childName == child.constructor.name) {
                throw `Cannot initialize interface ${metaData.childName}`;
            }
            // Check for missing interface implementations after walking the inheritance chain.
            const mismatch = [];
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
    constructor(objectToRegister) {
        this.registeredObject = objectToRegister;
    }
}
export class Container {
    constructor() {
        this.registrations = [];
    }
    register(objectToRegister) {
        this.currentRegistration = new Registration(objectToRegister);
        return this;
    }
    as(rtinterface) {
        if (!this.currentRegistration)
            throw `You have not registered a class yet`;
        this.currentRegistration.registeredRTInterface = rtinterface;
        return this;
    }
    singleton() {
        if (!this.currentRegistration)
            throw `You have not registered a class yet`;
        this.currentRegistration.singletonReference = Reflect.construct(this.currentRegistration.registeredObject, []);
        this.registrations.push(this.currentRegistration);
    }
    instancePerLifetimeScope() {
        if (!this.currentRegistration)
            throw `You have not registered a class yet`;
        this.registrations.push(this.currentRegistration);
    }
    resolve(objToResolve) {
        if (!objToResolve)
            throw `Valid class or RuntimeInterface required.`;
        const resolvedRegistration = this.registrations.filter(r => r.registeredObject == objToResolve || r.registeredRTInterface == objToResolve)[0];
        if (!resolvedRegistration) {
            throw `${objToResolve.name} is not registered as a class or RuntimeInterface`;
        }
        else if (objToResolve == resolvedRegistration.registeredObject && resolvedRegistration.registeredRTInterface) {
            throw `You must resolve ${objToResolve.name} through its registered RuntimeInterface`;
        }
        return Reflect.construct(resolvedRegistration.registeredObject, []);
    }
}
export function inject(target, key) {
    let types = null;
    if (key) {
        types = Reflect.getMetadata("design:paramtypes", target, key);
    }
    else {
        types = Reflect.getMetadata("design:paramtypes", target);
        // create a new copy of the constructor with the parameters fulfilled
        // TODO: bind on types instead of just static test
        const newConstructor = () => {
            // const newObj = new target(container.resolve(IDataApi));
            // return newObj;
        };
        newConstructor.prototype = target.prototype;
        return newConstructor;
    }
    var typeString = types.map(a => a.name).join();
    console.log(`${key || target.name} param types: ${typeString}`);
}
export const container = new Container();
//# sourceMappingURL=tinjector.js.map