
import transactionsFile from './example2.json';
import _ from './schema.json';
import schema2 from './schema2.json';


export enum Verb {
    Use = 0,
    Grab = 1
}

class Transaction {
    constructor(verb: Verb, output:string, inputA:string, inputB = "") {
        this.verb = verb;
        this.inputA = inputA;
        this.inputB = inputB;
        this.output = output;
    }

    verb: Verb;
    inputA: string;
    inputB: string;
    output: string;
}

export function SolveLeaves() {
    let s = schema2.definitions.blah.blahblahblah;
    const mapOfTransactionsByInput = new Map<string, Transaction>();
    for (let i = 0; i < transactionsFile.transactions.length; i++) {
        switch (transactionsFile.transactions[i].type) {
            case _.inv1_and_inv2_create_an_inv:
                {
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].inv2;
                    const output = "" + transactionsFile.transactions[i].inv3;
                    mapOfTransactionsByInput.set(output, new Transaction(Verb.Grab, output, inputA, inputB));
                }
                break;
            case _.inv1_and_inv2_generate_inv:
            case _.prop_is_picked_up:
                {
                    const input = "" +transactionsFile.transactions[i].inv1;
                    const output = "" +transactionsFile.transactions[i].prop1;
                    mapOfTransactionsByInput.set(output, new Transaction(Verb.Grab, output, input));
                }
                break;
            case _.open_prop_with_inv_reveals_prop:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const inputB = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    mapOfTransactionsByInput.set(output, new Transaction(Verb.Use, output, inputA, inputB));
                }
                break;
            case _.inv_becomes_inv_via_losing_inv:
                {
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].prop1;
                    const inputB = "" + transactionsFile.transactions[i].inv2;
                    mapOfTransactionsByInput.set(output, new Transaction(Verb.Use, output, inputA, inputB));
                }
                break;
            case _.prop_becomes_prop_via_losing_inv:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    const inputB = "" + transactionsFile.transactions[i].inv1;
                    mapOfTransactionsByInput.set(output, new Transaction(Verb.Use, output, inputA, inputB));
                }
                break;
            case _.prop_becomes_prop_via_keeping_inv:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    const inputB = "" + transactionsFile.transactions[i].inv1;
                    mapOfTransactionsByInput.set(output, new Transaction(Verb.Use, output, inputA, inputB));
                }
                break;
        }
    }
}
