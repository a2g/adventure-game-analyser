import { SolutionCollection } from './SolutionCollection';
import { SpecialNodes } from './SpecialNodes';
import { Solution } from './Solution';
import { assert } from 'console';
import { SolutionNodeInput } from './SolutionNodeInput';

let globalId = 1;

export class SolutionNode {
    id: number;
    type: string 
    output: string;
    inputs: Array<SolutionNodeInput>;

    constructor(output: string,
        type  = "undefined",
        inputA = "undefined",
        inputB = "undefined",
        inputC = "undefined",
        inputD = "undefined",
        inputE = "undefined",
        inputF = "undefined",// no statics in typescript, so this seemed preferable than global let Null = "Null";
    ) {
        this.id = globalId++;
        this.output = output;
        this.type = type;
        this.inputs = new Array<SolutionNodeInput>();
        if (inputA != "undefined" && inputA !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputA));
        if (inputB != "undefined" && inputB !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputB));
        if (inputC != "undefined" && inputC !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputC));
        if (inputD != "undefined" && inputD !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputD));
        if (inputE != "undefined" && inputE !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputE));
        if (inputF != "undefined" && inputF !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputF));
    }

    CreateClone(uncompleted: Set<SolutionNode>): SolutionNode {
        const clone = new SolutionNode(this.output);
        clone.id = this.id;
        clone.type = this.type;
        clone.output = this.output;

        let isIncomplete = false;
        this.inputs.forEach((input: SolutionNodeInput) => {
            if (!input)
                isIncomplete = true;
            const child = input.CreateClone(uncompleted);
            clone.inputs.push(child);
        });
        if (isIncomplete)
            uncompleted.add(this);

        return clone;
    }

    FindAnyNodeMatchingGivenOutputRecursively(id: number): SolutionNode | null {
        if (this.id == id)
            return this;
        for (let i = 0; i < this.inputs.length; i++) {
            const input = this.inputs[i];
            const result = input.inputNode ? input.inputNode.FindAnyNodeMatchingGivenOutputRecursively(id) : null;
            if (result)
                return result;
        };
        return null;
    }

    ProcessUntilCloning(solution: Solution, solutions: SolutionCollection, path: string): boolean {
        path += "/" + this.output;
        if (this.output === SpecialNodes.VerifiedLeaf)
            return false;// false just means keep processing.

         // we do need to use a for-loop because, we clone this array then index it with k
        for (let k = 0; k < this.inputs.length; k++) {

            // without this following line, any clones will attempt to reclone themselves 
            // and Solution.ProcessUntilCompletion will continue forever
            if (this.inputs[k].inputNode)
                continue;
            const objectToObtain = this.inputs[k].inputName;
            const matchingTransactions = solution.GetTransactionsThatOutputObject(objectToObtain);
            if (!matchingTransactions || matchingTransactions.length === 0) {
                this.inputs[k].inputNode = new SolutionNode(SpecialNodes.VerifiedLeaf);
                solution.AddVerifiedLeaf(path + "/" + this.inputs[k].inputName, this.inputs[k].inputName );
            }
            else if (matchingTransactions) {
                // we have the convention that zero is the currentSolution
                // so we start at the highest index in the list
                // we when we finish the loop, we are with
                for (let i = matchingTransactions.length - 1; i >= 0; i--) {

                    const theMatchingTransaction = matchingTransactions[i];
                    // 1. get solution - because we might be cloning one;
                    const isCloneBeingUsed = i > 0;
                    const theSolution = isCloneBeingUsed ? solution.Clone() : solution;
                    // this is only here to make the unit tests make sense
                    solution.SetNodeComplete(solution.rootNode);
                    if (isCloneBeingUsed)
                        solutions.push(theSolution);

                    // rediscover the current node in theSolution - again because we might be cloned
                    const theNode = theSolution.GetRootNode().FindAnyNodeMatchingGivenOutputRecursively(this.id);
                    assert(theNode && "if node is null then we are cloning wrong");
                    if (theNode) {
                        theNode.inputs[k].inputNode = theMatchingTransaction;
                        // all transactions are incomplete when they come from the transaction map
                        theSolution.SetNodeIncomplete(theMatchingTransaction);
                    }

                    theSolution.RemoveTransaction(theMatchingTransaction);
                }

                const hasACloneJustBeenCreated = matchingTransactions.length > 1;
                if (hasACloneJustBeenCreated)
                    return true;// yes is incomplete

            }
        }

        // this is the point we set it as completed
        solution.SetNodeCompleteGenuine(this);

        // now to process each of those nodes that have been filled out
        for (let k = 0; k < this.inputs.length; k++) {
            const inputNode = this.inputs[k].inputNode;
            assert(inputNode && "If this fails there is something wrong with the loop in first half of this method");
            if (inputNode) {
                if (inputNode.output === SpecialNodes.VerifiedLeaf)
                    continue;// this means its already been searhed for in the map, without success.
                const hasACloneJustBeenCreated = inputNode.ProcessUntilCloning(solution, solutions, path);
                if (hasACloneJustBeenCreated)
                    return true;
            }
        }

        return false;
    }

}

