
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { assert } from 'console';

export function GetTreeSolutionViaOutputMatching(map: Map<string, Transaction[]>, solutionGoal: string): SolutionCollection {

    const collection = new SolutionCollection();
    collection.array.push(new Solution(new SolutionNode(solutionGoal)));

    do {
        collection.Process(map);
    } while (collection.IsNodesRemaining());

    return collection;
}
