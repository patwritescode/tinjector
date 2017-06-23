import { Registration } from "./Models";

export class Container {
    private registrations: Array<Registration> = [];

    registerAbstraction<T, U extends T>(
        abstractClass: (new (...args: any[]) => T),
        implementedClass: { new (): U; },
        singleton: boolean = false): Container {
        let registration = new Registration();
        registration.RegisteredClass = implementedClass;
        registration.RegisteredInterface = abstractClass;
        this.registrations.push(registration);
        return this;
    }

    registerClass<T>(implementedClass: { new (): T }, singleton: boolean = false): Container {
        let registration = new Registration();
        registration.RegisteredClass = implementedClass;
        registration.SingletonReference = singleton ? this.createInstance(implementedClass) : null;
        this.registrations.push(registration);
        return this;
    }

    private createInstance<T>(classType: {new (): T} | Function): Function {
        return Reflect.construct(classType, []);
    }

    resolve<T extends Function>(itemToResolve: (new (...args: any[]) => T) | Function): T {
        const resolvedRegistration = this.registrations.filter(registration => registration.RegisteredClass == itemToResolve || registration.RegisteredInterface == itemToResolve)[0];
        return this.createInstance(resolvedRegistration.RegisteredClass) as T;
    }
}

export const container: Container = new Container();

abstract class IPerson {
    abstract doSomething(): void;
}

class Person implements IPerson {
    doSomething(): void {
        console.log("test");
    }
}

class OtherClass {

}

container.registerAbstraction(OtherClass, Person);
