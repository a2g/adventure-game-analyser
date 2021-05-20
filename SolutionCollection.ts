import { Solution } from './Solution';


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

    ProcessUntilCloning(): boolean {
        let hasACloneJustBeenCreated = false
        this.forEach((solution: Solution) => {
            if (solution.IsNodesRemaining()) {
                if (solution.ProcessUntilCloning(this))
                    hasACloneJustBeenCreated = true;
            }
        });
        return hasACloneJustBeenCreated;
    }

    ProcessUntilCompletion() {
        do {
            this.ProcessUntilCloning();
        } while (this.IsNodesRemaining());
    }
}
