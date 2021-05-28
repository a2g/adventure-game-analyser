import { TruthTable } from './TruthTable';
import { GameRuleEnforcer } from './GameRuleEnforcer';
import {
    GameRuleEnforcerCallbacksInterface
} from './GameRuleEnforcerCallbacksInterface';
import { VerbClass } from './VerbClass';

export class PlayerAI implements GameRuleEnforcerCallbacksInterface {

    itemActionCommmandsTried: TruthTable;
    useCommmandsTried: TruthTable;
    game: GameRuleEnforcer;
    autoCount: number;

    constructor(game: GameRuleEnforcer) {
        this.game = game;
        this.autoCount = 0;
        const actions = game.GetActionsExcludingUse();
        const items = game.GetEntireItemSuite();
        this.itemActionCommmandsTried = new TruthTable(actions, items);
        this.useCommmandsTried = new TruthTable(items, items);
        this.game.SubscribeToCallbacks(this);

        // since use iSpanner with iSpanner is illegal move, we block these out
        for (let i = 0; i < items.length; i++) {
            this.useCommmandsTried.SetColumnRow(i, i);
        }

        // Examine should never be a crucial part of the solution
        // So we can black out all the Examine
        for (let i = 0; i < items.length; i++) {
            this.itemActionCommmandsTried.SetColumnRow(0, i);//0 = examine
        }

        // Examine should never be a crucial part of the solution
        // So we can black out all the Examine
        for (let i = 0; i < items.length; i++) {
            if (items[i][0].startsWith("i"))
                this.itemActionCommmandsTried.SetColumnRow(1, i);//1 = grab
        }

    }

    GetNextCommand(): string[] {
        for (; ;){
            if (this.autoCount > 0) {
                this.autoCount--;
                const use = this.useCommmandsTried.GetNextGuess();
                if (use[0] !== -1) {
                    this.useCommmandsTried.SetColumnRow(use[0], use[1]);
                    this.useCommmandsTried.SetColumnRow(use[1], use[0]);
                    return ["use", this.game.GetItem(use[0]), this.game.GetItem(use[1])];
                }
                const allOtherActions = this.itemActionCommmandsTried.GetNextGuess();
                if (allOtherActions[0] !== -1) {
                    this.itemActionCommmandsTried.SetColumnRow(allOtherActions[0], allOtherActions[1]);
                    return [this.game.GetAction(allOtherActions[0]), this.game.GetItem(allOtherActions[1]), ""];
                }
                continue;
            }
        
            const input = prompt('Enter a command with two or three terms (Q to quit): ');
            if (!input) {
                console.log("At least enter something");
                continue;
            }
            const items: Array<string> = input.split('/');
            if (items.length === 1) {
                if (items[0].toUpperCase() === "Q")
                    break;
            }

            if (items.length === 2 && items[0].toUpperCase() === "DO" && Number(items[1]) > 0) {
                this.autoCount = Number(items[1]);
                console.log("Autocount has been given   " + this.autoCount + " operations.");
                continue;
            }

            if (items.length !== 3) {
                console.log("Please enter 3 words (not " + items.length + ")");
                continue;
            }

            return items;
        } 

        return [];;
    }

    OnItemVisbilityChange(number: number, newValue: boolean, nameForDebugging: string): void {
        this.itemActionCommmandsTried.SetVisibilityOfRow(number, newValue, nameForDebugging);
        this.useCommmandsTried.SetVisibilityOfRow(number, newValue, nameForDebugging);
        this.useCommmandsTried.SetVisibilityOfColumn(number, newValue, nameForDebugging);
    }

}

