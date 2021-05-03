
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

    HasNodesItStillNeedsToProcess(): boolean {
        this.array.forEach((solution: Solution) => {
            if (solution.HasNodesItStillNeedsToProcess())
                return true;
        });
        return false;
    }

    HasExhaustedAll(): boolean {
        this.array.forEach((solution: Solution) => {
            if (solution.HasExhaustedAll())
                return true;
        });
        return false;
    }

    Process(map: Map<string, Transaction[]>) : boolean {
        this.array.forEach((solution: Solution) => {
            if (!solution.HasExhaustedAll()) {
                if (solution.HasNodesItStillNeedsToProcess()) {
                    const result = solution.Process(map, this);
                }
            }
        });
        return false;
    }


}
