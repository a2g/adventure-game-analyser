import { Play } from "./Play";
import { assert } from "console";

export class PlayAction {
    constructor(play: Play, item: string | undefined) {
        this.play = play;
        this.item = item;
        switch (play) {
            case Play.InvGoes:
            case Play.InvStays:
            case Play.InvAppears:
                assert(item?.startsWith("inv"));
                break;
            case Play.PropGoes:
            case Play.PropStays:
            case Play.PropAppears:
                assert(item?.startsWith("prop"));
                break;
        }
    }
    item: string | undefined;
    play: Play;
}
