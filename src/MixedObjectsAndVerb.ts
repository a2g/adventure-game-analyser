import { Mix } from "./Mix";

export class MixedObjectsAndVerb {

    constructor(type: Mix, verb: string, objectA: string, objectB: string, typeForDebug:string) {
        this.type = type;
        this.verb = verb.toLowerCase()
        this.objectA = objectA;
        this.objectB = objectB;
        this.typeForDebug = typeForDebug;
    }

    Match(verb: string, objectA: string | undefined, objectB: string | undefined): boolean {
        verb = verb.toLowerCase();
        if (this.verb === verb && this.objectA === objectA && this.objectB === objectB)
            return true;
        if (this.verb === verb && this.objectA === objectB && this.objectB === objectA)
            return true;
        return false;
    }
    type: Mix;
    verb: string;
    objectA: string;
    objectB: string;
    typeForDebug: string;
}
