
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';
import { assert } from 'console';
import { SpecialNodes } from './SpecialNodes';
import { Verb } from './Verb';

export class Transaction {
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

