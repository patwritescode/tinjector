export default class PropertyMeta {
    constructor(propName: string, propType: string) {
        this.propName = propName;
        this.propType = propType;
    }
    propName: string;
    propType: string;
}