import { PlayerAI } from "./PlayerAI";
import { HappenerCallbacksInterface } from "./HappenerCallbacksInterface";
import { Scenario } from "./Scenario";
import { MixedObjectsAndVerb } from "./MixedObjectsAndVerb";
import { Happen } from "./Happen";


// April 2021
// The blind / location - agnostic way to find solutions is to have an inv vs props table, and inv vs inv table, and a verb vs props table, and a verb vs invs table, then
// 1. Check the invs vs invs ? this is the lowest hanging fruit
// 2. Check the verbs vs invs ? this is the second lowest hanging fruit - if find something then go to 1.
// 3. Check the invs vs props ? this is the third lowest hanging fruit - if find a new inv, then go to 1.
// 3. Check the verbs vs props ? this is the fourth lowest hanging truit - if find something, then go to 1.
// 4. Ensure there is no PROPS VS PROPS because:
//     A.unless we  give the AI knowledge of locations, then a blind  brute force would take forever.
//     B.even if we did have knowledge of locations, it would mean creating a truth table per location...which is easy - and doable.hmmn. 
//
// May 2021, regarding point number 4... Some puzzles are just like that, eg use hanging cable in powerpoint.
// // even in maniac mansion it was like use radtion suit with meteot etc.
//

export class Happener {
    public readonly Examine = 0;

    private callbacks: HappenerCallbacksInterface;
    private listOfInvs: Array<string>;
    private listOfProps: Array<string>;
    private listOfVerbs: Array<string>;
    private listOfRegs: Array<string>;
    private listOfInvVisibilities: Array<boolean>;
    private listOfPropVisibilities: Array<boolean>;
    private listOfVerbVisibilities: Array<boolean>;
    private listOfRegsThatAreTrue: Array<boolean>;


    constructor() {
        this.listOfInvs = new Array<string>();
        this.listOfRegs = new Array<string>();
        this.listOfProps = new Array<string>();
        this.listOfVerbs = new Array<string>();
        
        
        this.listOfInvVisibilities = new Array<boolean>();
        this.listOfPropVisibilities = new Array<boolean>();
        this.listOfVerbVisibilities = new Array<boolean>(); 
        this.listOfRegsThatAreTrue = new Array<boolean>();
        this.callbacks = new PlayerAI(this, 0);
    }

    Initialize(data: Scenario){
        this.listOfInvs = Scenario.GetArrayOfInvs();
        this.listOfRegs = Scenario.GetArrayOfRegs();
        this.listOfProps = Scenario.GetArrayOfProps();
        this.listOfVerbs = Scenario.GetArrayOfSingleObjectVerbs();
        this.listOfInvVisibilities = Scenario.GetArrayOfInvVisibilities();
        this.listOfPropVisibilities = Scenario.GetArrayOfPropVisibilities();
        this.listOfVerbVisibilities = Scenario.GetArrayOfVisibilitiesOfSingleObjectVerbs();
        this.listOfRegsThatAreTrue = Scenario.GetArrayOfRegStartingValues();
    }

    SetRegValue(reg: string, value: boolean): void {
        const index = this.GetIndexOfReg(reg);
        this.listOfRegsThatAreTrue[index] = value;
    }

    SetInvVisible(inv: string, value: boolean): void {
        const index = this.GetIndexOfInv(inv);
        this.listOfInvVisibilities[index] = value;
    }

    SetPropVisible(prop: string, value: boolean): void {
        const index = this.GetIndexOfProp(prop);
        this.listOfPropVisibilities[index] = value;
    }

    ExecuteCommand(objects: MixedObjectsAndVerb): void {
       
        const happenings = Scenario.GetHappeningsIfAny(objects);
        if (happenings) {
            console.log(happenings.text);
            happenings.array.forEach((happening) => {
                // one of these will be wrong - but we won't use the wrong one :)
                const prop = this.GetIndexOfProp(happening.item);
                const inv = this.GetIndexOfInv(happening.item);

                switch (happening.happen) {
                    case Happen.InvAppears:
                        this.listOfInvVisibilities[inv] = true;
                        this.callbacks.OnInvVisbilityChange(inv, true, happening.item)
                        break;
                    case Happen.InvGoes:
                        this.listOfInvVisibilities[inv] = false;
                        this.callbacks.OnInvVisbilityChange(inv, false, happening.item)
                        break;
                    case Happen.PropAppears:
                        this.listOfPropVisibilities[prop] = true;
                        this.callbacks.OnPropVisbilityChange(prop, true, happening.item)
                        break;
                    case Happen.PropGoes:
                        this.listOfPropVisibilities[prop] = false;
                        this.callbacks.OnPropVisbilityChange(prop, false, happening.item)
                        break;
                }
            });
        } else {
            console.log("Nothing happened");
        }
    }

    GetIndexOfVerb(verb: string): number {
        const indexOfVerb: number = this.listOfVerbs.indexOf(verb);
        return indexOfVerb;
    }

    GetIndexOfInv(item: string): number {
        const indexOfInv: number = this.listOfInvs.indexOf(item);
        return indexOfInv;
    }


    GetIndexOfReg(item: string): number {
        const indexOfReg: number = this.listOfRegs.indexOf(item);
        return indexOfReg;
    }

    GetIndexOfProp(item: string): number {
        const indexOfProp: number = this.listOfProps.indexOf(item);
        return indexOfProp;
    }

    GetVerb(i: number): string {
        const name: string = i >= 0 ? this.GetVerbsExcludingUse()[i][0] : "use";
        return name;
    }

    GetInv(i: number): string {
        const name: string = i >= 0 ? this.GetEntireInvSuite()[i][0] : "-1 lookup in GetInv";
        return name;
    }

    GetProp(i: number): string {
        const name: string = i >= 0 ? this.GetEntirePropSuite()[i][0] : "-1 lookup in GetProp";
        return name;
    }

    GetReg(i: number): string {
        const name: string = i >= 0 ? this.GetEntireInvSuite()[i][0] : "-1 lookup for GetReg";
        return name;
    }

    SubscribeToCallbacks(callbacks: HappenerCallbacksInterface) {
        this.callbacks = callbacks;
    }

    GetVerbsExcludingUse(): Array<[string, boolean]> {
        const toReturn = new Array<[string, boolean]>();
        this.listOfVerbs.forEach(function (Verb) {
            toReturn.push([Verb, true]);
        });
        return toReturn;
    }

    GetEntireRegSuit(): Array<[string, boolean]> {
        const toReturn = new Array<[string, boolean]>();
        for (let i = 0; i < this.listOfProps.length; i++) {
            toReturn.push([this.listOfRegs[i], this.listOfRegsThatAreTrue[i]]);
        }
        return toReturn;
    }

    GetEntirePropSuite(): Array<[string, boolean]> {
        const toReturn = new Array<[string, boolean]>();
        for (let i = 0; i < this.listOfProps.length; i++) {
            toReturn.push([this.listOfProps[i], this.listOfPropVisibilities[i]]);
        }
        return toReturn;
    }

    GetEntireInvSuite(): Array<[string, boolean]> {
        const toReturn = new Array<[string, boolean]>();
        for (let i = 0; i < this.listOfInvs.length; i++) {
            toReturn.push([this.listOfInvs[i], this.listOfInvVisibilities[i]]);
        }
        return toReturn;
    }

    GetCurrentVisibleInventory(): Array<string> {
        const toReturn = new Array<string>();
        for (let i = 0; i < this.listOfInvs.length; i++) {
            if (this.listOfInvVisibilities[i] === true)
                toReturn.push(this.listOfInvs[i]);
        }
        return toReturn;
    }

    GetCurrentVisibleProps(): Array<string> {
        const toReturn = new Array<string>();
        for (let i = 0; i < this.listOfProps.length; i++) {
            if ( this.listOfPropVisibilities[i] === true)
                toReturn.push(this.listOfProps[i]);
        }
        return toReturn;
    }

    GetCurrentlyTrueRegs(): Array<string>{
        const toReturn = new Array<string>();
        for (let i = 0; i < this.listOfRegs.length; i++) {
            if (this.listOfRegsThatAreTrue[i] === true)
                toReturn.push(this.listOfRegs[i]);
        }
        return toReturn;
    }

    public static GetInstance(): Happener {
        if (!Happener.instance) {
            Happener.instance = new Happener();
        }
        return Happener.instance;
    }
    private static instance: Happener;



}

