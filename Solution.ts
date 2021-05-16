
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { SpecialNodes } from './SpecialNodes';
import { Transaction } from './Transaction';
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
        const clonedSolution = new Solution(clonedRootNode, this.transactionMap)
        for (let i = 0; i < this.rootNode.nodesThatMatch.length; i++) {
            const clonedNode = this.rootNode.nodesThatMatch[i].CreateClone(clonedSolution.incompleteNodes);
            clonedSolution.rootNode.nodesThatMatch.push(clonedNode);
        }

        if (!clonedSolution.rootNode.namesToMatch[0] || !clonedSolution.rootNode.namesToMatch[1])
            clonedSolution.incompleteNodes.add(clonedRootNode);
        this.usedVerbNounCombos.forEach((combo: string) => {
            clonedSolution.AddVerbNounCombo(combo,"");
        });
        return clonedSolution;
    }

    IsNodesRemaining(): boolean {
        return this.incompleteNodes.size > 0;
    }

    AddVerifiedLeaf(leafName:string, path:string): void {
        this.absoluteLeafNodes.set(leafName, path);
    }

    Process( solutions: SolutionCollection): boolean {
        return this.rootNode.Process(this, solutions, this.rootNode.output);
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