import { SolverViaRootNode } from './SolverViaRootNode';
import { SolutionNode } from './SolutionNode';
import { Solution } from './Solution';
import { SolutionNodeMap } from './SolutionNodeMap';

export function GetTreeSolutionViaOutputMatching(map: SolutionNodeMap, solutionGoal: string, startings: Map<string, Set<string>>): SolverViaRootNode {

  const collection = new SolverViaRootNode(startings);
  collection.GetSecondaryGoals().push(new Solution(new SolutionNode("theRootNode", "", 1, null, null, solutionGoal), map, startings));

  do {
    collection.SolvePartiallyUntilCloning();
  } while (collection.IsAnyNodesUnprocessed());

  return collection;
}
