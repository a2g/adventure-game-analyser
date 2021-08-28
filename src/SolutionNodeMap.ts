import { SolutionNode } from "./SolutionNode";
/**
 * need to test
 */
export class SolutionNodeMap {
    private solutionNodeMap: Map<string, SolutionNode[]>;

    constructor(cloneFromMe: SolutionNodeMap | null) {
        this.solutionNodeMap = new Map<string, SolutionNode[]>();

        if (cloneFromMe) {
            cloneFromMe.solutionNodeMap.forEach((array: SolutionNode[], key: string) => {
                let clonedArray = new Array<SolutionNode>();
                let throwawaySet = new Set<SolutionNode>();
                array.forEach((node: SolutionNode) => {
                    let clonedNode = node.CloneNodeAndEntireTree(throwawaySet);
                    clonedArray.push(clonedNode);
                });
                this.solutionNodeMap.set(key, clonedArray);
            });
        }
    }

    GetAutos(): Array<SolutionNode> {
        const toReturn = new Array<SolutionNode>();
        this.solutionNodeMap.forEach((value: SolutionNode[]) => {
            value.forEach((node: SolutionNode) => {
                if (node.type.startsWith("AUTO")){
                    toReturn.push(node);
                }
            });
        });
        return toReturn;
    }

    HasAnyNodesThatOutputObject(objectToObtain: string): boolean {
        return this.solutionNodeMap.has(objectToObtain);
    }

    GetNodesThatOutputObject(objectToObtain: string): SolutionNode[] | undefined {
        return this.solutionNodeMap.get(objectToObtain);
    }

    Has(objectToObtain: string): boolean {
        return this.solutionNodeMap.has(objectToObtain);
    }

    Get(objectToObtain: string): SolutionNode[] | undefined {
        return this.solutionNodeMap.get(objectToObtain);
    }

    GetValues(): IterableIterator<Array<SolutionNode>>{
        return this.solutionNodeMap.values();
    }

    AddToMap(t: SolutionNode) {
        // initiatize array, if it hasn't yet been
        if (!this.solutionNodeMap.has(t.output)) {
            this.solutionNodeMap.set(t.output, new Array<SolutionNode>());
        }
        // always add to list
        this.solutionNodeMap.get(t.output)?.push(t);
    }

    RemoveNode(node: SolutionNode) {
        if (node) {
            node.count--;
            if (node.count <= 0) {
                if (this.solutionNodeMap.has(node.output)) {
                    const oldArray = this.solutionNodeMap.get(node.output);
                    if (oldArray) {
                        const newArray = new Array<SolutionNode>();
                        this.solutionNodeMap.set(node.output, newArray);
                        oldArray.forEach((t: SolutionNode) => {
                            if (t !== node) {
                                newArray.push(t);
                            }
                        });
                    }
                }
            } else {
                console.log("trans.count is now " + node.count);
            }
        }
    }
}