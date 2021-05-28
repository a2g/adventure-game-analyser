
export enum Verb {
    Use,
    Grab,
    Toggle
}

export class VerbClass {
    constructor(verb:Verb) {
        this.verb = verb;
    }

    Is(verb:Verb): boolean {
        return this.verb === verb;
    }

    IsUse(): boolean {
        return this.Is(Verb.Use);
    }

    IsGrab(): boolean {
        return this.Is(Verb.Grab);
    }

    IsToggle(): boolean {
        return this.Is(Verb.Toggle);
    }

    verb: Verb;
}