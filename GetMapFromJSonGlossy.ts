
import { TransactionMap } from './TransactionMap';
import { SolutionNode } from './SolutionNode';
import { assert } from 'console';
import transactionsFile from './schema/mansion.json';
import _ from './schema/mansion.puzzles.schema.json';

export function GetMapFromJSonGlossy(): TransactionMap {
    const mapOfTransactionsByInput = new TransactionMap(null);
    for (let i = 0; i < transactionsFile.transactions.length; i++) {
        const type = transactionsFile.transactions[i].type;
        switch (type) {
            case _.INV1_AND_INV2_FORM_AN_INV:
                {
                    // losing all
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].inv2;
                    const output = "" + transactionsFile.transactions[i].inv3;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                }
                break;
            case _.INV1_AND_INV2_GENERATE_INV:
                {
                    // losing none
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].inv2;
                    const output = "" + transactionsFile.transactions[i].inv3;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                }
                break;
            case _.INV1_WITH_PROP1_REVEALS_PROP2_KEPT_ALL:
                {
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const inputB = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                }
                break;
            case _.INV1_BECOMES_INV2_VIA_KEEPING_INV3:
            case _.INV1_BECOMES_INV2_VIA_LOSING_INV3:
                {
                    // losing inv
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].inv2;
                    const inputB = "" + transactionsFile.transactions[i].inv3;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                }
                break;

            case _.INV1_BECOMES_INV2_VIA_KEEPING_PROP1:
                {
                    // keeping prop1
                    const inputA = "" + transactionsFile.transactions[i].inv1;
                    const output = "" + transactionsFile.transactions[i].inv2;
                    const inputB = "" + transactionsFile.transactions[i].prop1;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                }
                break;
            case _.PROP1_BECOMES_PROP2_VIA_KEEPING_INV1:
            case _.PROP1_BECOMES_PROP2_VIA_LOSING_INV1:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    const inputB = "" + transactionsFile.transactions[i].inv1;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                }
                break;
            case _.PROP1_GOES_WHEN_GRAB_INV1:
                {
                    const input = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].inv1;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input));
                }
                break;
            case _.PROP1_BECOMES_PROP2_WHEN_GRAB_INV1:
                {
                    // This is a weird one, because there are two real-life outputs
                    // but only one puzzle output. I forget how I was going to deal with this.
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    //const inputB = "" + transactionsFile.transactions[i].prop2;
                    const output = "" + transactionsFile.transactions[i].inv1;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA));
                }
                break;
            case _.TOGGLE_PROP1_BECOMES_PROP2:
                {
                    const input = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input));
                }
                break;
            case _.PROP1_BECOMES_PROP2_VIA_KEEPING_PROP3:
            case _.PROP1_BECOMES_PROP2_VIA_LOSING_PROP3:
                {
                    const inputA = "" + transactionsFile.transactions[i].prop1;
                    const output = "" + transactionsFile.transactions[i].prop2;
                    const inputB = "" + transactionsFile.transactions[i].prop3;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, inputA, inputB));
                }
                break;
            case _.OBTAIN_INV1_VIA_PROP1_WITH_PROP2_LOSE_PROPS:
                {
                    const output = "" + transactionsFile.transactions[i].inv1;
                    const input1 = "" + transactionsFile.transactions[i].prop1;
                    const input2 = "" + transactionsFile.transactions[i].prop2;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input1, input2));
                }
                break;
 
            case _.AUTO_REG1_TRIGGERS_REG2:
                {
                    const input = "" + transactionsFile.transactions[i].reg1;
                    const output = "" + transactionsFile.transactions[i].reg2;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, input));
                }
                break;
            case _.AUTO_REG1_TRIGGERED_BY_PROPS:
                {
                    const output = "" + transactionsFile.transactions[i].reg1;
                    const prop1 = "" + transactionsFile.transactions[i].prop1;
                    const prop2 = "" + transactionsFile.transactions[i].prop2;
                    const prop3 = "" + transactionsFile.transactions[i].prop3;
                    const prop4 = "" + transactionsFile.transactions[i].prop4;
                    const prop5 = "" + transactionsFile.transactions[i].prop5;
                    const prop6 = "" + transactionsFile.transactions[i].prop6;
                    mapOfTransactionsByInput.AddToMap(new SolutionNode(output, type, prop1, prop2, prop3, prop4, prop5, prop6));
                }
                break;
            case _.HACK_TO_STOP_ALLOW_TS_TO_IMPORT_THIS_FILE:
                break;
            default:
                assert(false && type && "We didn't handle a type that we're supposed to. Check to see if constant names are the same as their values in the schema.");
        }// end switch
    }// end loop

    return mapOfTransactionsByInput;
}
