import { SolutionCollection } from './SolutionCollection';
import { SpecialNodes } from './SpecialNodes';
import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { assert } from 'console';

export class SolutionNode {

    objectToObtain: string;
    a: SolutionNode | null;
    b: SolutionNode | null;

    constructor(objective: string) {
        assert(objective!="undefined")
        this.objectToObtain = objective;
        this.a = null;
        this.b = null;
    }

    SetA(a: SolutionNode): void {
        this.a = a;
    }

    SetB(b: SolutionNode): void {
        this.b = b;
    }

    CreateClone(uncompleted: Set<SolutionNode>): SolutionNode {
        const clone = new SolutionNode(this.objectToObtain);
        if (this.a)
            clone.a = this.a.CreateClone(uncompleted);
        if (this.b)
            clone.b = this.b.CreateClone(uncompleted);
        if (!this.a || !this.b)
            uncompleted.add(clone);
        return clone;
    }

    Process(map: Map<string, Transaction[]>, currentSolution: Solution, solutions: SolutionCollection, path: string): boolean {
        path += "/" + this.objectToObtain
        //const isGrab = (this.b && this.b.objectToObtain == SpecialNodes.TransactionIsGrab);

        // to simplify things, we always set a and b at the same time
        // so either both are null or neither are.
        if (this.a === null && this.b === null) {
            const objectToObtain = this.objectToObtain;
            if (!map.has(objectToObtain) || !map.get(objectToObtain)) {
                this.a = new SolutionNode(SpecialNodes.VerifiedLeaf);
                this.b = new SolutionNode(SpecialNodes.VerifiedLeaf);
                currentSolution.AddVerifiedLeaf(objectToObtain, path);
                currentSolution.SetNodeComplete(this);
                // since we are at a dead end
                // and since we don't need to process later on
                // then we can simply return here
                return false;
            }
            else {
                const matchingTransactions = map.get(objectToObtain);
                assert(matchingTransactions); // we deliberately don't handle if(list) because it should never be null

                if (matchingTransactions) {
                    assert(matchingTransactions[0].output === objectToObtain);

                    // this is the point we set it as completed
                    currentSolution.SetNodeCompleteGenuine(this);

                    // we have the convention that zero is the currentSolution
                    // so we start at the highest index in the list
                    // we when we finish the loop, we are with

                    for (let i = matchingTransactions.length - 1; i >= 0; i--) {

                        // 1. get solution - because we might be cloning one;
                        const isCloneBeingUsed = i > 0;
                        const theSolution = isCloneBeingUsed ? currentSolution.Clone() : currentSolution;
                        theSolution.SetNodeComplete(theSolution.rootNode);
                        if (isCloneBeingUsed)
                            solutions.push(theSolution);

                        // rediscover the current node in theSolution - again because we might be cloned
                        const theNode = theSolution.GetRootNode().FindNodeMatchingObjectiveRecursively(objectToObtain);
                        assert(theNode && "if node is null then we are cloning wrong");
                        if (theNode) {
                            // doing it one at a time is a bit inefficient
                            // eg in the case a Cloning Event, we'll be double/triple processing.
                            // but this is easier to maintain.
                            if (theNode.a == null) {
                                theNode.a = new SolutionNode(matchingTransactions[i].inputA);
                                theSolution.SetNodeIncomplete(theNode.a);
                            }

                            // we handle the Single Object Verbs by having
                            if (theNode.b == null) {
                                if (matchingTransactions[i].inputB === SpecialNodes.SingleObjectVerb) {
                                    // could have just assigned inputB to this.b, but this is more explicit
                                    theNode.b = new SolutionNode(SpecialNodes.SingleObjectVerb);
                                } else {
                                    theNode.b = new SolutionNode(matchingTransactions[i].inputB);
                                    theSolution.SetNodeIncomplete(theNode.b);
                                }
                            }
                        }
                    }

                    // if we were being efficient, then we would call the following:
                    // this.a.Process
                    // this.b.Process
                    // but I think we want to debug, right? so we go up for air.

                    // actually only go up for air if we've created new Solutions
                    // otherwise, fall through and process the nodes
                    const hasACloneJustBeenCreated = matchingTransactions.length > 1;
                    if (hasACloneJustBeenCreated)
                        return true;// yes is incomplete

                }
            }
        }

        if (this.a) {
            if (this.a.objectToObtain === SpecialNodes.VerifiedLeaf)
                return false;// this means its already been searhed for in the map, without success.
            else if (this.a.objectToObtain === SpecialNodes.SingleObjectVerb)
                return false;// this means its a grab, so doesn't need searching.
            const hasACloneJustBeenCreated = this.a.Process(map, currentSolution, solutions, path);
            if (hasACloneJustBeenCreated)
                return true;
        }
        if (this.b) {
            if (this.b.objectToObtain === SpecialNodes.VerifiedLeaf)
                return false;// this means its already been searhed for in the map, without success.
            else if (this.b.objectToObtain === SpecialNodes.SingleObjectVerb)
                return false;// this means its a grab, so doesn't need searching.
            const hasACloneJustBeenCreated = this.b.Process(map, currentSolution, solutions, path);
            if (hasACloneJustBeenCreated)
                return true;
        }
        return false;
    }

    FindNodeMatchingObjectiveRecursively(objectToObtain: string): SolutionNode | null {
        if (this.objectToObtain === objectToObtain)
            return this;
        if (this.a) {
            const result = this.a.FindNodeMatchingObjectiveRecursively(objectToObtain);
            if (result)
                return result;
        }
        if (this.b) {
            const result = this.b.FindNodeMatchingObjectiveRecursively(objectToObtain);
            if (result)
                return result;
        }
        return null;
    }
}

