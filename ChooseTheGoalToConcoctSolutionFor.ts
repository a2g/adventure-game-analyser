import { Scenario } from "./Scenario";
import { SolutionCollection } from "./SolutionCollection";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { GetDisplayName } from "./GetDisplayName";
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
    arrayB.forEach((elem:string) => {
        if (arrayA.indexOf(elem)!==-1) {
            intersection.add(elem);
        }
    });
    return intersection;
}

function IsASupersetOfB(set:Set<string>, subset:Set<string>) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false
        }
    }
    return true
}

export class ChooseTheGoalToConcoctSolutionFor {
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


        for (; ;) {
            console.log(" ");

            const array = ChooseTheGoalToConcoctSolutionFor.array;

            for (let i = 0; i < array.length; i++) {
                console.log(" " + (i) + ". " + array[i]);
            };

            const choice = prompt('Choose the goal you want to concoct solution for (or enter verbatim) (b)ack ): ').toLowerCase();
            if (choice === "b")
                break;

            // use either index or 
            const objective = (Number(choice) >= 0 && Number(choice) <= array.length) ? array[Number(choice)] : choice;
            console.log("\"" + objective + "\" was entered");
            const mapOfReactionsByInput = Scenario.GetSolutionNodeMap();

            const collection = new SolutionCollection();
            if (objective !== null) {
                collection.push(new Solution(new SolutionNode("root via app", "", objective), mapOfReactionsByInput));

                do {
                    collection.ProcessUntilCloning();
                } while (collection.IsNodesRemaining());

                const startingProps = Scenario.GetArrayOfProps();
                const startingInvs = Scenario.GetArrayOfInvs();
                const startingPropsAndInvs = UnionSetFromArrays(startingProps, startingInvs);

                console.log("Number of solutions = " + collection.length);
                
                for (let j = 0; j < collection.length; j++) {
                    const solution = collection[j];
                    const setFromTheSolution = new Set<string>();
                    solution.absoluteLeafNodes.forEach((value: string,key:string) => {
                            setFromTheSolution.add(value);
                    });
                    setFromTheSolution.forEach((entry: string) => {
                        console.log(GetDisplayName(entry));
                    })
                    const setAfterReduction = IntersectionSet(setFromTheSolution, startingPropsAndInvs);
                    const isSolvable = IsASupersetOfB(startingPropsAndInvs, setFromTheSolution);
                    console.log("Solvable = " + isSolvable ? "TRUE" : "FALSE");
                    console.log("-------will this reduced set below suffice the solution above (Y/N)?--------------------------");
                 
                    setAfterReduction.forEach((entry: string) => {
                        console.log(GetDisplayName(entry));
                    })
                    
                    console.log("===============================================");
                    const choice = prompt('').toLowerCase();
                    if (choice==='y') {
                        do {
                            const node: SolutionNode | null = solution.GetNextSolvedSolutionNode();
                            if (node) {

                            }
                        }while(node!=null)
                    }
                }
                




            }
        }
    }
}