
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';
import { assert } from 'console';
import { SolutionNode } from './SolutionNode';
import { SolutionCollection } from './SolutionCollection';
import { Transaction } from './Transaction';
import { SpecialNodes } from './SpecialNodes';


export class Solution {

    rootNode: SolutionNode;
    remainingNodesToProcess: Set<SolutionNode>;
    absoluteLeafNodes: Map<string, string>;

    constructor(root: SolutionNode) {
        this.rootNode = root;
        this.remainingNodesToProcess = new Set<SolutionNode>();
        this.remainingNodesToProcess.add(root);
        this.absoluteLeafNodes = new Map<string, string>();
    }

    AddUncompletedNode(node: SolutionNode | null): void {
        if (node) {
            this.remainingNodesToProcess.add(node);
        }
    }

    RemoveUncompletedNode(node: SolutionNode|null): void {
        if (node) {
            if (this.remainingNodesToProcess.has(node)) {
                this.remainingNodesToProcess.delete(node);
            }
        }
    }

    Clone(): Solution {
        const clonedRootNode = new SolutionNode(this.rootNode.objectToObtain);
        const clonedSolution = new Solution(clonedRootNode)
        if (this.rootNode.a)
            clonedSolution.rootNode.SetA(this.rootNode.a.CreateClone(clonedSolution.remainingNodesToProcess));
        if (this.rootNode.b)
            clonedSolution.rootNode.SetA(this.rootNode.b.CreateClone(clonedSolution.remainingNodesToProcess));
        if (!clonedSolution.rootNode.a || !clonedSolution.rootNode.b)
            clonedSolution.remainingNodesToProcess.add(clonedRootNode);
        return clonedSolution;
    }

    IsNodesRemaining(): boolean {
        return this.remainingNodesToProcess.size>0;
    }

    AddVerifiedLeaf(args: [string, string]): void {
        this.absoluteLeafNodes.set(args[0],args[1]);
    }

    Process(map: Map<string, Transaction[]>, solutions: SolutionCollection): boolean {
        return this.rootNode.Process(map, this, solutions, this.rootNode.objectToObtain);
    }

    ProcessCached(map: Map<string, Transaction[]>): void {
        this.remainingNodesToProcess.forEach((node: SolutionNode) => {
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

