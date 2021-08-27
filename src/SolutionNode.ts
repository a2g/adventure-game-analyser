import { SolutionCollection } from './SolutionCollection';
import { SpecialNodes } from './SpecialNodes';
import { Solution } from './Solution';
//import { assert } from 'console';
import { isNullOrUndefined } from 'util';
function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error("assert failure");
    }
}

let globalId = 1;

export class SolutionNode {
    id: number;
    type: string;
    output: string;
    inputs: Array<SolutionNode|null>;
    inputHints: Array<string>;
    parent: SolutionNode|null;// this is not needed for leaf finding - but *is* needed for command finding. 
    count: number;
    characterRestrictions: Array<string>;
    constructor(output: string,
        type = "undefined",
        count = 1, // put it here so all the tests don't need to specify it.
        restrictions: { char: string }[] | null | undefined = null, // put it here so all the tests don't need to specify it.
        inputA = "undefined",
        inputB = "undefined",
        inputC = "undefined",
        inputD = "undefined",
        inputE = "undefined",
        inputF = "undefined",// no statics in typescript, so this seemed preferable than global let Null = "Null";
    ) {
        this.parent = null;
        this.id = globalId++;
        this.count = count;
        this.output = output;
        this.type = type;
        this.characterRestrictions = new Array<string>();
        if (!isNullOrUndefined(restrictions)) {
            for (const restriction of restrictions) {
                this.characterRestrictions.push(restriction.char);
            }
        }
        this.inputs = new Array<SolutionNode>();
        this.inputHints = new Array<string>();
        if (inputA !== "undefined" && inputA !== "undefined"){
            this.inputHints.push(inputA);
            this.inputs.push(null);
        }
        if (inputB !== "undefined" && inputB !== "undefined"){
            this.inputHints.push(inputB);
            this.inputs.push(null);
        }
        if (inputC !== "undefined" && inputC !== "undefined"){
            this.inputHints.push(inputC);
            this.inputs.push(null);
        }
        if (inputD !== "undefined" && inputD !== "undefined"){
            this.inputHints.push(inputD);
            this.inputs.push(null);
        }
        if (inputE !== "undefined" && inputE !== "undefined"){
            this.inputHints.push(inputE);
            this.inputs.push(null);
        }
        if (inputF !== "undefined" && inputF !== "undefined"){
            this.inputHints.push(inputF);
            this.inputs.push(null);
        }
    }

    CreateClone(uncompleted: Set<SolutionNode>): SolutionNode {
        const clone = new SolutionNode(this.output, "");
        clone.id = this.id;
        clone.type = this.type;
        clone.count = this.count;
        clone.output = this.output;

        // the hints
        for(let inputHint of this.inputHints){
            clone.inputHints.push(inputHint);
        }

        // the nodes 
        let isIncomplete = false;
        for(let input of this.inputs){
            if (input){
                const child = input.CreateClone(uncompleted);
                child.SetParent(clone);
                clone.inputs.push(child);
            }
            else{
                isIncomplete = true;
                clone.inputs.push(null);
            }
        };

        for (const restriction of this.characterRestrictions) {
            clone.characterRestrictions.push(restriction);
        }

        if (isIncomplete)
            uncompleted.add(this);

        return clone;
    }

    FindAnyNodeMatchingIdRecursively(id: number): SolutionNode | null {
        if (this.id === id)
            return this;
        for (const input of this.inputs) {
            const result = input ? input.FindAnyNodeMatchingIdRecursively(id) : null;
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
            if (this.inputs[k])
                continue;

            // we check our starting set first!
            // otherwise Toggle pieces will toggle until the count is zero.
            const objectToObtain = this.inputHints[k];
            if(solution.startingThings.has(objectToObtain)){
                const newLeaf = new SolutionNode(objectToObtain, SpecialNodes.VerifiedLeaf);
                newLeaf.parent = this;
                this.inputs[k] = newLeaf;
                solution.AddVerifiedLeaf(path + this.inputHints[k]+"/", newLeaf);
                continue;
            }

            // This is where we get all the pieces that fit
            // and if there is more than one, then we clone
            const matchingNodes = solution.GetNodesThatOutputObject(objectToObtain);
            if (!matchingNodes || matchingNodes.length === 0) {
                const newLeaf = new SolutionNode(this.inputHints[k], SpecialNodes.VerifiedLeaf);
                newLeaf.parent = this;
                this.inputs[k] = newLeaf;
                solution.AddVerifiedLeaf(path + this.inputHints[k]+"/", newLeaf);
            }
            else if (matchingNodes) {
                // we have the convention that zero is the currentSolution
                // so we start at the highest index in the list
                // we when we finish the loop, we are with
                for (let i = matchingNodes.length - 1; i >= 0; i--) {
                    // // classic forloop useful because reverse iterator, and check for last iteration

                    const theMatchingNode = matchingNodes[i];
                    
                    // Clone - if needed!
                    const isCloneBeingUsed = i > 0;
                    const theSolution = isCloneBeingUsed ? solution.Clone() : solution;

                    // This is the earliest possible point we can remove the
                    // matching node: i.e. after the cloning has occured
                    theSolution.RemoveNode(theMatchingNode);

                    // this is only here to make the unit tests make sense
                    // something like to fix a bug where cloning doesn't mark node as complete
                    theSolution.MarkNodeAsCompleted(theSolution.rootNode);
                    if (isCloneBeingUsed)
                        solutions.push(theSolution);

                    // rediscover the current node in theSolution - again because we might be cloned
                    const theNode = theSolution.GetRootNode().FindAnyNodeMatchingIdRecursively(this.id);
                    assert(theNode && "if node is null then we are cloning wrong");
                    if (theNode) {
                        theMatchingNode.parent = theNode;
                        theNode.inputs[k]=theMatchingNode; 
                        // all reactions are incomplete when they come from the node map
                        theSolution.SetNodeIncomplete(theMatchingNode);
                        theSolution.addRestrictions(theMatchingNode.getRestrictions());
                    }
                }

                const hasACloneJustBeenCreated = matchingNodes.length > 1;
                if (hasACloneJustBeenCreated)
                    return true;// yes is incomplete
            }
        }

        // this is the point we set it as completed
        solution.SetNodeCompleteGenuine(this);

        // now to process each of those nodes that have been filled out
        for (const input of  this.inputs) {
            const inputNode = input;
            assert(inputNode && "Input node=" + inputNode + " <-If this fails there is something wrong with the loop in first half of this method");
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

    getRestrictions(): Array<string> {
        return this.characterRestrictions;
    }

}

