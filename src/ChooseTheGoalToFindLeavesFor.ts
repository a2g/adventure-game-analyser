import { SolverViaRootNode } from "./SolverViaRootNode";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { ReadOnlyJsonInterfaceFindLeaves } from "./ReadOnlyJsonInterfaceFindLeaves";
import { GetDisplayName } from "./GetDisplayName";
const prompt = promptSync();



export class ChooseTheGoalToFindLeavesFor {

  public DoStuff(json: ReadOnlyJsonInterfaceFindLeaves): void {
    console.log(" ");
    let startingThingsAndWhoCanHaveThem = json.GetMapOfAllStartingThings();
    const collection = new SolverViaRootNode(startingThingsAndWhoCanHaveThem);
    const objective = "flag_goal_main";
    collection.GetSolutionsArray().push(new Solution(new SolutionNode("root via app", "", 1, null, null, objective), json.GenerateSolutionNodesMappedByInput(), startingThingsAndWhoCanHaveThem));

    do {
      collection.SolvePartiallyUntilCloning();
    } while (collection.IsAnyNodesUnprocessed());

    for (; ;) {
      console.log("Number of solutions = " + collection.GetSolutionsArray().length);
      let numberOfLeaves = 0;

      // display list
      collection.GenerateSolutionNamesAndPush(json.GetMapOfAllStartingThings());
      for (let solution of collection.GetSolutionsArray()) {
        console.log(GetDisplayName(solution.GetDisplayNamesConcatenated()))
        const needs = solution.GetLeafNodes();
        for (let node of needs.values()) {
          numberOfLeaves++;

          // display list item
          console.log("    " + numberOfLeaves + "." + node.output);
        };
      };

      // allow user to choose item
      const input = prompt("Choose an ingredient of one of the solutions or (b)ack: ").toLowerCase();
      if (input === null || input === "b") {
        return;
      } else {
        // show map entry for chosen item
        const number = Number(input);
        if (number > 0 && number <= numberOfLeaves) {
          let i = 0;
          collection.GetSolutionsArray().forEach(function (solution: Solution) {
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
