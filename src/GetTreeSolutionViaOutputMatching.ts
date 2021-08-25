
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { Solution } from './Solution';
import { assert } from 'console';
import { SolutionNodeMap } from './SolutionNodeMap';

export function GetTreeSolutionViaOutputMatching(map: SolutionNodeMap, solutionGoal: string, startings: Set<string>): SolutionCollection {

    const collection = new SolutionCollection(startings);
    collection.push(new Solution(new SolutionNode("theRootNode", "", 1, null, solutionGoal), map));

    do {
        collection.SolvePartiallyUntilCloning();
    } while (collection.IsNodesRemaining());

    return collection;
}
