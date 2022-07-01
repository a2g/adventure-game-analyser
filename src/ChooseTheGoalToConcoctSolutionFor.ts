
import { SolverViaRootNode } from "./SolverViaRootNode";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import { GetDisplayName } from "./GetDisplayName";
import { RawObjectsAndVerb } from "./RawObjectsAndVerb";
import { Raw } from "./Raw";
import * as fs from "fs";
import { ReadOnlyJsonInterfaceConcoct } from "./ReadOnlyJsonInterfaceConcoct";
import _ from './20210415JsonPrivate/Gate/Gate.json';
import promptSync from 'prompt-sync';

const prompt = promptSync();
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error("assert failure");
  }
}


function UnionSet(setA: Set<string>, setB: Set<string>): Set<string> {
  const union = new Set(setA)
  setB.forEach((elem) => {
    union.add(elem);
  });
  return union;
}

function IntersectionSet(setA: Set<string>, setB: Set<string>): Set<string> {
  const intersection = new Set<string>()
  setB.forEach((elem) => {
    if (setA.has(elem)) {
      intersection.add(elem);
    }
  });
  return intersection;
}

function UnionSetFromArrays(arrayA: Array<string>, arrayB: Array<string>): Set<string> {
  const union = new Set(arrayA)
  arrayB.forEach((elem) => {
    union.add(elem);
  });
  return union;
}

function IntersectionSetFromArrays(arrayA: Array<string>, arrayB: Array<string>): Set<string> {
  const intersection = new Set<string>()
  arrayB.forEach((elem: string) => {
    if (arrayA.indexOf(elem) !== -1) {
      intersection.add(elem);
    }
  });
  return intersection;
}

function IsASupersetOfB(set: Set<string>, subset: Set<string>) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false
    }
  }
  return true
}

export class ChooseTheGoalToConcoctSolutionFor {
  public DoStuff(json: ReadOnlyJsonInterfaceConcoct): void {
    let startingThingsAndWhoCanHavethem = json.GetMapOfAllStartingThings();
    let mapOfRemainingNodes = json.GenerateSolutionNodesMappedByInput();

    // Solve solution nodes
    const solver = new SolverViaRootNode(startingThingsAndWhoCanHavethem);
    solver.InitializeByCopyingThese(mapOfRemainingNodes, startingThingsAndWhoCanHavethem);
    solver.SolveUntilZeroUnprocessedNodes();

    while (true) {
      console.log(" ");

      const arrayOfChapterWins = new Array<Solution>();
      console.log("Choose a solution,  -1 for All or (b)ack: ")
      let isAnyIncomplete = false;
      for (let i = 0; i < solver.GetSecondaryGoals().length; i++) {
        let isSubGoal = solver.GetSecondaryGoals()[i].IsChapterWin();
        isAnyIncomplete = isAnyIncomplete || isSubGoal;
        console.log(" " + i + ". " + GetDisplayName(solver.GetSecondaryGoals()[i].GetDisplayNamesConcatenated()) + "(" + (solver.GetSecondaryGoals()[i].GetMapOfCurrentlyRemainingNodes().Size()) + ")" + (isSubGoal ? "(subgoal)" : "<--ultimate goal!"));
      }

      if (isAnyIncomplete) {
        console.log(" " + solver.GetSecondaryGoals().length + ". Progress subgoals a single level more, and update");
      }

      const choice = prompt('hmmn?').toLowerCase();
      if (choice === "b")
        break;

      if (Number(choice) == solver.GetSecondaryGoals().length) {
        solver.ProcessChaptersToEndAndUpdateList();
        continue;
      }

      // go through each one
      if (Number(choice) < solver.GetSecondaryGoals().length) {
        // Process an Analyse option from above
        for (let i = 0; i < solver.GetSecondaryGoals().length; i++) {
          if (choice !== "-1" && i !== Number(choice))
            continue;
          const originalSolution = solver.GetSecondaryGoals()[i];
          console.log("Solution called " + originalSolution.GetDisplayNamesConcatenated());
          let solutionToDestroy = originalSolution;

          let rawObjectsAndVerb: RawObjectsAndVerb | null = null;
          for (let j = 0; j < 200; j++) {
            rawObjectsAndVerb = solutionToDestroy.GetNextDoableCommandAndDesconstructTree();

            if (!rawObjectsAndVerb)// all out of moves!
              break;

            const chars = json.GetArrayOfCharacters();
            for (let i = 0; i < chars.length; i++) {
              const char = chars[i];
              const startingSet = json.GetStartingThingsForCharacter(char);
              if (startingSet.has(rawObjectsAndVerb.objectA))
                rawObjectsAndVerb.appendStartingCharacterForA(char);
              if (startingSet.has(rawObjectsAndVerb.objectB))
                rawObjectsAndVerb.appendStartingCharacterForB(char);
            }

            if (rawObjectsAndVerb.type !== Raw.None)
              // this is just here for debugging!
              rawObjectsAndVerb.WriteToConsole();

            if (rawObjectsAndVerb.type == Raw.You_have_won_the_game) {
              // this is just here for debugging!
              let debugMe = solutionToDestroy.GetNextDoableCommandAndDesconstructTree();
              break;
            }
          }

          if (!rawObjectsAndVerb) {
            const leafNodesRequiredBySolution = new Set<string>();
            originalSolution.GetLeafNodes().forEach((value: SolutionNode) => {
              leafNodesRequiredBySolution.add(value.output);
            });
            const startingProps = json.GetSetOfStartingProps();
            const startingInvs = json.GetSetOfStartingInvs();
            const startingPropsAndInvs = UnionSet(startingProps, startingInvs);
            const setAfterReduction = IntersectionSet(leafNodesRequiredBySolution, startingPropsAndInvs);
            const isSolvable = IsASupersetOfB(startingPropsAndInvs, leafNodesRequiredBySolution);

            // error handling
            if (!isSolvable) {
              console.log("Starting set needs to have more stuff(props probably):");
              leafNodesRequiredBySolution.forEach((entry: string) => {
                console.log(GetDisplayName(entry));
              })
              console.log("-------^^ Above are the leaf nodes laid out in the Solution");
              console.log("Below is the intersection of startingPropsAndInvs AND leafnodes");

              setAfterReduction.forEach((entry: string) => {
                console.log(GetDisplayName(entry));
              })
              console.log("Below are the map of starting things and who can have them");
              for (let blah of startingThingsAndWhoCanHavethem.keys()) {
                console.log(GetDisplayName(blah));
              }

              console.log("Spot what needs to be in the starting set - and fix it!");
              console.log("A better idea might be to see the props in the Leaf Node solve (4) and put them in starting set");
              console.log("I'm still unsure on whether the code above is useful, or I mucked up the derivation when doing a refactor");
              prompt('Hit a key to continue').toLowerCase();
            } else {
              console.log("rawObjectsAndVerb was null, but it looked solvable. WEIRD! debug this.")
            }
          }
          console.log("");

          prompt('Hit any key to continue...');
        }
      }
    }
  }

}
