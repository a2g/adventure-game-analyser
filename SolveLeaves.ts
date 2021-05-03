
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';
import { assert } from 'console';
import { SolutionCollection } from './SolutionCollection';
import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { SolutionNode } from './SolutionNode';
import { Verb } from './Verb';
import { GetMapFromJSonGlossy } from './GetMapFromJSonGlossy';
import { GetTreeSolutionViaOutputMatching } from './GetTreeSolutionViaOutputMatching';

export function SolveLeaves(): SolutionCollection {
   
    // so the way we get a solution, is we create a solution object
    // then we keep constructing a graph node by node.
    // when we hit a multimap with more than one transaction to produce a certain output
    // then we clone the entire map.
    // its possibly an infinite graph - we need to test for an upper limit on the number of nodes.
    // but its not a cyclical graph, because of the way we construct it, only with V's 
    // 
    // leaf nodes can be unterminated, or terminated - after we find that a leaf cannot be further resolved.
    // this stops it being visited again.
    // 

    const mapOfTransactionsByInput = GetMapFromJSonGlossy();
    const result = GetTreeSolutionViaOutputMatching(mapOfTransactionsByInput, transactionsFile.solutionRootPropName)

    
    return result;
}


