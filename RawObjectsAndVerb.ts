import { Raw } from "./Raw";
import { GetDisplayName } from "./GetDisplayName";

export class RawObjectsAndVerb {
    constructor(type: Raw, objectA: string, objectB: string, restriction: Array<string>) {
        this.type = type;
        this.objectA = objectA;
        this.objectB = objectB;
        this.startingCharacterForA = "";
        this.startingCharacterForB = "";
        this.restriction = restriction;
    }

    WriteToConsole() {
        const enumAsInt = parseInt(this.type.toString(), 10);
        if (enumAsInt >= 0) {
            const verb = GetDisplayName(Raw[enumAsInt]);
            const objectA = GetDisplayName(this.objectA) +  GetDisplayName(this.startingCharacterForA, true);
            const objectB = GetDisplayName(this.objectB) + GetDisplayName(this.startingCharacterForB, true);
            const restriction =  this.restriction.length ? "(" + GetDisplayName(this.restriction) + ")" : "";
            console.log(verb + " " + objectA + " " + objectB + " " + restriction);
        } else {
            console.log("Raw type was invalid");
        }
    }

    private getDisplayName(object: string, char: string) {
        GetDisplayName(object) + char.length ? "(" + GetDisplayName(char) + ")" : "";
    }

    public appendStartingCharacterForA(startingCharacterForA: string) {
        if (this.startingCharacterForA.length > 0)
            this.startingCharacterForA += ", " + startingCharacterForA;
        else 
            this.startingCharacterForA = startingCharacterForA;
    }

    public appendStartingCharacterForB(startingCharacterForB: string) {
        if (this.startingCharacterForB.length > 0)
            this.startingCharacterForB += ", " + startingCharacterForB;
        else
            this.startingCharacterForB = startingCharacterForB;
    }
 
    type: Raw; 
    objectA: string;
    objectB: string;
    startingCharacterForA: string;
    startingCharacterForB: string;
    restriction: Array<string>;
}
