
import { SolverViaRootNode } from "./SolverViaRootNode";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import { GetDisplayName } from "./GetDisplayName";
import { RawObjectsAndVerb } from "./RawObjectsAndVerb";
import { Raw } from "./Raw";
import { SceneInterface } from "./SceneInterface";
import { SceneInterfaceConcoct } from "./SceneInterfaceConcoct";
function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error("assert failure");
    }
}
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
const prompt = promptSync();

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
    public DoStuff(scene: SceneInterfaceConcoct): void {
        let mapOfVisibleThings = scene.GetMapOfAllStartingThings();
        let mapOfRemainingNodes = scene.GenerateSolutionNodesMappedByInput();

        while (true) {
            console.log(" ");

            // Solve solution nodes
            const solver = new SolverViaRootNode();
            solver.InitializeByCopyingThese(mapOfRemainingNodes, mapOfVisibleThings);
            solver.SolveUntilZeroNodesRemaining();
            solver.GenerateSolutionNames(mapOfVisibleThings);

            const arrayOfRollovers = new Array<Solution>();
            console.log("Choose a solution,  -1 for All or (b)ack: ")
            for (let i = 0; i < solver.length; i++) {
                console.log(" " + i + ". Analyze " + GetDisplayName(solver[i].GetName()));
                if (solver[i].IsRolloverable())
                    arrayOfRollovers.push(solver[i]);
            };

            for (let i = 0; i < arrayOfRollovers.length; i++) {
                console.log(" " + i + ". Rollover " + GetDisplayName(arrayOfRollovers[i].GetName()));
            }

            const choice = prompt('').toLowerCase();
            if (choice === "b")
                break;

            // go through each one 
            if (Number(choice) < solver.length) {
                // Process an Analyse option from above
                for (let i = 0; i < solver.length; i++) {
                    if (choice !== "-1" && i !== Number(choice))
                        continue;
                    const originalSolution = solver[i];
                    console.log("Solution called " + GetDisplayName(originalSolution.GetName()));
                    let solutionToDestroy = originalSolution;

                    let rawObjectsAndVerb: RawObjectsAndVerb | null = null;
                    for (let j = 0; j < 200; j++) {
                        rawObjectsAndVerb = solutionToDestroy.GetNextDoableCommandAndDesconstructTree();

                        if (!rawObjectsAndVerb)// all out of moves!
                            break;

                        const chars = scene.GetArrayOfCharacters();
                        for (let i = 0; i < chars.length; i++) {
                            const char = chars[i];
                            const startingSet = scene.GetStartingThingsForCharacter(char);
                            if (startingSet.has(rawObjectsAndVerb.objectA))
                                rawObjectsAndVerb.appendStartingCharacterForA(char);
                            if (startingSet.has(rawObjectsAndVerb.objectB))
                                rawObjectsAndVerb.appendStartingCharacterForB(char);
                        }

                        if (rawObjectsAndVerb.type !== Raw.None)
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
                        const startingProps = scene.GetSetOfStartingProps();
                        const startingInvs = scene.GetSetOfStartingInvs();
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
                            console.log("Below are all the starting things");

                            setAfterReduction.forEach((entry: string) => {
                                console.log(GetDisplayName(entry));
                            })

                            console.log("Spot what needs to be in the starting set - and fix it!");
                            prompt('Hit a key to continue').toLowerCase();
                        } else {
                            console.log("rawObjectsAndVerb was null, but it looked solvable. WEIRD! debug this.")
                        }
                    }
                    console.log("");
                }
            } else {// Process rollover
                const newIndex = Number(choice)-solver.length;
                const solution = arrayOfRollovers[newIndex];
                // need to implement these methods so that they
                mapOfRemainingNodes = solution.GetMapOfCurrentlyRemainingNodes();
                mapOfVisibleThings = solution.GetMapOfCurrentlyVisibleThings(mapOfVisibleThings);
            }
        }
    }

}