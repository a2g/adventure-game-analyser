
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
            case _.INV1_AND_INV2_FORM_AN_INV:
                {
                    // losing all
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].inv2;
                    const output = "" + transactionsFile.transactions[i].inv3;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.INV1_AND_INV2_GENERATE_INV:
                {
                    // losing none
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].inv2;
                    const output = "" + transactionsFile.transactions[i].inv3;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.INV_WITH_PROP_REVEALS_PROP_KEPT_ALL:
                {
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.INV_BECOMES_INV_VIA_KEEPING_INV:
            case _.INV_BECOMES_INV_VIA_LOSING_INV:
                {
                    // losing inv
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].inv2;
                    const inputB = "" + transactionsFile.transactions[i].inv3;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.PROP_BECOMES_PROP_VIA_KEEPING_INV:
            case _.PROP_BECOMES_PROP_VIA_LOSING_INV:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    const inputB = "" + transactionsFile.transactions[i].inv1;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Use, output, inputA, inputB));
                }
                break;
            case _.PROP_GOES_WHEN_GRAB_INV:
                {
                    const input = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].inv1;
                    AddToMap(mapOfTransactionsByInput, new Transaction(type, Verb.Grab, output, input));
                }
                break;
            case _.PROP_BECOMES_PROP_WHEN_GRAB_INV:
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
