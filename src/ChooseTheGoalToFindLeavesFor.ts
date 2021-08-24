import { SolutionCollection } from "./SolutionCollection";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { SceneInterfaceFindLeaves } from "./SceneInterfaceFindLeaves";
const prompt = promptSync();



export class ChooseTheGoalToFindLeavesFor {

    static array: Array<string> = [
        "inv_solution",
        "prop_death_by_guitar",
        "prop_death_by_slamdunk",
        "prop_death_by_physics",
        "prop_switched_on_item2",
        "prop_stageA",
        "prop_stageB",
        "prop_stageC",
        "prop_stageD",
        "prop_stageE"
    ];
    public DoStuff(scene: SceneInterfaceFindLeaves): void {
        while (true) {
            console.log(" ");

            const array = ChooseTheGoalToFindLeavesFor.array;

            const mapOfReactionsByInput = scene.GetSolutionNodesMappedByInput();

            const collection = new SolutionCollection();
            const objective = "flag_win";
            collection.push(new Solution(new SolutionNode("root via app", "", 1, null, objective), mapOfReactionsByInput));

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