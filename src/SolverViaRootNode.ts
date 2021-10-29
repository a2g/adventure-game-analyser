import { Solution } from './Solution';
import { SolutionNode } from './SolutionNode';
import { GetDisplayName } from './GetDisplayName';
import { Colors } from './Colors';
import { Embracketize } from './Embracketize';
import { SolutionNodeMap } from './SolutionNodeMap';
import _ from './20210415JsonPrivate/Gate/Gate.json';


export class SolverViaRootNode {
    constructor(mapOfStartingThingsAndWhoCanHaveThem : Map<string, Set<string>>) {
        this.array = new Array<Solution>();
        this.mapOfStartingThingsAndWhoCanHaveThem = new Map<string,Set<string> >();
        mapOfStartingThingsAndWhoCanHaveThem.forEach((value: Set<string>, key: string) => {
            let newSet = new Set<string>();
            for(let item of value){
                newSet.add(item);
            }
            this.mapOfStartingThingsAndWhoCanHaveThem.set(key,newSet);
        });
    }

    InitializeByCopyingThese(solutionNodesMappedByInput: SolutionNodeMap, mapOfStartingThingsAndWhoCanHaveThem: Map<string,Set<string>>) {
        const solutionRootNode = new SolutionNode("root comment 1", "", 1, null, null, "flag_win");
        this.array.push(new Solution(solutionRootNode, solutionNodesMappedByInput, mapOfStartingThingsAndWhoCanHaveThem));
    }

    IsAnyNodesUnprocessed(): boolean {
        let isAnyNodesUnprocessed = false;
        this.array.forEach((solution: Solution) => {
            if (solution.IsAnyNodesUnprocessed())
                isAnyNodesUnprocessed = true;
        });
        return isAnyNodesUnprocessed;
    }

    SolvePartiallyUntilCloning(): boolean {
        let hasACloneJustBeenCreated = false
        this.array.forEach((solution: Solution) => {
            if (solution.IsAnyNodesUnprocessed()) {
                if(!solution.IsArchived()){
                     if (solution.ProcessUntilCloning(this)){
                        hasACloneJustBeenCreated = true;
                     }
                }
            }
        });
        return hasACloneJustBeenCreated;
    }

    SolveUntilZeroUnprocessedNodes() {
        do {
            this.SolvePartiallyUntilCloning();
        } while (this.IsAnyNodesUnprocessed());

        this.GenerateSolutionNamesAndPush(this.mapOfStartingThingsAndWhoCanHaveThem);
    }

    ProcessChaptersToEndAndUpdateList() {
        let newList = new Array<Solution>();
        for (let oldSolution of this.array) {
            if (!oldSolution.IsChapterWin()) {
                newList.push(oldSolution);
            }else{
                let chapterFlag = oldSolution.GetChapterWinFlag();

                // we do this here, we should really do it as part of solving
                oldSolution.UpdateMapOfVisibleThingsWithAReverseTraversal();
                let startingThings = oldSolution.GetMapOfVisibleThings();
                let mapOfRemainingNodes = oldSolution.GetMapOfCurrentlyRemainingNodes();

                const solutionRootNode = new SolutionNode("root comment 2", "", 1, null, null, "flag_win");
                let newSolution = new Solution(solutionRootNode, mapOfRemainingNodes, startingThings);
                oldSolution.CopyNameToVirginSolution(newSolution);
                // there is always a directive to merge in nodes upon chapter completion
                // so find that node, and merge in the new nodes
                newSolution.MergeInNodesForChapterCompletion(chapterFlag);

                let subGroup = new SolverViaRootNode(startingThings);
                subGroup.array.push(newSolution);
                subGroup.SolveUntilZeroUnprocessedNodes();// - this includes pushing a new name segment

                let debug = subGroup.array.length;
                for (let subItem of subGroup.array) {
                    let isChapterWin = subItem.IsChapterWin();
                    newList.push(subItem);
                }
            }
        }
        this.array = newList;
    }

    GenerateSolutionNamesAndPush(mapOfStartingThingsAndWhoHasThem: Map<string,Set<string>> ) {
        for (let i = 0; i < this.array.length; i++) {
            // now lets find out the amount leafNode name exists in all the other solutions
            const mapForCounting = new Map<string, number>();
            for (let j = 0; j < this.array.length; j++) {
                if (i === j)
                    continue;
                const otherSolution = this.array[j];
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
            const currSolution = this.array[i];
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
                if (mapOfStartingThingsAndWhoHasThem) {
                    mapOfStartingThingsAndWhoHasThem.forEach((chars:Set<string>, key:string)=>{
                        if (key === leafNode.output) {
                            for(let char of chars){
                                accumulatedRestrictions.add(char);
                            }
                        }
                    });
                }

            }

            currSolution.PushNameSegment("sol_" + minLeafNodeName + Colors.Reset + (accumulatedRestrictions.size > 0 ? Embracketize(GetDisplayName(Array.from(accumulatedRestrictions))) : ""));
        }
    }

    array:Array<Solution>;
    readonly mapOfStartingThingsAndWhoCanHaveThem: Map<string, Set<string>>;
}
