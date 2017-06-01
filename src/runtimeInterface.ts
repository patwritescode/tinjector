
import PropertyMeta from "./propertyMeta";

// export interface IRuntimeInterface {
//     metaData: MetaData;
// }

export abstract class RuntimeInterface{
    constructor() {
        this.buildMeta([], {}, this);
    }

    private buildMeta(instance: Array<string>, metaData: any, child: object): void {
        const props = Object.getOwnPropertyNames(child) || [];
        // Check if next child is base Interface
        if (Reflect.getPrototypeOf(child).constructor.name === "RuntimeInterface") {
            metaData.interfaceClass.name = child.constructor.name;
            // Make sure the interface is not being explicitly created - for non-typescript use.
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
            this.buildMeta(instance, metaData, nextChild);
        }
    }
}

// declare as a definition (runtime interface)
export function definition(target: Function | any, key?: string) {
    const propertyTypes = Reflect.getMetadata("design:properties", target);
    var s = propertyTypes.map(a => `prop: ${a.propName} is ${a.propType}`).join();
    console.log(`param types: ${s}`);
}

// add the property to the definitions meta data
export function define(target: object, propertyKey: string) {
      var propertyType = Reflect.getMetadata("design:type", target, propertyKey);
      const columns: Array<PropertyMeta> = Reflect.getMetadata("design:properties", target.constructor) || [];
      columns.push(new PropertyMeta(propertyKey, propertyType.name));
      Reflect.defineMetadata("design:properties", columns, target.constructor);
}