import { SolutionCollection } from './SolutionCollection';
import { SpecialNodes } from './SpecialNodes';
import { Solution } from './Solution';
import { assert } from 'console';
import { SolutionNodeInput } from './SolutionNodeInput';

let globalId = 1;

export class SolutionNode {
    id: number;
    type: string;
    output: string;
    inputs: Array<SolutionNodeInput>;
    parent: SolutionNode|null;// this is not needed for leaf finding - but *is* needed for command finding. 
    count: number;
    characters: Array<string>;
    constructor(output: string,
        type = "undefined",
        inputA = "undefined",
        inputB = "undefined",
        count = 1, // put it here so all the tests don't need to specify it.
        inputC = "undefined",
        inputD = "undefined",
        inputE = "undefined",
        inputF = "undefined",// no statics in typescript, so this seemed preferable than global let Null = "Null";
        characters = new Array<string>()
    ) {
        this.parent = null;
        this.id = globalId++;
        this.count = count;
        this.output = output;
        this.type = type;
        this.characters = characters;
        this.inputs = new Array<SolutionNodeInput>();
        if (inputA !== "undefined" && inputA !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputA));
        if (inputB !== "undefined" && inputB !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputB));
        if (inputC !== "undefined" && inputC !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputC));
        if (inputD !== "undefined" && inputD !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputD));
        if (inputE !== "undefined" && inputE !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputE));
        if (inputF !== "undefined" && inputF !== "undefined")
            this.inputs.push(new SolutionNodeInput(inputF));
    }

    CreateClone(uncompleted: Set<SolutionNode>): SolutionNode {
        const clone = new SolutionNode(this.output);
        clone.id = this.id;
        clone.type = this.type;
        clone.count = this.count;
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
        if (this.id === id)
            return this;
        for (const input of this.inputs) {
            const inputNode = input.GetInputNode();
            const result = inputNode ? inputNode.FindAnyNodeMatchingGivenOutputRecursively(id) : null;
            if (result)
                return result;
        };
        return null;
    }

    ProcessUntilCloning(solution: Solution, solutions: SolutionCollection, path: string): boolean {
        path +=  this.output + "/";
        if (this.type === SpecialNodes.VerifiedLeaf)
            return false;// false just means keep processing.

        for (let k = 0; k < this.inputs.length; k++) {// classic forloop useful because shared index on cloned node

            // without this following line, any clones will attempt to reclone themselves 
            // and Solution.ProcessUntilCompletion will continue forever
            if (this.inputs[k].GetInputNode())
                continue;
            const objectToObtain = this.inputs[k].inputName;
            const matchingTransactions = solution.GetTransactionsThatOutputObject(objectToObtain);
            if (!matchingTransactions || matchingTransactions.length === 0) {
                const verifiedLeaf = new SolutionNode(this.inputs[k].inputName, SpecialNodes.VerifiedLeaf);
                this.inputs[k].SetInputNode(verifiedLeaf, this);
                solution.AddVerifiedLeaf(path + this.inputs[k].inputName+"/", verifiedLeaf );
            }
            else if (matchingTransactions) {
                // we have the convention that zero is the currentSolution
                // so we start at the highest index in the list
                // we when we finish the loop, we are with
                for (let i = matchingTransactions.length - 1; i >= 0; i--) {// // classic forloop useful because reverse iterator, and check for last iteration

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
                        theNode.inputs[k].SetInputNode(theMatchingTransaction, theNode);
                        // all reactions are incomplete when they come from the transaction map
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
        for (const input of  this.inputs) {
            const inputNode = input.GetInputNode();
            assert(inputNode && "If this fails there is something wrong with the loop in first half of this method");
            if (inputNode) {
                if (inputNode.type === SpecialNodes.VerifiedLeaf)
                    continue;// this means its already been searhed for in the map, without success.
                const hasACloneJustBeenCreated = inputNode.ProcessUntilCloning(solution, solutions, path);
                if (hasACloneJustBeenCreated)
                    return true;
            }
        }

        return false;
    }

    SetParent(parent: SolutionNode|null) {
        this.parent = parent;
    }

    GetParent(): SolutionNode | null {
        return this.parent;
    }

}

