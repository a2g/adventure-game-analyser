
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { SpecialNodes } from './SpecialNodes';
import { Transaction } from './Transaction';
import { assert } from 'console';

export class Solution {

    rootNode: SolutionNode;
    incompleteNodes: Set<SolutionNode>;
    absoluteLeafNodes: Map<string, string>;
    usedVerbNounCombos: Set<string>;
    transactionMap: Map<string, Transaction[]>;

    constructor(root: SolutionNode, map : Map<string, Transaction[]>) {
        this.rootNode = root;
        this.incompleteNodes = new Set<SolutionNode>();
        this.incompleteNodes.add(root);
        this.absoluteLeafNodes = new Map<string, string>();
        this.usedVerbNounCombos = new Set<string>();
        this.transactionMap = new Map<string, Transaction[]>();
        map.forEach((array: Transaction[], key: string) => {
            const cloned = array.map(x => Object.assign({}, x));
            this.transactionMap.set(key, cloned);
        });
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
            if (node.objectToObtain !== SpecialNodes.VerifiedLeaf)
                if (node.objectToObtain!== SpecialNodes.SingleObjectVerb) 
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
        const clonedRootNode = new SolutionNode(this.rootNode.objectToObtain);
        const clonedSolution = new Solution(clonedRootNode, this.transactionMap)
        if (this.rootNode.a)
            clonedSolution.rootNode.SetA(this.rootNode.a.CreateClone(clonedSolution.incompleteNodes));
        if (this.rootNode.b)
            clonedSolution.rootNode.SetB(this.rootNode.b.CreateClone(clonedSolution.incompleteNodes));
        if (!clonedSolution.rootNode.a || !clonedSolution.rootNode.b)
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
        return this.rootNode.Process(this, solutions, this.rootNode.objectToObtain);
    }

    ProcessCached(map: Map<string, Transaction[]>): void {
        this.incompleteNodes.forEach((node: SolutionNode) => {
            const objectToObtain = node.objectToObtain;
            if (!map.has(objectToObtain)) {
                node.a = new SolutionNode(SpecialNodes.VerifiedLeaf);
                node.b = new SolutionNode(SpecialNodes.VerifiedLeaf);
            }
        });
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
        return this.transactionMap.has(objectToObtain);
    }


    GetTransactionsThatOutputObject(objectToObtain: string): Transaction[] |undefined{
        return this.transactionMap.get(objectToObtain);
    }

    RemoveTransaction(transaction: Transaction) {
        if (transaction) {
            if (this.transactionMap.has(transaction.output)) {
                const oldArray = this.transactionMap.get(transaction.output);
                if (oldArray) {
                    const newArray = new Array<Transaction>();
                    this.transactionMap.set(transaction.output, newArray);
                    oldArray.forEach((t: Transaction) => {
                        if (t !== transaction) {
                            newArray.push(t);
                        }
                    });
                }
            }
        }
    }
}

