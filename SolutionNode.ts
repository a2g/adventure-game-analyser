
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';
import { assert } from 'console';
import { Transaction } from './Transaction';
import { SolutionCollection } from './SolutionCollection';
import { Solution } from './Solution';
import { SpecialNodes } from './SpecialNodes';

export class SolutionNode {

    objectToObtain: string;
    a: SolutionNode|null;
    b: SolutionNode|null;

    constructor(type: string) {
        this.objectToObtain = type;
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
        if (this.a) {
            if (this.a.objectToObtain === SpecialNodes.VerifiedLeaf)
                return false;// this means its already been searhed for in the map, without success.
            else if (this.a.objectToObtain === SpecialNodes.SingleObjectVerb)
                return false;// this means its a grab, so doesn't need searching.
            const result = this.a.Process(map, currentSolution, solutions, path);
            if (result)
                return true;
        }
        if (this.b) {
            if (this.b.objectToObtain === SpecialNodes.VerifiedLeaf)
                return false;// this means its already been searhed for in the map, without success.
            else if (this.b.objectToObtain === SpecialNodes.SingleObjectVerb)
                return false;// this means its a grab, so doesn't need searching.
            const result = this.b.Process(map, currentSolution, solutions, path );
            if (result)
                return true;
        }

        // to simplify things, we always set a and b at the same time
        // so either both are null or neither are.
        if (this.a === null || this.b === null) {
            const objectToObtain = this.objectToObtain;
            if (!map.has(objectToObtain) || !map.get(objectToObtain)) {
                this.a = new SolutionNode(SpecialNodes.VerifiedLeaf);
                this.b = new SolutionNode(SpecialNodes.VerifiedLeaf);
                currentSolution.AddVerifiedLeaf([objectToObtain, path]);
                currentSolution.AddUncompletedNode(this);
            } else
            {
                const list = map.get(objectToObtain);
                assert(list); // we deliberately don't handle if(list) because it should never be null

                if (list) {
                    assert(list[0].output === objectToObtain);

                    // we have the convention that zero is the currentSolution
                    // so we start at the highest index in the list
                    // we when we finish the loop, we are with
                    const wasANull = this.a === null;
                    const wasBNull = this.b === null;
                    for (let i = list.length - 1; i >= 0; i--) {
                        // doing it one at a time is a bit inefficient
                        // eg in the case a Cloning Event, we'll be double/triple processing.
                        // but this is easier to maintain.
                        if (wasANull) {
                            currentSolution.RemoveUncompletedNode(this.a)
                            this.a = new SolutionNode(list[i].inputA);
                            currentSolution.AddUncompletedNode(this.a);
                        }

                        // we handle the Single Object Verbs by having
                        if (wasBNull) {
                            if (list[i].inputB === SpecialNodes.SingleObjectVerb) {
                                // could have just assigned inputB to this.b, but this is more explicit
                                this.b = new SolutionNode(SpecialNodes.SingleObjectVerb);
                            } else {
                                currentSolution.RemoveUncompletedNode(this.b);
                                this.b = new SolutionNode(list[i].inputB);
                                currentSolution.AddUncompletedNode(this.b);
                            }
                        }
                        if (i > 0) {
                            const clonedSolution = currentSolution.Clone();
                            solutions.array.push(clonedSolution);
                        }
   
                    }
                    
                    // if we were being efficient, then we would call the following:
                    // this.a.Process
                    // this.b.Process
                    // but I think we want to debug, right? so we go up for air.
                    
                    return true;// true triggers it to go up for air.
                }
            }
       
        }
        return false;
    }
}

