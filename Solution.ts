
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';
import { assert } from 'console';
import { SolutionNode } from './SolutionNode';
import { SolutionCollection } from './SolutionCollection';
import { Transaction } from './Transaction';
import { SpecialNodes } from './SpecialNodes';


export class Solution {

    rootNode: SolutionNode;
    hasExhaustedAll: boolean;
    uncompletedNodes: Array<SolutionNode>;
    leafNodes: Array<[string, string]>;

    constructor(root: SolutionNode) {
        this.rootNode = root;
        this.uncompletedNodes = new Array<SolutionNode>();
        this.uncompletedNodes.push(root);
        this.hasExhaustedAll = false;
        this.leafNodes = new Array<[string, string]>();
    }

    Clone(): Solution {
        const clonedRootNode = new SolutionNode(this.rootNode.objectToObtain);
        const clonedSolution = new Solution(clonedRootNode)
        if (this.rootNode.a)
            clonedSolution.rootNode.SetA(this.rootNode.a.CreateClone(clonedSolution.uncompletedNodes));
        if (this.rootNode.b)
            clonedSolution.rootNode.SetA(this.rootNode.b.CreateClone(clonedSolution.uncompletedNodes));
        if (!clonedSolution.rootNode.a || !clonedSolution.rootNode.b)
            clonedSolution.uncompletedNodes.push(clonedRootNode);
        return clonedSolution;
    }

    HasNodesItStillNeedsToProcess(): boolean {
        const hasNodesItStillNeedsToProcess = this.uncompletedNodes.length > 0;
        return hasNodesItStillNeedsToProcess;
    }

    HasExhaustedAll(): boolean {
        return this.hasExhaustedAll;
    }

    AddVerifiedLeaf(args: [string, string]): void {
        this.leafNodes.push(args);
    }

    Process(map: Map<string, Transaction[]>, solutions: SolutionCollection): boolean {
        return this.rootNode.Process(map, this, solutions, this.rootNode.objectToObtain);
    }

    ProcessCached(map: Map<string, Transaction[]>): void {
        this.uncompletedNodes.forEach((node: SolutionNode) => {
            const objectToObtain = node.objectToObtain;
            if (!map.has(objectToObtain)) {
                node.a = new SolutionNode(SpecialNodes.VerifiedLeaf);
                node.b = new SolutionNode(SpecialNodes.VerifiedLeaf);
            }
        });
    }

    GetLeafNodes(): Array<[string, string]> {
        return this.leafNodes;
    }
}

