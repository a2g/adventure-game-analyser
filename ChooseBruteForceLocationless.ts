
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

import { ParseRowsFromSheet } from "./ParseRowsFromSheet";
import { GameRuleEnforcer } from "./GameRuleEnforcer";
import { PlayerAI } from "./PlayerAI";
import { GameReporter } from "./GameReporter";
import { Sleep } from "./Sleep";
import { Data } from "./Data";



function ChooseBruteForceLocationless() {

    const t = "\t";

    const verbs: Array<string> = ["examine", "grab"];

    {
        GameRuleEnforcer.GetInstance().Initialize(Data.GetProps(), Data.GetInvs(), Data.GetRegs(), Data.GetTransactions(), verbs);
        const ai: PlayerAI = new PlayerAI(GameRuleEnforcer.GetInstance());
        for (let command: string[] = ai.GetNextCommand(); ; command = ai.GetNextCommand()) {

            if (command.length == 0) {
                // null command means ai can't find another guess.
                // so lets just see what's going on here
                command = ai.GetNextCommand();
                break;
            }
            GameReporter.GetInstance().ReportCommand(command);
            GameRuleEnforcer.GetInstance().ExecuteCommand(command);

            const inventory = GameRuleEnforcer.GetInstance().GetCurrentVisibleInventory();
            GameReporter.GetInstance().ReportInventory(inventory);
            const viewables = GameRuleEnforcer.GetInstance().GetCurrentVisibleScene();
            GameReporter.GetInstance().ReportScene(viewables);

            Sleep(500);
        }
        console.log("Success");
    } 
}