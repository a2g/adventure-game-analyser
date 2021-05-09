import { Transaction } from './Transaction';
import { Solution } from './Solution';
import { assert } from 'console';


export class SolutionCollection extends Array<Solution>{
    constructor() {
        super();
    }

    IsNodesRemaining(): boolean {
        let isNodesRemaining = false;
        this.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining())
                isNodesRemaining = true;
        });
        return isNodesRemaining;
    }

    Process(map: Map<string, Transaction[]>): boolean {
        let hasACloneJustBeenCreated = false
        this.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining()) {
                if (solution.Process(map, this))
                    hasACloneJustBeenCreated = true;
            }
        });
        return hasACloneJustBeenCreated;
    }
}
