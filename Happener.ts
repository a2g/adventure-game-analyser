import { PlayerAI } from "./PlayerAI";
import { HappenerCallbacksInterface } from "./HappenerCallbacksInterface";
import { Data } from "./Data";
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

export class GameRuleEnforcer {
    public readonly Examine = 0;

    private callbacks: HappenerCallbacksInterface;
    private listOfInvs: Array<string>;//array of string boolean tuples
    private listOfProps: Array<string>;//array of string boolean tuples
    private listOfVerbs: Array<string>;//array of string boolean tuples
    private listOfInvVisibilities: Array<boolean>;//array of string boolean tuples
    private listOfPropVisibilities: Array<boolean>;//array of string boolean tuples
    private listOfVerbVisibilities: Array<boolean>;//array of string boolean tuples


    constructor() {
        this.listOfInvs = new Array<string>();
        this.listOfProps = new Array<string>();
        this.listOfVerbs = new Array<string>();
        
        this.listOfInvVisibilities = new Array<boolean>();
        this.listOfPropVisibilities = new Array<boolean>();
        this.listOfVerbVisibilities = new Array<boolean>(); 
        this.callbacks = new PlayerAI(this);
    }

    Initialize(data: Data){
        this.listOfInvs = Data.GetArrayOfInvs();
        this.listOfProps = Data.GetArrayOfProps();
        this.listOfVerbs = Data.GetArrayOfSingleObjectVerbs();
        this.listOfVerbVisibilities = Data.GetArrayOfVisibilitiesOfSingleObjectVerbs();
    }

    ExecuteCommand(objects: MixedObjectsAndVerb): void {
       
        const happenings = Data.GetHappeningsIfAny(objects);
        if (happenings) {
            console.log(happenings.text);
            happenings.array.forEach((happening) => {
                switch (happening.happen) {
                    case Happen.InvAppears:
                        this.callbacks.OnInvVisbilityChange(this.GetIndexOfInv(happening.item), true, happening.item)
                        break;
                    case Happen.InvGoes:
                        this.callbacks.OnInvVisbilityChange(this.GetIndexOfInv(happening.item), false, happening.item)
                        break;
                    case Happen.PropAppears:
                        this.callbacks.OnPropVisbilityChange(this.GetIndexOfProp(happening.item), true, happening.item)
                        break;
                    case Happen.PropGoes:
                        this.callbacks.OnPropVisbilityChange(this.GetIndexOfProp(happening.item), false, happening.item)
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

    GetIndexOfProp(item: string): number {
        const indexOfProp: number = this.listOfProps.indexOf(item);
        return indexOfProp;
    }

    GetVerb(i: number): string {
        const name: string = i >= 0 ? this.GetVerbsExcludingUse()[i][0] : "use";
        return name;
    }

    GetInv(i: number): string {
        const name: string = i >= 0 ? this.GetEntireInvSuite()[i][0] : "-1 lookup in GetItem";
        return name;
    }

    GetProp(i: number): string {
        const name: string = i >= 0 ? this.GetEntirePropSuite()[i][0] : "-1 lookup in GetItem";
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

    /*
    ShowOrHide(name: string, newVisibility: boolean) {
        const index: number = this.GetIndexOfItem(name);
        if (index !== -1) {
            // call callback
            this.listOfPropVisibilities[index] = newVisibility;
            this.callbacks.OnItemVisbilityChange(index, newVisibility, name);
        }
    }*/

    public static GetInstance(): GameRuleEnforcer {
        if (!GameRuleEnforcer.instance) {
            GameRuleEnforcer.instance = new GameRuleEnforcer();
        }
        return GameRuleEnforcer.instance;
    }
    private static instance: GameRuleEnforcer;



}

