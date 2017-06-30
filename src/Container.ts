import { Registration } from "./Models";

export class Container {
    private registrations: Array<Registration> = [];

    private createInstance<T extends object>(classType: {new (): T} | Function): T {
        return Reflect.construct(classType, []);
    }

    private isItemRegistered(item: any) : boolean {
        const registrationMatch = this.registrations.filter(registration => registration.RegisteredInterface == item || registration.RegisteredClass == item)[0];
        return registrationMatch != null;
    }

    registerAbstraction<T, U extends T>(abstractClass: (new (...args: any[]) => T) | Function, implementedClass: { new (...args: any[]): U; }, singleton: boolean = false): Container {
        const existingRegistration = this.registrations
            .filter(existingRegistration => 
                existingRegistration.RegisteredClass == implementedClass || 
                existingRegistration.RegisteredInterface == abstractClass);
        if(this.isItemRegistered(abstractClass)) throw `You cannot register an abstract class twice`;
        if(this.isItemRegistered(implementedClass)) throw `You cannot register an implemented class twice`;
        const registration = new Registration();
        registration.RegisteredClass = implementedClass;
        registration.RegisteredInterface = abstractClass;
        this.registrations.push(registration);
        return this;
    }

    registerClass<T>(implementedClass: { new (): T }, singleton: boolean = false): Container {
        if(this.isItemRegistered(implementedClass)) throw `You cannot register a class more than once`;
        const registration = new Registration();
        registration.RegisteredClass = implementedClass;
        registration.SingletonReference = singleton ? this.createInstance(implementedClass) : null;
        this.registrations.push(registration);
        return this;
    }

    resolve<T>(itemToResolve: (new (...args: any[]) => T) | Function): T {
        const resolvedRegistration = this.registrations.filter(registration => registration.RegisteredClass == itemToResolve || registration.RegisteredInterface == itemToResolve)[0];
        if(!resolvedRegistration) throw `No matching implementation was registered.`;
        return this.createInstance(resolvedRegistration.RegisteredClass as Function) as T;
    }
}

export const container: Container = new Container();