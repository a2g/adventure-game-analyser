
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { Solution } from './Solution';
import { assert } from 'console';
import { SolutionNodeMap } from './SolutionNodeMap';

export function GetTreeSolutionViaOutputMatching(map: SolutionNodeMap, solutionGoal: string): SolutionCollection {

    const collection = new SolutionCollection();
    collection.push(new Solution(new SolutionNode("theRootNode", "", solutionGoal), map));

    do {
        collection.ProcessUntilCloning();
    } while (collection.IsNodesRemaining());

    return collection;
}
