import { Happening } from "./Happening";

export class Happenings {
    constructor() {
        this.verb = "";
        this.text = "";
        this.array = new Array<Happening>();
    }
    verb: string;
    text: string;
    array: Array<Happening>; 
}