
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { SpecialNodes } from './SpecialNodes';
import { assert } from 'console';
import { TransactionMap } from './TransactionMap';

export class Solution {

    rootNode: SolutionNode;
    incompleteNodes: Set<SolutionNode>;
    absoluteLeafNodes: Map<string, string>;
    usedVerbNounCombos: Set<string>;
    transactionMap: TransactionMap;

    constructor(root: SolutionNode, map : TransactionMap) {
        this.rootNode = root;
        this.incompleteNodes = new Set<SolutionNode>();
        this.incompleteNodes.add(root);
        this.absoluteLeafNodes = new Map<string, string>();
        this.usedVerbNounCombos = new Set<string>();
        this.transactionMap = new TransactionMap(map);
        
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
            if (node.output !== SpecialNodes.VerifiedLeaf)
                if (node.output!== SpecialNodes.SingleObjectVerb) 
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
        for (let i = 0; i < this.rootNode.inputs.length; i++) {
            const clonedNode = this.rootNode.inputs[i].CreateClone(clonedSolution.incompleteNodes);
            clonedSolution.rootNode.inputs.push(clonedNode);
            if (clonedNode.inputNode === null)
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

    AddVerifiedLeaf(path: string, leafName: string): void {
        assert(leafName);
        this.absoluteLeafNodes.set(path, leafName);
    }

    ProcessUntilCloning( solutions: SolutionCollection): boolean {
        const isBreakingDueToSolutionCloning = this.rootNode.ProcessUntilCloning(this, solutions,"");
        if (!isBreakingDueToSolutionCloning) {
            // then this means the root node has rolled to completion
            this.incompleteNodes.clear();
        }
        return isBreakingDueToSolutionCloning;
    }

    GetLeafNodes(): Map<string, string> {
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
}