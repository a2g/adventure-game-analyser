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

const prompt = require('prompt-sync')({ sigint: true });

while (true) {
    // Get user input
    console.log(" ");
    console.log("Choose an option");
    const array = new Array<string>();
    array.push("inv_demon_death");
    array.push("prop_death_by_guitar");
    array.push("prop_death_by_slamdunk");
    array.push("prop_death_by_physics");
    array.push("prop_switched_on_electromagnet2");
    for (let i = 0; i < array.length; i++) {
        console.log(" " + (i+1) + ". " + array[i]);
    };

    let choice = prompt('Choose an option: ');
    // Convert the string input to a number
    choice = Number(choice);
    if (choice > 0 && choice <= array.length) {
        const mapOfTransactionsByInput = GetMapFromJSonGlossy();
        const result = GetTreeSolutionViaOutputMatching(mapOfTransactionsByInput, array[choice-1]);
        result.forEach(function (solution: Solution){
            console.log("SOLUTION");
            const needs = solution.absoluteLeafNodes;
            needs.forEach( (value:string, key: string, map: Map<string, string>) =>{
                console.log("    "+key);
            });
        });
    }
}

