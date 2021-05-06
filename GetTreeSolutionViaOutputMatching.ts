
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';
import { assert } from 'console';
import { SolutionCollection } from './SolutionCollection';
import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { SolutionNode } from './SolutionNode';


export function GetTreeSolutionViaOutputMatching(map: Map<string, Transaction[]>, solutionGoal: string): SolutionCollection {

    const collection = new SolutionCollection();
    collection.array.push(new Solution(new SolutionNode(solutionGoal)));

    do {
        collection.Process(map);
    } while (collection.IsNodesRemaining());

    return collection;
}
