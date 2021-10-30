import { Solution } from './Solution';
import { SolutionNode } from './SolutionNode';
import { GetDisplayName } from './GetDisplayName';
import { Colors } from './Colors';
import { Embracketize } from './Embracketize';
import { SolutionNodeMap } from './SolutionNodeMap';
import _ from './20210415JsonPrivate/Gate/Gate.json';


export class SolverViaRootNode {
    constructor(mapOfStartingThingsAndWhoCanHaveThem : Map<string, Set<string>>) {
        this.solutions = new Array<Solution>();
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
        this.solutions.push(new Solution(solutionRootNode, solutionNodesMappedByInput, mapOfStartingThingsAndWhoCanHaveThem));
    }

    IsAnyNodesUnprocessed(): boolean {
        let isAnyNodesUnprocessed = false;
        this.solutions.forEach((solution: Solution) => {
            if (solution.IsAnyNodesUnprocessed())
                isAnyNodesUnprocessed = true;
        });
        return isAnyNodesUnprocessed;
    }

    SolvePartiallyUntilCloning(): boolean {
        let hasACloneJustBeenCreated = false
        this.solutions.forEach((solution: Solution) => {
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
        for (let oldSolution of this.solutions) {
            if (!oldSolution.IsChapterWin()) {
                newList.push(oldSolution);
            }else{
                let chapterFlag = oldSolution.GetChapterWinFlag();

                // we do this here, we should really do it as part of solving
                oldSolution.UpdateMapOfVisibleThingsWithAReverseTraversal();
                let startingThings = oldSolution.GetMapOfVisibleThings();
                let mapOfRemainingNodes = oldSolution.GetMapOfCurrentlyRemainingNodes();

                const solutionRootNode = new SolutionNode("root comment 1", "", 1, null, null, "flag_win");
                let newSolution = new Solution(solutionRootNode, mapOfRemainingNodes, startingThings);
                oldSolution.CopyNameToVirginSolution(newSolution);
                // there is always a directive to merge in nodes upon chapter completion
                // so find that node, and merge in the new nodes
                newSolution.MergeInNodesForChapterCompletion(chapterFlag);

                let subGroup = new SolverViaRootNode(startingThings);
                subGroup.solutions.push(newSolution);
                subGroup.SolveUntilZeroUnprocessedNodes();// - this includes pushing a new name segment

                let debug = subGroup.solutions.length;
                for (let solution of subGroup.solutions) {
                    let isChapterWin = solution.IsChapterWin();
                    let leafNodes = solution.GetLeafNodes();
                    let isSameLeafNodesFoundInOtherSolution = false;
                    for (let otherSolution of this.solutions) {
                        let isLeafPathMissing = false;
                        otherSolution.GetLeafNodes().forEach((value: SolutionNode, leafPath: string)=>{
                            if (!leafNodes.has(leafPath)) {
                                isLeafPathMissing = true;
                            }
                        });
                        if (!isLeafPathMissing) {
                            isSameLeafNodesFoundInOtherSolution = true;
                            break;
                        }
                    }
                    if(!isSameLeafNodesFoundInOtherSolution)
                        newList.push(solution);
                }
            }
        }
        this.solutions = newList;
    }

    GenerateSolutionNamesAndPush(mapOfStartingThingsAndWhoHasThem: Map<string,Set<string>> ) {
        for (let i = 0; i < this.solutions.length; i++) {
            // now lets find out the amount leafNode name exists in all the other solutions
            const mapForCounting = new Map<string, number>();
            for (let j = 0; j < this.solutions.length; j++) {
                if (i === j)
                    continue;
                const otherSolution = this.solutions[j];
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
            const currSolution = this.solutions[i];
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

    GetSolutions():Array<Solution>{
        return this.solutions;
    }

    private solutions :Array<Solution>;
    private readonly mapOfStartingThingsAndWhoCanHaveThem: Map<string, Set<string>>;
}
