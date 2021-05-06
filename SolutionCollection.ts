
import transactionsFile from './schema/example2.json';
import _ from './schema/schema.json';
import { assert } from 'console';
import { Solution } from './Solution';
import { Transaction } from './Transaction';


export class SolutionCollection {

    array: Array<Solution>;

    constructor() {
        this.array = new Array<Solution>();
    }

    IsNodesRemaining(): boolean {
        this.array.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining())
                return true;
        });
        return false;
    }

    Process(map: Map<string, Transaction[]>): boolean {
        this.array.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining()) {
                const result = solution.Process(map, this);
            }
        });
        return false;
    }


}
