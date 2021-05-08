
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { Verb } from './Verb';
import { assert } from 'console';
import transactionsFile from './schema/transactions.ghost.json';
import _ from './schema/ghost.schema.json';


function AddToMap(map: Map<string, Transaction[]>, t: Transaction) {
    // initiatize array, if it hasn't yet been
    if (!map.has(t.output)) {
        map.set(t.output, new Array<Transaction>());
    }
    // always add to list
    map.get(t.output)?.push(t);
}
export function GetObjectiveFromJsonGlossy() : string{
    return transactionsFile.objectivePropName;
}
export function GetMapFromJSonGlossy(): Map<string, Transaction[]> {
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
            case _.inv_with_prop_reveals_prop_kept_all:
                {
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.inv_becomes_inv_via_keeping_inv:
            case _.inv_becomes_inv_via_losing_inv:
                {
                    // losing inv
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].inv2;
                    const inputB = "" + transactionsFile.transactions[i].inv3;
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
            case _.prop_goes_when_grab_inv:
                {
                    const input = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].inv1;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Grab, output, input));
                }
                break;
            case _.prop_becomes_prop_when_grab_inv:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const outputThatsNotUseful = "" + transactionsFile.transactions[i].prop2;
                    const output = "" + transactionsFile.transactions[i].inv1;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Grab, output, inputA));
                }
                break;
        }// end switch
    }// end loop

    return mapOfTransactionsByInput;
}
