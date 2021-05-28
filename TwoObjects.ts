export class TwoObjectsAndAVerb {
    constructor(objectA: string, objectB: string) {
        this.objectA = objectA;
        this.objectB = objectB;
    }

    Match(objectA: string | undefined, objectB: string | undefined = undefined): boolean {
        if (this.objectA === objectA && this.objectB === objectB)
            return true;
        if (this.objectA === objectB && this.objectB === objectA)
            return true;
        return false;
    }

    objectA: string | undefined;
    objectB: string | undefined;
}
