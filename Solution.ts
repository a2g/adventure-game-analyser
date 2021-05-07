
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
        if (node) {
            this.incompleteNodes.add(node);
        }
    }

    SetNodeComplete(node: SolutionNode | null): void {
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
            clonedSolution.rootNode.SetA(this.rootNode.b.CreateClone(clonedSolution.incompleteNodes));
        if (!clonedSolution.rootNode.a || !clonedSolution.rootNode.b)
            clonedSolution.incompleteNodes.add(clonedRootNode);
        return clonedSolution;
    }

    IsNodesRemaining(): boolean {
        return this.incompleteNodes.size > 0;
    }

    AddVerifiedLeaf(args: [string, string]): void {
        this.absoluteLeafNodes.set(args[0], args[1]);
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
}

