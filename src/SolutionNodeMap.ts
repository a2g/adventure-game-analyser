import { ReadOnlyJsonSingle } from "./ReadOnlyJsonSingle";
import { SolutionNode } from "./SolutionNode";
/**
 * need to test
 */
export class SolutionNodeMap {

    constructor(cloneFromMe: SolutionNodeMap | null) {
        this.solutionNodeMap = new Map<string, Set<SolutionNode>>();
        if (cloneFromMe) {
            for(let set of cloneFromMe.solutionNodeMap.values()){
                let clonedSet = new Set<SolutionNode>();
                let throwawaySet = new Set<SolutionNode>();
                for(let node of set){
                    let clonedNode = node.CloneNodeAndEntireTree(throwawaySet);
                    clonedSet.add(clonedNode);
                    this.solutionNodeMap.set(clonedNode.output, clonedSet);
                }   
            };
        }
    }

    GetAutos(): Array<SolutionNode> {
        const toReturn = new Array<SolutionNode>();
        this.solutionNodeMap.forEach((value: Set<SolutionNode>) => {
            value.forEach((node: SolutionNode) => {
                if (node.type.startsWith("AUTO")) {
                    toReturn.push(node);
                }
            });
        });
        return toReturn;
    }

    HasAnyNodesThatOutputObject(objectToObtain: string): boolean {
        return this.solutionNodeMap.has(objectToObtain);
    }

    GetNodesThatOutputObject(objectToObtain: string): Set<SolutionNode> | undefined {
        return this.solutionNodeMap.get(objectToObtain);
    }

    Has(objectToObtain: string): boolean {
        return this.solutionNodeMap.has(objectToObtain);
    }

    Get(objectToObtain: string): Set<SolutionNode> | undefined {
        return this.solutionNodeMap.get(objectToObtain);
    }

    GetValues(): IterableIterator<Set<SolutionNode>> {
        return this.solutionNodeMap.values();
    }

    AddToMap(t: SolutionNode) {
        // initiatize array, if it hasn't yet been
        if (!this.solutionNodeMap.has(t.output)) {
            this.solutionNodeMap.set(t.output, new Set<SolutionNode>());
        }
        // always add to list
        this.solutionNodeMap.get(t.output)?.add(t);
    }

    RemoveNode(node: SolutionNode) {
        if (node) {
           
            if (node.count-1 <= 0) {
                let key = node.output;
                if (this.solutionNodeMap.has(key)) {
                    const oldSet = this.solutionNodeMap.get(key);
                    if (oldSet)
                    {
                        //console.log(" old size = "+oldSet.size);
                        oldSet.delete(node);
                        //console.log(" newSize = "+oldSet.size);
                    }
                } else {
                    node.count--;
                    console.log("trans.count is now " + node.count);
                }
            }
        }
    }

    Size() {
        let count = 0;
        for(let set of this.solutionNodeMap.values()){
            count+=set.size;
        }
        return count;
    }
    
    MergeInNodesFromScene(json: ReadOnlyJsonSingle) {
       json.AddAllSolutionNodesToGivenMap(this);
    }

    private solutionNodeMap: Map<string, Set<SolutionNode>>;

}