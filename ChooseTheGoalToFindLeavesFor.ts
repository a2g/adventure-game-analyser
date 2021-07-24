import { Scenario } from "./Scenario";
import { SolutionCollection } from "./SolutionCollection";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
const prompt = promptSync();



export class ChooseTheGoalToFindLeavesFor {
    static array: Array<string> = [
        "inv_demon_death",
        "prop_death_by_guitar",
        "prop_death_by_slamdunk",
        "prop_death_by_physics",
        "prop_switched_on_electromagnet2",
        "prop_slightly_accelerated_vacuum_tube",
        "prop_mildly_accelerated_vacuum_tube",
        "prop_moderately_accelerated_vacuum_tube",
        "prop_partly_accelerated_vacuum_tube",
        "prop_fully_accelerated_vacuum_tube"
    ];
    public DoStuff(): void {


        while(true) {
            console.log(" ");

            const array = ChooseTheGoalToFindLeavesFor.array;

            for (let i = 0; i < array.length; i++) {
                console.log(" " + (i) + ". " + array[i]);
            };

            const choice = prompt('Choose the goal you want to concoct solution for (or enter verbatim) (b)ack ): ').toLowerCase();
            if (choice === "b")
                break;

            // use either index or 
            const objective = (Number(choice) >= 0 && Number(choice) <= array.length) ? array[Number(choice)] : choice;
            console.log("\"" + objective + "\" was entered");
            const mapOfReactionsByInput = Scenario.GetSolutionNodesMappedByInput();

            const collection = new SolutionCollection();
            if (objective !== null) {
                collection.push(new Solution(new SolutionNode("root via app", "", objective), mapOfReactionsByInput));

                do {
                    collection.SolvePartiallyUntilCloning();
                } while (collection.IsNodesRemaining());


                for (; ;) {
                    console.log("Number of solutions = " + collection.length);
                    let numberOfLeaves = 0;

                    // display list
                    collection.forEach(function (solution: Solution) {
                        console.log("------------------------------------------------------------(solution separator)");
                        const needs = solution.absoluteLeafNodes;
                        needs.forEach((value: SolutionNode, key: string, map: Map<string, SolutionNode>) => {
                            numberOfLeaves++;

                            // display list item
                            console.log("    " + numberOfLeaves + "." + value.output);
                        });
                    });

                    // allow user to choose item
                    const input = prompt('Choose an ingredient of one of the solutions (b) back').toLowerCase();
                    if (input === null || input === "b") {
                        break;
                    } else {
                        // show map entry for chosen item
                        const number = Number(input);
                        if (number > 0 && number <= numberOfLeaves) {
                            let i = 0;
                            collection.forEach(function (solution: Solution) {
                                const needs = solution.absoluteLeafNodes;
                                needs.forEach((value: SolutionNode, key: string) => {
                                    i++;
                                    if (i === number) {
                                        console.log("This is the life of the selected ingredient: ");
                                        const items: Array<string> = key.split("/");
                                        const length = items.length;
                                        for (let j = length - 1; j > 1; j--) {
                                            console.log("    " + (length - j) + "." + items[j]);
                                        };
                                        prompt("Hit a key to continue...");
                                    }
                                });
                            });
                        }
                    }
                }
            }
        }
    }
}