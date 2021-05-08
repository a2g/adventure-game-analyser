
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { SpecialNodes } from './SpecialNodes';
import { Transaction } from './Transaction';
import { assert } from 'console';

export class Solution {

    rootNode: SolutionNode;
    incompleteNodes: Set<SolutionNode>;
    absoluteLeafNodes: Map<string, string>;

    constructor(root: SolutionNode) {
        this.rootNode = root;
        this.incompleteNodes = new Set<SolutionNode>();
        this.incompleteNodes.add(root);
        this.absoluteLeafNodes = new Map<string, string>();
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
        const clonedSolution = new Solution(clonedRootNode)
        if (this.rootNode.a)
            clonedSolution.rootNode.SetA(this.rootNode.a.CreateClone(clonedSolution.incompleteNodes));
        if (this.rootNode.b)
            clonedSolution.rootNode.SetB(this.rootNode.b.CreateClone(clonedSolution.incompleteNodes));
        if (!clonedSolution.rootNode.a || !clonedSolution.rootNode.b)
            clonedSolution.incompleteNodes.add(clonedRootNode);
        return clonedSolution;
    }

    IsNodesRemaining(): boolean {
        return this.incompleteNodes.size > 0;
    }

    AddVerifiedLeaf(leafName:string, path:string): void {
        this.absoluteLeafNodes.set(leafName, path);
    }

    Process(map: Map<string, Transaction[]>, solutions: SolutionCollection): boolean {
        return this.rootNode.Process(map, this, solutions, this.rootNode.objectToObtain);
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
}

