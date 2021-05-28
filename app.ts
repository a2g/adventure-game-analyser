import { Game } from './Game';
//import { GameRuleEnforcer } from './GameRuleEnforcer';
import { GameReporter } from './GameReporter';
import { ParseRowsFromSheet } from "./ParseRowsFromSheet";
import { SolveCyclicEtc } from "./SolveCyclicEtc";
import { PlayerAI } from './PlayerAI';
import { RowOfSheet } from './RowOfSheet';
import { GetThreeStringsFromInput } from './GetThreeStringsFromInput';
import { HappenerCallbacksInterface } from './HappenerCallbacksInterface';
import { GameRuleEnforcer } from './Happener';
import { GetTreeSolutionViaOutputMatching } from './GetTreeSolutionViaOutputMatching';
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { ChooseTheGoalToFindLeavesFor } from './ChooseTheGoalToFindLeavesFor';
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { ChooseBruteForceLocationless } from './ChooseBruteForceLocationless';
const prompt = promptSync();

function main(): void {
    for (; ;) {
        console.log(" ");
        console.log("1. Solve to Leaf Nodes");
        console.log("2. Manual Play Through");
        console.log("B. Back");

        const choice = prompt('Choose the goal you want to find leaves for (or enter verbatim) (b)ack): ').toLowerCase();
        switch (choice) {
            case '1':
                ChooseTheGoalToFindLeavesFor.prototype.DoStuff();
                break;
            case '2':
                ChooseBruteForceLocationless();
                break;
            case 'b':
                return;

        }
    }
}

main();
