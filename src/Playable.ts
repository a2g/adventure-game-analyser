import { Happener } from "./Happener";
import { PlayerAI } from "./PlayerAI";
import { SolutionNodeMap } from "./SolutionNodeMap";

export class Playable{
    constructor(player:PlayerAI, happener:Happener, map:SolutionNodeMap){
        this.player = player;
        this.solutionNodeMap = map;
        this.happener = happener;
        this.isCompleted = false;
    }

    GetPlayer(): PlayerAI {
        return this.player;
    }

    GetSolutionNodeMap(): SolutionNodeMap {
        return this.solutionNodeMap;
    }

    GetHappener(): Happener {
        return this.happener;
    }

    SetCompleted() {
        this.isCompleted = true;
    }

    IsCompleted(): boolean {
        return this.isCompleted;
    }

    private readonly player: PlayerAI;
    private readonly solutionNodeMap: SolutionNodeMap;
    private readonly happener: Happener;
    private  isCompleted: boolean;
   
}