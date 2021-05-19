
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { Solution } from './Solution';
import { assert } from 'console';
import { TransactionMap } from './TransactionMap';

export function GetTreeSolutionViaOutputMatching(map: TransactionMap, solutionGoal: string): SolutionCollection {

    const collection = new SolutionCollection();
    collection.push(new Solution(new SolutionNode("theRootNode","",solutionGoal), map));

    do {
        collection.Process();
    } while (collection.IsNodesRemaining());

    return collection;
}
