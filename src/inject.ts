import {container} from "./container";
export default function inject(target: Function | any, key?: string) {
    let types = null;
    if (key) {
        types = Reflect.getMetadata("design:paramtypes", target, key);
    }
    else {
        types = Reflect.getMetadata("design:paramtypes", target);
        // create a new copy of the constructor with the parameters fulfilled
        // TODO: bind on types instead of just static test
        const newConstructor: any = () => {
            const newObj = new target(container.resolve(Date));
            return newObj;
        }
        newConstructor.prototype = target.prototype;
        return newConstructor;
    }
    var typeString = types.map(a => a.name).join();
    console.log(`${key || target.name} param types: ${typeString}`);
}