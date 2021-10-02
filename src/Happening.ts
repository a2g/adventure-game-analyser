import { Happen } from "./Happen";
import { assert } from "console";

export class Happening {
    constructor(play: Happen, item: string) {
        this.happen = play;
        this.item = item;
        switch (play) {
            case Happen.InvGoes:
            case Happen.InvStays:
            case Happen.InvAppears:
                if(!item.startsWith("inv"))
                    console.log("Mismatch! the item (" + item + ") doesn't start with 'inv'");
                break;
            case Happen.PropGoes:
            case Happen.PropStays:
            case Happen.PropAppears:
                if(!item.startsWith("prop"))
                    console.log("Mismatch! the item (" + item + ") doesn't start with 'prop'");
                break;
            case Happen.FlagIsDecremented:
            case Happen.FlagIsIncremented:
            case Happen.FlagIsSet:
                if(!item.startsWith("flag"))
                    console.log("Mismatch! the item (" + item + ") doesn't start with 'flag'");
                break;
                break;
        }
    }
    item: string;
    happen: Happen;
}
