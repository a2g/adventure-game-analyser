
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';
import { assert } from 'console';


enum SpecialNodes {
    TransactionIsGrab = "TransactionIsAGrab",
    NotFound = "NotFound"
}


class SolutionNode {

    objectToObtain!: string;
    a?: SolutionNode;
    b?: SolutionNode;

    constructor(type: string) {
        this.objectToObtain = type;
        this.a = this.b;
        this.b = this.a;

    }
    setA(a: SolutionNode): void {
        this.a = a;
    }

    setB(b: SolutionNode): void {
        this.b = b;
    }
    createClone(uncompleted: Array<SolutionNode>): SolutionNode {
        const clone = new SolutionNode(this.objectToObtain);
        if (this.a)
            clone.a = this.a.createClone(uncompleted);
        if (this.b)
            clone.b = this.b.createClone(uncompleted);
        if (!this.a || !this.b)
            uncompleted.push(clone);
        return clone;
    }

    Process(map: Map<string, Transaction[]>, currentSolution: Solution, solutions: SolutionCollection): boolean {
        //const isGrab = (this.b && this.b.objectToObtain == SpecialNodes.TransactionIsGrab);
        if (this.a) {
            if (this.a.objectToObtain === SpecialNodes.NotFound)
                return false;// this means its already been searhed for in the map, without success.
            else if (this.a.objectToObtain === SpecialNodes.TransactionIsGrab)
                return false;// this means its a grab, so doesn't need searching.
            const result = this.a.Process(map, currentSolution, solutions);
            if (result)
                return true;
        }
        if (this.b) {
            if (this.b.objectToObtain === SpecialNodes.NotFound)
                return false;// this means its already been searhed for in the map, without success.
            else if (this.b.objectToObtain === SpecialNodes.TransactionIsGrab)
                return false;// this means its a grab, so doesn't need searching.
            const result = this.b.Process(map, currentSolution, solutions);
            if (result)
                return true;
        }
        if (this.a === null) {
            const objectToObtain = this.objectToObtain;
            if (map.get(objectToObtain)) {
                const list = map.get(objectToObtain);
                assert(list); // we deliberately don't handle if(list) because it should never be null

                if (list) {
                    assert(list[0].output === objectToObtain);

                    // we have the convention that zero is the currentSolution
                    // so we start at the highest index in the list
                    // we when we finish the loop, we are with

                    for (let i = list.length - 1; i >= 0; i--) {
                        // doing it one at a time is a bit inefficient
                        // eg in the case a Cloning Event, we'll be double/triple processing.
                        // but this is easier to maintain.
                        if (this.a === null) {
                            this.a = new SolutionNode(list[i].inputA);
                        }
                        if (this.b === null) {
                            this.b = new SolutionNode(list[i].inputB);
                        }
                        if (i > 0) {
                            const clonedSolution = currentSolution.Clone();
                            solutions.array.push(clonedSolution);
                        }
                    }
                    return true;// true triggers it to go up for air.
                }
            }
            else {
                this.a = new SolutionNode(SpecialNodes.NotFound);
            }
        }
        return false;
    }
}


class Solution {

    rootNode: SolutionNode;
    hasExhaustedAll: boolean;
    uncompletedNodes: Array<SolutionNode>;

    constructor(root: SolutionNode) {
        this.rootNode = root;
        this.uncompletedNodes = new Array<SolutionNode>();
        this.uncompletedNodes.push(root);
        this.hasExhaustedAll = false;
    }


    Clone(): Solution {
        const clonedRootNode = new SolutionNode(this.rootNode.objectToObtain);
        const clonedSolution = new Solution(clonedRootNode)
        if (this.rootNode.a) 
            clonedSolution.rootNode.setA(this.rootNode.a.createClone(clonedSolution.uncompletedNodes));
        if (this.rootNode.b)
            clonedSolution.rootNode.setA(this.rootNode.b.createClone(clonedSolution.uncompletedNodes));
        if (!clonedSolution.rootNode.a || !clonedSolution.rootNode.b)
            clonedSolution.uncompletedNodes.push(clonedRootNode);
        return clonedSolution;
    }

    HasNodesItStillNeedsToProcess(): boolean {
        const hasNodesItStillNeedsToProcess = this.uncompletedNodes.length > 0;
        return hasNodesItStillNeedsToProcess;
    }

    HasExhaustedAll(): boolean {
        return this.hasExhaustedAll;
    }

    Process(map: Map<string, Transaction[]>, solutions: SolutionCollection): boolean {
        return this.rootNode.Process(map, this, solutions);
    }

    ProcessCached(map: Map<string, Transaction[]>): void {
        this.uncompletedNodes.forEach((node: SolutionNode) => {
            const objectToObtain = node.objectToObtain;
            if (!map.has(objectToObtain)) {
                node.a = new SolutionNode(SpecialNodes.NotFound);
                node.b = new SolutionNode(SpecialNodes.NotFound);
            }
        });
    }


}

class SolutionCollection {

    array: Array<Solution>;

    constructor() {
        this.array = new Array<Solution>();
    }

    HasNodesItStillNeedsToProcess(): boolean {
        this.array.forEach((solution: Solution) => {
            if (solution.HasNodesItStillNeedsToProcess())
                return true;
        });
        return false;
    }

    HasExhaustedAll(): boolean {
        this.array.forEach((solution: Solution) => {
            if (solution.HasExhaustedAll())
                return true;
        });
        return false;
    }

    Process(map: Map<string, Transaction[]>) : boolean {
        this.array.forEach((solution: Solution) => {
            if (!solution.HasExhaustedAll()) {
                if (solution.HasNodesItStillNeedsToProcess()) {
                    const result = solution.Process(map, this);
                }
            }
        });
        return false;
    }


}


export enum Verb {
    Use = 0,
    Grab = 1
}

class Transaction {
    constructor(type: string, verb: Verb, output: string, inputA: string, inputB = SpecialNodes.TransactionIsGrab.toString()) {
        assert(inputB !== SpecialNodes.TransactionIsGrab || verb === Verb.Grab);
        this.type = type;
        this.verb = verb;
        this.inputA = inputA;
        this.inputB = inputB;
        this.output = output;
    }

    verb: Verb;
    type: string;
    inputA: string;
    inputB: string;
    output: string;
}



function AddToMap(map: Map<string, Transaction[]>, t: Transaction) {
    // initiatize array, if it hasn't yet been
    if (!map.has(t.output)) {
        map.set(t.output, new Array<Transaction>());
    }
    // always add to list
    map.get(t.output)?.push(t);
}

function FindSolutions(map: Map<string, Transaction[]>, solutionGoal: string): SolutionCollection {

    const collection = new SolutionCollection();
    collection.array.push(new Solution(new SolutionNode(solutionGoal)));

    while (collection.HasNodesItStillNeedsToProcess() && !collection.HasExhaustedAll()) {
        collection.Process(map);
    }

    return collection;
}

export function SolveLeaves(): SolutionCollection{
    const mapOfTransactionsByInput = new Map<string, Transaction[]>();
    for (let i = 0; i < transactionsFile.transactions.length; i++) {
        const type = transactionsFile.transactions[i].type;
        switch (transactionsFile.transactions[i].type) {
            case _.inv1_and_inv2_form_an_inv:
                {
                    // losing all
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].inv2;
                    const output = "" + transactionsFile.transactions[i].inv3;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.inv1_and_inv2_generate_inv:
                {
                    // losing none
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].inv2;
                    const output = "" + transactionsFile.transactions[i].inv3;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.inv_becomes_inv_via_losing_inv:
                {
                    // losing inv
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].inv2;
                    const inputB = "" + transactionsFile.transactions[i].inv3;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.open_prop_with_inv_reveals_prop:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const inputB = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            /*
            case _.prop_becomes_prop_via_keeping_prop:
            case _.prop_becomes_prop_via_losing_prop:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    const inputB = "" + transactionsFile.transactions[i].prop3;
                    mapOfTransactionsByInput.set(output, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;*/
            case _.prop_becomes_prop_via_keeping_inv:
            case _.prop_becomes_prop_via_losing_inv:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    const inputB = "" + transactionsFile.transactions[i].inv1;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.prop_is_picked_up:
                {
                    const input = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].prop1;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Grab, output, input));
                }
                break;
        }// end switch
    }// end loop

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

    // Map class, is complete
    const result = FindSolutions(mapOfTransactionsByInput, transactionsFile.solutionRootPropName)

    
    return result;
}


