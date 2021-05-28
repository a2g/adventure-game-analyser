import { PlayAction } from "./PlayAction";

export class ReactionDetails {
    constructor() {
        this.verb = "";
        this.text = "";
        this.actions = new Array<PlayAction>();
    }
    verb: string;
    text: string;
    actions: Array<PlayAction>;
   // checks: Array<CheckableItem>;
}