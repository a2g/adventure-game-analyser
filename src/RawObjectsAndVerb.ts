import { Raw } from "./Raw";
import { GetDisplayName } from "./GetDisplayName";
import { Colors } from "./Colors";
import { Embracketize } from "./Embracketize";

export class RawObjectsAndVerb {
    constructor(type: Raw, objectA: string, objectB: string, restrictions: Array<string>, typeJustForDebugging: string) {
        this.type = type;
        this.objectA = objectA;
        this.objectB = objectB;
        this.startingCharacterForA = "";
        this.startingCharacterForB = "";
        this.restrictions = restrictions;
        this.typeJustForDebugging = typeJustForDebugging;
    }

    WriteToConsole() {
        const enumAsInt = parseInt(this.type.toString(), 10);
        if (enumAsInt >= 0) {
            const verb = GetDisplayName(Raw[enumAsInt]);
            const objectA = GetDisplayName(this.objectA) + GetDisplayName(this.startingCharacterForA, true);
            const objectB = GetDisplayName(this.objectB) + GetDisplayName(this.startingCharacterForB, true);

            const restriction = this.restrictions.length ? Embracketize(GetDisplayName(this.restrictions)) : "";
            let joiner = " ";
            switch (enumAsInt) {
                case Raw.Use: joiner = " with "; break;
                case Raw.Toggle: joiner = " to "; break;
                case Raw.Auto: joiner = " becomes "; break;
            }
            console.log(verb + " " + objectA + joiner + objectB + " " + restriction);
        } else {
            console.log("Raw type was invalid");
        }
    }

    private getDisplayName(object: string, char: string) {
        GetDisplayName(object) + Colors.Reset + char.length ? Embracketize(GetDisplayName(char)) : "";
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
    restrictions: Array<string>;
    typeJustForDebugging: string;
}
