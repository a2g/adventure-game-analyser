
import transactionsFile from './schema/transactions.ghost.json';
import _ from './schema/ghost.schema.json';
import { assert } from 'console';
import { SpecialNodes } from './SpecialNodes';
import { Verb } from './Verb';

export class Transaction {
    constructor(type: string,
        verb: Verb,
        output: string,
        inputA: string,
        inputB = SpecialNodes.SingleObjectVerb.toString(),
        inputC = SpecialNodes.SingleObjectVerb.toString(),
        inputD = SpecialNodes.SingleObjectVerb.toString(),
        inputE = SpecialNodes.SingleObjectVerb.toString(),
        inputF = SpecialNodes.SingleObjectVerb.toString(),
    ) {
        assert(inputB !== SpecialNodes.SingleObjectVerb || verb === Verb.Grab);
        this.type = type;
        this.verb = verb;
        this.output = output;
        this.inputA = inputA;
        this.inputB = inputB;
        this.inputC = inputC;
        this.inputD = inputD;
        this.inputE = inputE;
        this.inputF = inputF;

    }

    verb: Verb;
    type: string;
    output: string;
    inputA: string;
    inputB: string;
    inputC: string;
    inputD: string;
    inputE: string;
    inputF: string;

}

