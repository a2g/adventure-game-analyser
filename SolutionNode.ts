import { SolutionCollection } from './SolutionCollection';
import { SpecialNodes } from './SpecialNodes';
import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { assert } from 'console';
import { Verb } from './Verb';

export class SolutionNode {
    type: string;
    output: string;
    namesToMatch: Array<string>;
    nodesThatMatch: Array<SolutionNode>;

    constructor(output: string,
        type = "Null",
        inputA = "Null",
        inputB = "Null",
        inputC = "Null",
        inputD = "Null",
        inputE = "Null",
        inputF = "Null",// no statics in typescript, so this seemed preferable than global let Null = "Null";
    ) {
        this.output = output;
        this.type = type;
        this.namesToMatch = new Array<string>();
        this.nodesThatMatch = new Array<SolutionNode>();
        if (inputA !== "Null")
            this.namesToMatch.push(inputA);
        if (inputB !== "Null")
            this.namesToMatch.push(inputB);
        if (inputC !== "Null")
            this.namesToMatch.push(inputC);
        if (inputD !== "Null")
            this.namesToMatch.push(inputD);
        if (inputE !== "Null")
            this.namesToMatch.push(inputE);
        if (inputF !== "Null")
            this.namesToMatch.push(inputF);
    }



    CreateClone(uncompleted: Set<SolutionNode>): SolutionNode {
        const clone = new SolutionNode(this.output);

        this.nodesThatMatch.forEach((node: SolutionNode) => {
            const child = node.CreateClone(uncompleted);
            clone.nodesThatMatch.push(child);
        });

        this.namesToMatch.forEach((name: string) => {
            clone.namesToMatch.push(name);
        });
        // if (!this.a || !this.b)
        //   uncompleted.add(clone);
        return clone;
    }


    FindNodeMatchingObjectiveRecursively(objectToObtain: string): SolutionNode | null {
        if (this.output === objectToObtain)
            return this;
        for (let i = 0; i < this.nodesThatMatch.length; i++) {
            const result = this.nodesThatMatch[i].FindNodeMatchingObjectiveRecursively(objectToObtain);
            if (result)
                return result;
        }
        return null;
    }

    Process(solution: Solution, solutions: SolutionCollection, path: string): boolean {
        path += "/" + this.output;
        if (this.output === SpecialNodes.VerifiedLeaf)
            return false;// false just means keep processing.

        // to simplify things, we always set a and b at the same time
        // so either both are null or neither are.
        if (this.namesToMatch.length == 0) {
            const objectToObtain = this.output;
            if (!solution.HasAnyTransactionsThatOutputObject(objectToObtain) || !solution.GetTransactionsThatOutputObject(objectToObtain)) {
                let node = new SolutionNode(SpecialNodes.VerifiedLeaf);
                solution.AddVerifiedLeaf(objectToObtain, path);
                solution.SetNodeComplete(this);
        		// since we are at a dead end
                // and since we don't need to process later on
                // then we can simply return here
                return false;
            }
            else {
                const matchingTransactions = solution.GetTransactionsThatOutputObject(objectToObtain);
                assert(matchingTransactions); // we deliberately don't handle if(list) because it should never be null

                if (matchingTransactions) {
                    assert(matchingTransactions[0].output === objectToObtain);

                    // this is the point we set it as completed
                    solution.SetNodeCompleteGenuine(this);

                    // we have the convention that zero is the currentSolution
                    // so we start at the highest index in the list
                    // we when we finish the loop, we are with

                    for (let i = matchingTransactions.length - 1; i >= 0; i--) {

                        const theMatchingTransaction = matchingTransactions[i];
                        // 1. get solution - because we might be cloning one;
                        const isCloneBeingUsed = i > 0;
                        const theSolution = isCloneBeingUsed ? solution.Clone() : solution;
                        theSolution.SetNodeComplete(theSolution.rootNode);
                        if (isCloneBeingUsed)
                            solutions.push(theSolution);

                        // rediscover the current node in theSolution - again because we might be cloned
                        const theNode = theSolution.GetRootNode().FindNodeMatchingObjectiveRecursively(objectToObtain);
                        assert(theNode && "if node is null then we are cloning wrong");
                        if (theNode) {
                            for (let j = 0; j < theMatchingTransaction.namesToMatch.length; j++) {
                                theNode.nodesThatMatch.push(new SolutionNode(theMatchingTransaction.namesToMatch[j]));
                            }
                        }

                        theSolution.RemoveTransaction(theMatchingTransaction);
                    }

                    const hasACloneJustBeenCreated = matchingTransactions.length > 1;
                    if (hasACloneJustBeenCreated)
                        return true;// yes is incomplete

                }
            }

        }

        // now to process each of those nodes that have been pushed
        for (let i = 0; i < this.nodesThatMatch.length; i++) {
            let transaction = this.nodesThatMatch[i];
            if (transaction.output === SpecialNodes.VerifiedLeaf)
                return false;// this means its already been searhed for in the map, without success.
            const hasACloneJustBeenCreated = transaction.Process(solution, solutions, path);
            if (hasACloneJustBeenCreated)
                return true;
        }

        return false;
    }

}

