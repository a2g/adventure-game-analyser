
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';


class SolutionNode {
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
        let clone = new SolutionNode(this.objectToObtain);
        if (this.a != null)
            clone.a = this.a.createClone(uncompleted);
        if (this.b != null)
            clone.b = this.b.createClone(uncompleted);
        if (!this.a || !this.b)
            uncompleted.push(clone);
        return clone;
    }

    objectToObtain!: string;
    a?: SolutionNode;
    b?: SolutionNode;
}

class SolutionStillNeededNode extends SolutionNode{
    constructor() {
        super("stillNeeded");
        this.objectToObtain = "constructor";
    }
}

class SolutionOtherOneWasGrabNode extends SolutionNode {
    constructor() {
        super("notNeeded-transactionIsAGrab");
        this.objectToObtain = "constructor";
    }
}



class SolutionUncompletedNode extends SolutionNode {
    static const Uncompleted = "uncompleted";
    constructor() {
        super(SolutionUncompletedNode.Uncompleted);
        this.objectToObtain = "constructor";
    }
}

class Solution {

    rootNode: SolutionNode;
    hasGivenUp: boolean;
    uncompletedNodes: Array<SolutionNode>;

    constructor(root: SolutionNode) {
        this.rootNode = root;
        this.uncompletedNodes = new Array<SolutionNode>();
        this.uncompletedNodes.push(root);
        this.hasGivenUp = false;
    }


    Clone(): Solution {
        let clonedRootNode = new SolutionNode(this.rootNode.objectToObtain);
        let clonedSolution = new Solution(clonedRootNode)
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

    HasGivenUp(): boolean {
        return this.hasGivenUp;
    }

    Process(map: Map<string, Transaction[]>, node: SolutionCollection): void {
        this.uncompletedNodes.forEach((node: SolutionNode) => {
            let output = node.objectToObtain;

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

    HasGivenUp(): boolean {
        this.array.forEach((solution: Solution) => {
            if (solution.HasGivenUp())
                return true;
        });
        return false;
    }

    Process(map: Map<string, Transaction[]>) {
        this.array.forEach((solution: Solution) => {
            if (solution.HasGivenUp())
                continue;
            if (solution.HasNodesItStillNeedsToProcess()) {
                solution.Process(map, this);
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
    constructor(type: string, verb: Verb, output: string, inputA: string, inputB = "") {
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

function processSolutions(collection: SolutionCollection, map: Map<string, Transaction[]>): boolean {
    while (collection.HasNodesItStillNeedsToProcess() && !collection.HasGivenUp()) {
        collection.process(map);
    }
    return true;
}

export function SolveLeaves() : SolutionCollection{
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
    let collection = new SolutionCollection();
    let solutionGoal = new SolutionNode(transactionsFile.solutionRootPropName);
    let firstSolution = new Solution(solutionGoal);
    collection.array.push(firstSolution);
    processSolution(collection, 

    
    return collection;
}


