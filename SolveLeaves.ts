
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';


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

export function SolveLeaves() {
    const solution = transactionsFile.solution;
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
}
