import { SolverViaRootNode } from "./SolverViaRootNode";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { SceneInterfaceFindLeaves } from "./SceneInterfaceFindLeaves";
const prompt = promptSync();



export class ChooseTheGoalToFindLeavesFor {


    public DoStuff(scene: SceneInterfaceFindLeaves): void {
        while (true) {
            console.log(" ");

            const collection = new SolverViaRootNode();
            const objective = "flag_win";
            collection.push(new Solution(new SolutionNode("root via app", "", 1, null, objective), scene.GenerateSolutionNodesMappedByInput(), scene.GetMapOfAllStartingThings()));

            do {
                collection.SolvePartiallyUntilCloning();
            } while (collection.IsNodesRemaining());

            for (; ;) {
                console.log("Number of solutions = " + collection.length);
                let numberOfLeaves = 0;

                // display list
                collection.forEach(function (solution: Solution) {
                    console.log("------------------------------------------------------------(solution separator)");
                    const needs = solution.GetLeafNodes();
                    for (let node of needs.values()) {
                        numberOfLeaves++;

                        // display list item
                        console.log("    " + numberOfLeaves + "." + node.output);
                    };
                });

                // allow user to choose item
                const input = prompt("Choose an ingredient of one of the solutions or (b)ack: ").toLowerCase();
                if (input === null || input === "b") {
                    return;
                } else {
                    // show map entry for chosen item
                    const number = Number(input);
                    if (number > 0 && number <= numberOfLeaves) {
                        let i = 0;
                        collection.forEach(function (solution: Solution) {
                            const needs = solution.GetLeafNodes();
                            needs.forEach((value: SolutionNode, key: string) => {
                                i++;
                                if (i === number) {
                                    console.log("This is the life of the selected ingredient: ");
                                    const items: Array<string> = key.split("/");
                                    const length = items.length;
                                    for (let j = length - 2; j > 1; j--) {
                                        console.log("    - " + items[j]);
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