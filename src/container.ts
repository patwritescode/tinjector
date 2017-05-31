import Registration from "./registration";
export default class Container {
    private registrations: Array<Registration> = [];
    private currentRegistration: Registration;
    register<T extends Function>(objectToRegister: T): Container {
        if(!objectToRegister || typeof(objectToRegister) != "function") throw `You must pass a valid class.`;
        this.currentRegistration = new Registration(objectToRegister);
        return this;
    }
    as<T extends Function>(rtinterface:  T): Container {
        if (!this.currentRegistration) throw `You have not registered a class yet`;
        if(!rtinterface || typeof(rtinterface) != "function") throw `You must pass a valid class.`;
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
        if(resolvedRegistration.singletonReference) {
            return resolvedRegistration.singletonReference as T;
        }
        return Reflect.construct(resolvedRegistration.registeredObject as Function, []) as T;
    }
}

export const container = new Container();