import { Raw } from "./Raw";
import { GetDisplayName } from "./GetDisplayName";

export class RawObjectsAndVerb {
    Dump() {
        const enumAsInt = parseInt(this.type.toString(), 10);
        if (enumAsInt>=0) {
            console.log(GetDisplayName(Raw[enumAsInt]) + " " + GetDisplayName(this.objectA) + " " + GetDisplayName(this.objectB));
        } else {
            console.log("Raw type was invalid");
        }
       
    }

    constructor(type: Raw, objectA: string, objectB: string) {
        this.type = type;
        this.objectA = objectA;
        this.objectB = objectB;
    }
 
    type: Raw; 
    objectA: string;
    objectB: string;
}
