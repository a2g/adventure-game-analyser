import { Solution } from './Solution';
import { SolutionNode } from './SolutionNode';


export class SolutionCollection extends Array<Solution>{
    constructor() {
        super();
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

    GenerateSolutionNames(set: Set<[string, string]> | null) {
        for (let i = 0; i < this.length; i++) {
            let restrictions = "";
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
            let minLeafNodeNameCount = 1000; //something high
            let minLeafNodeName = "not found";

            const thisLeaves = this[i].GetLeafNodes();
            thisLeaves.forEach((value: SolutionNode, key: string, map: Map<string, SolutionNode>) => {
                const result = mapForCounting.get(value.output)
                if (result !== undefined && result < minLeafNodeNameCount) {
                    minLeafNodeNameCount = result;
                    minLeafNodeName = value.output;
                } else if (!mapForCounting.has(value.output)) {
                    // our leaf is no where in the leafs of other solutions - we can use it!
                    minLeafNodeNameCount = 0;
                    minLeafNodeName = value.output;
                }


                if (set) {
                    for (const blah of set) {
                        if (blah[1] === value.output) {
                            restrictions += blah[0] + " ";
                        }
                    }
                }


            });

            this[i].SetName("sol_" + minLeafNodeName + (restrictions.length>0? "(" + restrictions + ")" : ""));
         }
    }
}
