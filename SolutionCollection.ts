import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { assert } from 'console';


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
