import { Game } from './Game';
//import { GameRuleEnforcer } from './GameRuleEnforcer';
import { GameReporter } from './GameReporter';
import { ParseRowsFromSheet } from "./ParseRowsFromSheet";
import { SolveCyclicEtc } from "./SolveCyclicEtc";
import { PlayerAI } from './PlayerAI';
import { RowOfSheet } from './RowOfSheet';
import { GetThreeStringsFromInput } from './GetThreeStringsFromInput';
import { HappenerCallbacksInterface } from './HappenerCallbacksInterface';
import { Happener } from './Happener';
import { GetTreeSolutionViaOutputMatching } from './GetTreeSolutionViaOutputMatching';
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { ChooseTheGoalToFindLeavesFor } from './ChooseTheGoalToFindLeavesFor';
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { ChooseToPlayThrough } from './ChooseToPlayThrough';
import { ChooseToFindUnused } from './ChooseToFindUnused';
import { ChooseTheGoalToConcoctSolutionFor } from './ChooseTheGoalToConcoctSolutionFor';
import { SceneInterface } from './SceneInterface';
import { SceneSingle } from './SceneSingle';
import { ScenePreCacheMultiple } from './ScenePreCacheMultiple';
const prompt = promptSync();

function main(): void {
    const fileSet = new Set<string>();
    fileSet.add("src/20210415JsonPrivate/HospScene.json");
    fileSet.add("src/20210415JsonPrivate/HighScene.json");
    const scene = new ScenePreCacheMultiple(fileSet);

    while(true) {
        console.log(" ");
        console.log("1. Play Through");
        console.log("2. Solve to Leaf Nodes <--leafs unresolved? add reactions and validate schema");
        console.log("3. Check for unused props and invs <-- delete these");
        console.log("4. Try Concocting solutions <-- solutions missing? add props to starting props, or things");
        console.log("5. Choose a character <-- this will give you which characters each solution is restricted to");
        console.log("b. bail");

        const choice = prompt('Choose an option (b)ail): ').toLowerCase();
  
        switch (choice) {
            case '1':
                ChooseToPlayThrough(scene, 0);
                break;
            case '2':
                ChooseTheGoalToFindLeavesFor.prototype.DoStuff(scene);
                break;
            case '3':
                ChooseToFindUnused.prototype.DoStuff(scene);
                break;
            case '4':
                ChooseTheGoalToConcoctSolutionFor.prototype.DoStuff(scene);
                break;
            case '5':
                //ChooseTwoCharacters.prototype.DoStuff();
                break;
            case 'b':
                return;

        }
    }
}

main();
