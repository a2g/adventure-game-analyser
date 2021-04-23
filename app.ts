import { Game } from './Game';
//import { GameRuleEnforcer } from './GameRuleEnforcer';
import { GameReporter } from './GameReporter';
import { ParseRowsFromSheet } from "./ParseRowsFromSheet";
import { SolveCyclicEtc } from "./SolveCyclicEtc";
import { PlayerAI } from './PlayerAI';
import { RowOfSheet } from './RowOfSheet';
import { GetThreeStringsFromCommand } from './GetThreeStringsFromCommand';
import { GameRuleEnforcerCallbacksInterface } from './GameRuleEnforcerCallbacksInterface';

import { GameRuleEnforcer } from './GameRuleEnforcer';
import transactionsFile from './example2.json';

console.log('Hello world');

function sleep(milliseconds:number) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const t = "\t";

const isactionose = false;
const actions: Array<string> = ["examine", "grab"];


if (result === "ok") {
    GameRuleEnforcer.GetInstance().Initialize(rowsOfGame, actions);
    const ai: PlayerAI = new PlayerAI(GameRuleEnforcer.GetInstance());
    for (let command: string[] = ai.GetNextCommand(); ; command = ai.GetNextCommand()) {

        if (command.length==0) {
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

        sleep(500);
    }
    console.log("Success");
} else {
    console.log(result);
    console.log("Quitting early");
}