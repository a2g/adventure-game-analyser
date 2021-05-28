import { Happen } from "./Happen";
import { assert } from "console";

export class Happening {
    constructor(play: Happen, item: string | undefined) {
        this.happen = play;
        this.item = item;
        switch (play) {
            case Happen.InvGoes:
            case Happen.InvStays:
            case Happen.InvAppears:
                assert(item?.startsWith("inv"));
                break;
            case Happen.PropGoes:
            case Happen.PropStays:
            case Happen.PropAppears:
                assert(item?.startsWith("prop"));
                break;
        }
    }
    item: string | undefined;
    happen: Happen;
}
