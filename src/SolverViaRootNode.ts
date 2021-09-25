import { Solution } from './Solution';
import { SolutionNode } from './SolutionNode';
import { GetDisplayName } from './GetDisplayName';
import { Colors } from './Colors';
import { Embracketize } from './Embracketize';
import { SolutionNodeMap } from './SolutionNodeMap';


export class SolverViaRootNode extends Array<Solution>{

    constructor() {
        super();
    }

    InitializeByCopyingThese(solutionNodesMappedByInput: SolutionNodeMap, mapOfVisibleThings: Map<string,Set<string>>) {
        const solutionRootNode = new SolutionNode("root via app", "", 1, null, "flag_win");
        this.push(new Solution(solutionRootNode, solutionNodesMappedByInput, mapOfVisibleThings));
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

    GenerateSolutionNames(mapOfStartingThings: Map<string,Set<string>> | null) {
        for (let i = 0; i < this.length; i++) {
            // now lets find out the amount leafNode name exists in all the other solutions
            const mapForCounting = new Map<string, number>();
            for (let j = 0; j < this.length; j++) {
                if (i === j)
                    continue;
                const otherSolution = this[j];
                const otherLeafs = otherSolution.GetLeafNodes();
                for (let leafNode of otherLeafs.values()) {
                    const otherLeafNodeName = leafNode.output;
                    let otherLeafNodeNameCount = 0;
                    const result = mapForCounting.get(otherLeafNodeName);
                    if (result !== undefined)
                        otherLeafNodeNameCount = result;
                    mapForCounting.set(otherLeafNodeName, otherLeafNodeNameCount + 1);
                };
            }

            // find least popular leaf in solution i
            const currSolution = this[i];
            let minLeafNodeNameCount = 1000; //something high
            let minLeafNodeName = "not found";

            // get the restrictions accumulated from all the solution nodes
            const accumulatedRestrictions = currSolution.GetAccumulatedRestrictions();

            const currLeaves = currSolution.GetLeafNodes();
            for (let leafNode of currLeaves.values()) {
                const result = mapForCounting.get(leafNode.output)
                if (result !== undefined && result < minLeafNodeNameCount) {
                    minLeafNodeNameCount = result;
                    minLeafNodeName = leafNode.output;
                } else if (!mapForCounting.has(leafNode.output)) {
                    // our leaf is no where in the leafs of other solutions - we can use it!
                    minLeafNodeNameCount = 0;
                    minLeafNodeName = leafNode.output;
                }

                // now we potentially add startingSet items to restrictions
                if (mapOfStartingThings) {
                    mapOfStartingThings.forEach((value:Set<string>, key:string)=>{
                        if (key === leafNode.output) {
                            for(let char of accumulatedRestrictions){
                                accumulatedRestrictions.add(char);
                            }
                        }
                    });
                }

            }

            currSolution.SetName("sol_" + minLeafNodeName + Colors.Reset + (accumulatedRestrictions.size > 0 ? Embracketize(GetDisplayName(Array.from(accumulatedRestrictions))) : ""));
        }
    }
}
