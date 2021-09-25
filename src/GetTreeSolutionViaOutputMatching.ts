
import { SolverViaRootNode } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { Solution } from './Solution';
import { assert } from 'console';
import { SolutionNodeMap } from './SolutionNodeMap';

export function GetTreeSolutionViaOutputMatching(map: SolutionNodeMap, solutionGoal: string, startings: Set<string>): SolverViaRootNode {

    const collection = new SolverViaRootNode();
    collection.push(new Solution(new SolutionNode("theRootNode", "", 1, null, solutionGoal), map, startings));

    do {
        collection.SolvePartiallyUntilCloning();
    } while (collection.IsNodesRemaining());

    return collection;
}
