import { PlayerAI } from "./PlayerAI";
import { RowOfSheet } from "./RowOfSheet";
import { GetThreeStringsFromCommand } from "./GetThreeStringsFromCommand";
import { GameRuleEnforcerCallbacksInterface } from "./GameRuleEnforcerCallbacksInterface";
import { SolutionNodeMap } from "./SolutionNodeMap";
import { SolutionNode } from "./SolutionNode";
import { Data } from "./Data";
import { VerbClass } from "./VerbClass";
import { TwoObjects } from "./TwoObjects";


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
    constructor() {
        this.listOfItems = new Array<string>();
        this.listOfActions = new Array<string>();
        this.listOfItemVisibilities = new Array<boolean>();
        this.listOfActionVisibilities = new Array<boolean>();
        this.itemVsItemHandlers = new Array<Array<Array<SolutionNode>>>();
        this.actionVsItemHandlers = new Array<Array<Array<SolutionNode>>>();
        this.callbacks = new PlayerAI(this);
    }

    Initialize(data: Data){

    }

    ExecuteCommand(verb:VerbClass, twoObjects:TwoObjects): void {

        const reaction = Data.GetReactionDetailsIfAny(verb, twoObjects);

        if (reaction) {
            reaction.
            for (let i = 0; i < scriptsToRun.length; i++) {
                const script = scriptsToRun[i];
                if (script !== "none" && script !== "") {
                    const header = "game.";
                    eval(header + script);
                }
            }
        } else {
            const header = "game.";
            const script = "Say(\"That doesn't work\")";
            eval(header + script);
        }
    }

    GetIndexOfAction(Action: string): number {
        const indexOfAction: number = this.listOfActions.indexOf(Action);
        return indexOfAction;
    }

    GetIndexOfItem(item: string): number {
        const indexOfItem: number = this.listOfItems.indexOf(item);
        return indexOfItem;
    }

    GetAction(i: number): string {
        const name: string = i >= 0 ? this.GetActionsExcludingUse()[i][0] : "use";
        return name;
    }

    GetItem(i: number): string {
        const name: string = i >= 0 ? this.GetEntireItemSuite()[i][0] : "-1 lookup in GetItem";
        return name;
    }

    SubscribeToCallbacks(callbacks: GameRuleEnforcerCallbacksInterface) {
        this.callbacks = callbacks;
    }

    GetActionsExcludingUse(): Array<[string, boolean]> {
        const toReturn = new Array<[string, boolean]>();
        this.listOfActions.forEach(function (Action) {
            toReturn.push([Action, true]);
        });
        return toReturn;
    }

    GetEntireItemSuite(): Array<[string, boolean]> {
        const toReturn = new Array<[string, boolean]>();
        for (let i = 0; i < this.listOfItems.length; i++) {
            toReturn.push([this.listOfItems[i], this.listOfItemVisibilities[i]]);
        }
        return toReturn;
    }

    GetCurrentVisibleInventory(): Array<string> {
        const toReturn = new Array<string>();
        for (let i = 0; i < this.listOfItems.length; i++) {
            if (this.listOfItems[i].toLowerCase().startsWith("i") && this.listOfItemVisibilities[i] === true)
                toReturn.push(this.listOfItems[i]);
        }
        return toReturn;
    }

    GetCurrentVisibleScene(): Array<string> {
        const toReturn = new Array<string>();
        for (let i = 0; i < this.listOfItems.length; i++) {
            if (this.listOfItems[i].toLowerCase().startsWith("o") && this.listOfItemVisibilities[i] === true)
                toReturn.push(this.listOfItems[i]);
        }
        return toReturn;
    }

    ShowOrHide(name: string, newVisibility: boolean) {
        const index: number = this.GetIndexOfItem(name);
        if (index !== -1) {
            // call callback
            this.listOfItemVisibilities[index] = newVisibility;
            this.callbacks.OnItemVisbilityChange(index, newVisibility, name);
        }
    }

    public static GetInstance(): GameRuleEnforcer {
        if (!GameRuleEnforcer.instance) {
            GameRuleEnforcer.instance = new GameRuleEnforcer();
        }
        return GameRuleEnforcer.instance;
    }
    private static instance: GameRuleEnforcer;


    private callbacks: GameRuleEnforcerCallbacksInterface;
    private listOfItems: Array<string>;//array of string boolean tuples
    private listOfActions: Array<string>;//array of string boolean tuples
    private listOfItemVisibilities: Array<boolean>;//array of string boolean tuples
    private listOfActionVisibilities: Array<boolean>;//array of string boolean tuples
    private itemVsItemHandlers: Array<Array<Array<SolutionNode>>>;// a 2d array where each cell contains a list of strings.
    private actionVsItemHandlers: Array<Array<Array<SolutionNode>>>;// a 2d array where each cell contains a list of strings.

}

