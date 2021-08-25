import { Solution } from './Solution';
import { SolutionNode } from './SolutionNode';
import { GetDisplayName } from './GetDisplayName';
import { Colors } from './Colors';


export class SolutionCollection extends Array<Solution>{
    startingThings:Set<string>;

    constructor( startingThings:Set<string>) {
        super();
        this.startingThings = startingThings
    }

    GetStartingThings(): Set<string> {
        return this.startingThings
    }

    IsNodesRemaining(): boolean {
        let isNodesRemaining = false;
        this.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining())
                isNodesRemaining = true;
        });
        return isNodesRemaining;
    }

    SolvePartiallyUntilCloning(): boolean {
        let hasACloneJustBeenCreated = false
        this.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining()) {
                if (solution.ProcessUntilCloning(this))
                    hasACloneJustBeenCreated = true;
            }
        });
        return hasACloneJustBeenCreated;
    }

    SolveUntilZeroNodesRemaining() {
        do {
            this.SolvePartiallyUntilCloning();
        } while (this.IsNodesRemaining());

        this.GenerateSolutionNames(null);
    }

    GenerateSolutionNames(startingSetOfThings: Set<[string, string]> | null) {
        for (let i = 0; i < this.length; i++) { 
            // now lets find out the amount leafNode name exists in all the other solutions
            const mapForCounting = new Map<string, number>();
            for (let j = 0; j < this.length; j++) {
                if (i === j)
                    continue;
                const otherSolution = this[j];
                const otherLeafs = otherSolution.GetLeafNodes();
                otherLeafs.forEach((value: SolutionNode, key: string, map: Map<string, SolutionNode>) => {
                    const otherLeafNodeName = value.output;
                    let otherLeafNodeNameCount = 0;
                    const result = mapForCounting.get(otherLeafNodeName);
                    if (result !== undefined)
                        otherLeafNodeNameCount = result;
                    mapForCounting.set(otherLeafNodeName, otherLeafNodeNameCount + 1);
                });
            }

            // find least popular leaf in solution i
            const currSolution = this[i];
            let minLeafNodeNameCount = 1000; //something high
            let minLeafNodeName = "not found";

            // get all the restrictions from solution nodes
            const currRestrictions = currSolution.getRestrictions();

            const currLeaves = currSolution.GetLeafNodes();
            currLeaves.forEach((solutionLeafNode: SolutionNode, key: string, map: Map<string, SolutionNode>) => {
                const result = mapForCounting.get(solutionLeafNode.output)
                if (result !== undefined && result < minLeafNodeNameCount) {
                    minLeafNodeNameCount = result;
                    minLeafNodeName = solutionLeafNode.output;
                } else if (!mapForCounting.has(solutionLeafNode.output)) {
                    // our leaf is no where in the leafs of other solutions - we can use it!
                    minLeafNodeNameCount = 0;
                    minLeafNodeName = solutionLeafNode.output;
                }

                // now we potentially add startingSet items to restrictions
                if (startingSetOfThings) {
                    for (const startingThing of startingSetOfThings) {
                        if (startingThing[1] === solutionLeafNode.output) {
                            currRestrictions.add(startingThing[0]);
                        }
                    }
                }

            });

            // format it in to a lovely comma-separated list
            let restrictions = "";
            for (const restriction of currRestrictions) {
                const nameToAdd = GetDisplayName(restriction);
                restrictions += restrictions.length > 0 ? (", " + nameToAdd) : nameToAdd;
            }

            currSolution.SetName("sol_" + minLeafNodeName + Colors.Reset + (restrictions.length>0? "(" + restrictions + ")" : ""));
         }
    }
}
