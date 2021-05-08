import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { assert } from 'console';


export class SolutionCollection {

    array: Array<Solution>;

    constructor() {
        this.array = new Array<Solution>();
    }

    IsNodesRemaining(): boolean {
        let isNodesRemaining = false;
        this.array.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining())
                isNodesRemaining = true;
        });
        return isNodesRemaining;
    }

    Process(map: Map<string, Transaction[]>): boolean {
        let hasACloneJustBeenCreated = false
        this.array.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining()) {
                if (solution.Process(map, this))
                    hasACloneJustBeenCreated = true;
            }
        });
        return hasACloneJustBeenCreated;
    }


}
