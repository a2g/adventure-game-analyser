import { Scenario } from "./Scenario";
import { SolutionCollection } from "./SolutionCollection";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { GetDisplayName } from "./GetDisplayName";
import { SolutionNodeInput } from "./SolutionNodeInput";
import { RawObjectsAndVerb } from "./RawObjectsAndVerb";
import { Raw } from "./Raw";
function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error("assert failure");
    }
}
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

    public DoStuff(): void {
        while (true) {
            console.log(" ");

            const startingProps = Scenario.GetSetOfStartingProps();
            const startingInvs = Scenario.GetSetOfStartingInvs();
            const startingPropsAndInvs = UnionSet(startingProps, startingInvs);

            const solutionNodesMappedByInput = Scenario.GetSolutionNodesMappedByInput();
            const collection = new SolutionCollection();

            // Solve solution nodes
            collection.push(new Solution(new SolutionNode("root via app", "", "inv_solution"), solutionNodesMappedByInput));
            collection.SolveUntilZeroNodesRemaining();

            console.log(" -1. All")
            for (let i = 0; i < collection.length; i++) {
                console.log(" " + i + ". " + collection[i].GetName());
            };

            const choice = prompt('Choose the solution you want to concoct (or enter verbatim) (b)ack ): ').toLowerCase();
            if (choice === "b")
                break;

            // use either index or 
            const objective = (Number(choice) >= 0 && Number(choice) <= collection.length) ? collection[Number(choice)].GetName() : choice;
            console.log("\"" + objective + "\" was entered");

            // go through each one 
            for (let i = 0; i < collection.length; i++) {
                console.log("");
                if (choice !== "-1" && i !== Number(choice))
                    continue;
                const solution = collection[i];
                console.log("Solution called " + GetDisplayName(solution.GetName()));
                const setFromTheSolution = new Set<string>();
                solution.absoluteLeafNodes.forEach((value: SolutionNode) => {
                    setFromTheSolution.add(value.output);
                });

                const setAfterReduction = IntersectionSet(setFromTheSolution, startingPropsAndInvs);
                const isSolvable = IsASupersetOfB(startingPropsAndInvs, setFromTheSolution);
                assert(isSolvable);
                if (isSolvable) {
                    while (true) {
                        let command: RawObjectsAndVerb | null = solution.GetNextDoableCommandAndDesconstructTree(startingPropsAndInvs);
                        if (!command) {
                            // this is just here for debugging!
                            command = solution.GetNextDoableCommandAndDesconstructTree(startingPropsAndInvs);
                            break;
                        }
                        if (command.type !== Raw.None)
                            command.Dump();
                    }
                } else {
                    console.log("Starting set needs to have more stuff(props probably):");
                    setFromTheSolution.forEach((entry: string) => {
                        console.log(GetDisplayName(entry));
                    })
                    console.log("-------^^ Above is solution Set");
                    console.log("Below is intersection of starting and solution set");

                    setAfterReduction.forEach((entry: string) => {
                        console.log(GetDisplayName(entry));
                    })

                    console.log("Spot what needs to be in the starting set - and fix it!");
                    prompt('Hit a key to continue').toLowerCase();
                }
            }
        }
    }
}