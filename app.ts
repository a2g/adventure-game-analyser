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
        console.log("1. Quit");
        console.log("2. Solve to Leaf Nodes");
        console.log("3. Manual Play Through");
        console.log("5. Quit");

        const choice = Number(prompt('Choose the goal you want to find leaves for (or enter verbatim) (Q to quit): '));
        switch (choice) {
            case 1:
                return;
            case 2:
                ChooseTheGoalToFindLeavesFor.prototype.DoStuff();
                break;
            case 3:
                ChooseBruteForceLocationless();
                break;

        }
    }
}

main();
