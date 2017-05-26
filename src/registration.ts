export default class Registration {
    constructor(objectToRegister: object) {
        this.registeredObject = objectToRegister;
    }
    public registeredObject: object;
    public registeredRTInterface: object;
    public singletonReference: any;
}