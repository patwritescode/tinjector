import InterfaceMetaInfo from "./interfaceMetaInfo";

export default class MetaData {
    constructor(childName: string, interfaceClass: InterfaceMetaInfo) {
        this.childName = childName;
        this.interfaceClass = interfaceClass;
    }
    childName: string;
    interfaceClass: InterfaceMetaInfo;
}