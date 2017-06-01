import {container} from "./container";
export function inject(target: Function | any, key?: string): any {
    let types = null;
    // is a prop inject
    if (key) {
        types = Reflect.getMetadata("design:paramtypes", target, key);
    }
    // is a constructor inject
    else {
        types = Reflect.getMetadata("design:paramtypes", target);
        // create a new copy of the constructor with the parameters fulfilled
        const original = target;
        const newConstructor = function(...args) {
            return original.apply(this, types.map(type => container.resolve(type)));
        }
        newConstructor.prototype = original.prototype;
        return newConstructor;
    }
}