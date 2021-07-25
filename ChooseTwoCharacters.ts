import { Scenario } from "./Scenario";
import { SolutionCollection } from "./SolutionCollection";
import { SolutionNode } from "./SolutionNode";
import { Solution } from "./Solution";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
import { GetDisplayName } from "./GetDisplayName";
import { SolutionNodeInput } from "./SolutionNodeInput";
import { RawObjectsAndVerb } from "./RawObjectsAndVerb";
import { Raw } from "./Raw";
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

export class ChooseTwoCharacters {
    static array: Array<string> = [
        "inv_completed",
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

    /*
     *        const it = map.keys();
            let c = it.next();
            for (let i = 0; !(c.done); i++, c = it.next()) {
                console.log(String.fromCharCode(65 + i) + ". " + c.value);
            }*/

    public DoStuff(): void {


        while(true) {
            console.log(" ");

            const array = Scenario.GetArrayOfCharacters();

            for (let i = 0; i < array.length;i++ ) {
                console.log(i + ". " + array[i]);
            }

            const choice = prompt('Choose two letters from above): ').toUpperCase().trim();
            if (choice.length >2) {
                console.log("Enter only two letters- with no space in between")
                continue;
            }
            if (choice.length !== 2) {
                console.log("Please enter atleast two letters")
                continue;
            }
            if (choice[0] === choice[1]) {
                console.log("The two letters need to be different")
                continue;
            }
            const highestNumber = array.length - 1;
            if (Number(choice[0]) < 0 || Number(choice[1]) < 0 || Number(choice[0]) > highestNumber || Number(choice[1]) > highestNumber) {
                console.log("Both letters need to be between 0 and " + highestNumber)
                continue;
            }
            // use either index or 
            //const objective = (Number(choice) >= 0 && Number(choice) <= array.length) ? array[Number(choice)] : choice;
            const objective = "inv_completed";
            console.log("\"" + objective + "\" was entered");
            const mapOfReactionsByInput = Scenario.GetSolutionNodesMappedByInput();

            const collection = new SolutionCollection();
            if (objective !== null) {
                collection.push(new Solution(new SolutionNode("root via app", "", objective), mapOfReactionsByInput));

                do {
                    collection.SolvePartiallyUntilCloning();
                } while (collection.IsNodesRemaining());

                const startingThingsForCharacterA = Scenario.GetStartingThingsForCharacter(array[Number(choice[0])]);
                const startingThingsForCharacterB = Scenario.GetStartingThingsForCharacter(array[Number(choice[1])]);
                
                const bothCharacterProps = UnionSet(startingThingsForCharacterA, startingThingsForCharacterB);
                const startingProps = Scenario.GetSetOfStartingProps();
                const startingPropsAndInvs = UnionSet(bothCharacterProps, startingProps);

                console.log("Number of solutions = " + collection.length);
                
                for (const solution of collection) {
                    console.log("Solution called " + GetDisplayName(solution.GetName()));
                    const setFromTheSolution = new Set<string>();
                    solution.absoluteLeafNodes.forEach((value: SolutionNode) => {
                        setFromTheSolution.add(value.output);
                    });

                    const setAfterReduction = IntersectionSet(setFromTheSolution, startingPropsAndInvs);
                    const isSolvable = IsASupersetOfB(startingPropsAndInvs, setFromTheSolution);
                    if (true) {
                        while (true) {
                            let command: RawObjectsAndVerb | null = solution.GetNextDoableCommandAndDesconstructTree(startingPropsAndInvs);
                            if (!command) {
                                command = solution.GetNextDoableCommandAndDesconstructTree(startingPropsAndInvs);
                                break;
                            }
                            if (command.type !== Raw.None)
                                command.Dump();
                        }
                    } else {

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
}