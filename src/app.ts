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
import { SolverViaRootNode } from './SolverViaRootNode';
import { SolutionNode } from './SolutionNode';
import { ChooseTheGoalToFindLeavesFor } from './ChooseTheGoalToFindLeavesFor';
import { ChooseToPlayThrough as ChooseToPlaySingleSection } from './ChooseToPlaySingle';
import { ChooseToFindUnused } from './ChooseToFindUnused';
import { ChooseTheGoalToConcoctSolutionFor } from './ChooseTheGoalToConcoctSolutionFor';
import { SceneInterface } from './SceneInterface';
import { SceneSingle } from './SceneSingle';
import { levels } from './20210415JsonPrivate/All.json'
import { ChooseToPlayCampaign } from './ChooseToPlayCampaign';
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { SceneMultipleCombined } from './SceneMultipleCombined';
const prompt = promptSync();

function main(): void {
   
    while (true) {
        let i = 1;
        console.log(" ");
        console.log(" Master Menu")
        console.log("==================");
        console.log("0. Play Campaign");

        const arrayOfFiles = new Array<string>();
        for (let level of levels) {
            arrayOfFiles.push(level.mainFile);
            console.log("" + i++ + ". " + level.mainFile);
            for(let file of level.extraFiles){
                arrayOfFiles.push(file);
                console.log("" + i++ + ". " + file);
            }
        }

        const choice = prompt("Choose an option (b)ail): ").toLowerCase();
        switch (choice) {
            case 'b':
                return;
            case '0':
                ChooseToPlayCampaign();
                break;
            default:
                const index = Number(choice) - 1;
                if (index >= 0 && index < arrayOfFiles.length) {
                    const scene = new SceneMultipleCombined([arrayOfFiles[index]]);
                    while (true) {
                        console.log("\nSubMenu of " + arrayOfFiles[index]);
                        console.log("---------------------------------------");
                        console.log("1. Play Single");
                        console.log("2. Solve to Leaf Nodes <--leafs unresolved? add gates and validate schema");
                        console.log("3. Check for unused props and invs <-- delete these");
                        console.log("4. Try Concocting solutions <-- solutions missing? add props to starting props, or things");
                        console.log("5. Choose a character <-- this will give you which characters each solution is restricted to");
                   
                        const choice = prompt("Choose an option (b)ail: ").toLowerCase();
                        if(choice=='b')
                            break;
                        switch (choice) {
                            case '1':
                                ChooseToPlaySingleSection(scene, 0);
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
                          
                        }
                    }
                }
        }
    }
}

main();
