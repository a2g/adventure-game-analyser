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
import { GetMapFromJSonGlossy } from './GetMapFromJSonGlossy';
import { GetTreeSolutionViaOutputMatching } from './GetTreeSolutionViaOutputMatching';
import { Solution } from './Solution';
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';

const prompt = require('prompt-sync')({ sigint: true });

while (true) {
    // Get user input
    console.log(" ");
    const array = new Array<string>();
    array.push("inv_demon_death");
    array.push("prop_death_by_guitar");
    array.push("prop_death_by_slamdunk");
    array.push("prop_death_by_physics");
    array.push("prop_switched_on_electromagnet2");
    array.push("prop_slightly_accelerated_vacuum_tube");
    array.push("prop_mildly_accelerated_vacuum_tube");
    array.push("prop_moderately_accelerated_vacuum_tube");
    array.push("prop_partly_accelerated_vacuum_tube");
    array.push("prop_fully_accelerated_vacuum_tube");
    for (let i = 0; i < array.length; i++) {
        console.log(" " + (i) + ". " + array[i]);
    };

    const choice = prompt('Choose the goal you want a solution for (or enter verbatim): ');
    // use either index or 
    const objective = (Number(choice) >= 0 && Number(choice) <= array.length) ? array[Number(choice)] : choice;
    console.log("\"" + objective + "\" was entered");
    const mapOfTransactionsByInput = GetMapFromJSonGlossy();

    const collection = new SolutionCollection();
    collection.push(new Solution(new SolutionNode("root via app", "", objective), mapOfTransactionsByInput));

    do {
        collection.Process();
    } while (collection.IsNodesRemaining());

    let input = "";
    do {

        let i = 0;
        // display list
        collection.forEach(function (solution: Solution) {
            console.log("------------------------------------------------------------(solution separator)");
            const needs = solution.absoluteLeafNodes;
            needs.forEach((value: string, key: string, map: Map<string, string>) => {
                i++;
                console.log("    " + i + "." + map.get(key));
            });
        });

        // allow user to choose item
        input = prompt('Choose an ingredient of one of the solutions: ');

        // show map entry for chosen item
        const number = Number(input);
        if (number > 0 && number <= array.length) {
            let i = 0;
            collection.forEach(function (solution: Solution) {
                const needs = solution.absoluteLeafNodes;
                needs.forEach((value: string, key: string, map: Map<string, string>) => {
                    i++;
                    if (i === number) {
                        console.log("This is the life of the selected ingredient: " );
                        const items: Array<string> = key.split("/");
                        const length = items.length;
                        for (let j = length-1; j >1; j--) {
                            console.log("    " + (length-j)  + "." + items[j]);
                        };
                        prompt("Hit a key to continue...");
                    }
                });
            });
        }

    } while (input !== "");
}
