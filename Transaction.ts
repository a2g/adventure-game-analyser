
import transactionsFile from './schema/transactions.ghost.json';
import _ from './schema/ghost.schema.json';
import { assert } from 'console';
import { SpecialNodes } from './SpecialNodes';
import { Verb } from './Verb';

export class Transaction {
    constructor(type: string, verb: Verb, output: string, inputA: string, inputB = SpecialNodes.SingleObjectVerb.toString()) {
        assert(inputB !== SpecialNodes.SingleObjectVerb || verb === Verb.Grab);
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

