
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { SpecialNodes } from './SpecialNodes';
import { assert } from 'console';
import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNodeInput } from './SolutionNodeInput';
import { RawObjectsAndVerb } from './RawObjectsAndVerb';
import { Raw  } from './Raw';

export class Solution {

    constructor(root: SolutionNode, map : SolutionNodeMap) {
        this.rootNode = root;
        this.incompleteNodes = new Set<SolutionNode>();
        this.incompleteNodes.add(root);
        this.absoluteLeafNodes = new Map<string, SolutionNode>();
        this.usedVerbNounCombos = new Set<string>();
        this.transactionMap = new SolutionNodeMap(map);
        
    }

    AddVerbNounCombo(verb: string, noun: string): void {
        this.usedVerbNounCombos.add(verb + noun);
    }
    HasAlreadyUsedVerbNounCombo(verb: string, noun: string): boolean {
        const isIncluded = this.usedVerbNounCombos.has(verb + noun);
        return isIncluded;
    }

    SetNodeIncomplete(node: SolutionNode | null): void {
        if (node)
            if (node.type !==SpecialNodes.VerifiedLeaf)
                    this.incompleteNodes.add(node);
    }

    SetNodeComplete(node: SolutionNode | null): void {
        if (node) {
            if (this.incompleteNodes.has(node)) {
                this.incompleteNodes.delete(node);
            }
        }
    }

    SetNodeCompleteGenuine(node: SolutionNode | null): void {
        if (node) {
            if (this.incompleteNodes.has(node)) {
                this.incompleteNodes.delete(node);
            }
        }
    }

    Clone(): Solution {
        const clonedRootNode = new SolutionNode(this.rootNode.output);
        clonedRootNode.id = this.rootNode.id;
        const clonedSolution = new Solution(clonedRootNode, this.transactionMap);
        let isAnyIncomplete = false;
        for (const node of this.rootNode.inputs) {
            const clonedNode = node.CreateClone(clonedSolution.incompleteNodes);
            clonedSolution.rootNode.inputs.push(clonedNode);
            if (clonedNode.GetInputNode() === null)
                isAnyIncomplete = true;
        }

        if (isAnyIncomplete)
            clonedSolution.incompleteNodes.add(clonedRootNode);
        this.usedVerbNounCombos.forEach((combo: string) => {
            clonedSolution.AddVerbNounCombo(combo,"");
        });
        return clonedSolution;
    }

    IsNodesRemaining(): boolean {
        return this.incompleteNodes.size > 0;
    }

    AddVerifiedLeaf(path: string, node: SolutionNode): void {
        assert(node.output);
        this.absoluteLeafNodes.set(path, node);
    }

    ProcessUntilCloning( solutions: SolutionCollection): boolean {
        const isBreakingDueToSolutionCloning = this.rootNode.ProcessUntilCloning(this, solutions,"/");
        if (!isBreakingDueToSolutionCloning) {
            // then this means the root node has rolled to completion
            this.incompleteNodes.clear();
        }
        return isBreakingDueToSolutionCloning;
    }
       
    GetLeafNodes(): Map<string, SolutionNode> {
        return this.absoluteLeafNodes;
    }

    GetIncompleteNodes(): Set<SolutionNode> {
        return this.incompleteNodes;
    }

    GetRootNode(): SolutionNode {
        return this.rootNode;
    }

    HasAnyTransactionsThatOutputObject(objectToObtain: string): boolean{
        return this.transactionMap.Has(objectToObtain);
    }


    GetTransactionsThatOutputObject(objectToObtain: string): SolutionNode[] |undefined{
        return this.transactionMap.Get(objectToObtain);
    }

    RemoveTransaction(transaction: SolutionNode) {
        this.transactionMap.RemoveTransaction(transaction);
    }



    rootNode: SolutionNode;
    incompleteNodes: Set<SolutionNode>;
    absoluteLeafNodes: Map<string, SolutionNode>;
    usedVerbNounCombos: Set<string>;
    transactionMap: SolutionNodeMap;

    GeneratePath(node: SolutionNode | null) {
        let path = "";
        while (node) {
            path =  node.output + "/" + path;
            node = node.GetParent();
        }
        return "/" + path;
    }

    GetNextDoableCommandAndDesconstructTree(setToUse: Set<string>): RawObjectsAndVerb | null {
        for (const input of this.absoluteLeafNodes) {
            const key: string = input[0];
            const node: SolutionNode = input[1];
            let areAllNodesVisible = true;

            // inputs are nearly always 2, but in one case they can be 6.. using for(;;) isn't such a useful optimizaiton here             // for (let i = 0; i < node.inputs.length; i++) {
            node.inputs.forEach((input: SolutionNodeInput) => {
                if (!setToUse.has(input.inputName)) 
                    areAllNodesVisible = false;
            });

            if (areAllNodesVisible) {
                // first we give them the prize            
                if (node.type !== SpecialNodes.VerifiedLeaf)
                    setToUse.add(node.output);

                const pathOfThis = this.GeneratePath(node);
                const pathOfParent = this.GeneratePath(node.parent);

                // then we remove this key as a leaf node..
                this.absoluteLeafNodes.delete(key);

                // ... and add a parent in its place
                if (node.parent)
                    this.absoluteLeafNodes.set(pathOfParent, node.parent);

                if (!node.parent) {
                    return new RawObjectsAndVerb(Raw.You_have_won_the_game, "", "");
                }else if (node.inputs.length === 0) {
                    return new RawObjectsAndVerb(Raw.None, "", "");
                } else if (node.type.toLowerCase().includes("grab")) {
                    return new RawObjectsAndVerb(Raw.Grab, node.inputs[0].inputName, "");
                } else if (node.type.toLowerCase().includes("toggle")) {
                    return new RawObjectsAndVerb(Raw.Toggle, node.inputs[0].inputName, "");
                } else if (node.type.toLowerCase().includes("auto")) {
                    let text = "auto using (";
                    node.inputs.forEach((node: SolutionNodeInput) => {
                        text += node.inputName + " ";
                    });
                    return new RawObjectsAndVerb(Raw.Auto, "", ""); 
                } else if (node.inputs.length === 2) {
                    return new RawObjectsAndVerb(Raw.Use, node.inputs[0].inputName, node.inputs[1].inputName);
                } else {
                    assert(false && "unknown!");
                }
            }
        };

        return null;
    }
}