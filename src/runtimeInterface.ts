import InterfaceMetaInfo from "./interfaceMetaInfo";
import MetaData from "./metaData";

export default class RuntimeInterface {
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