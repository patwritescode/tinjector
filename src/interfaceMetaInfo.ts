export default class InterfaceMetaInfo {
    constructor(name: string, required: Array<string>) {
        this.name = name;
        this.required = required;
    }
    name: string;
    required: Array<string>;
}