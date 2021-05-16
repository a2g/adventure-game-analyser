import { SolutionNode } from "./SolutionNode";
/**
 * need to test
 */
export class TransactionMap {
    private transactionMap: Map<string, SolutionNode[]>;

    constructor(cloneFromMe: TransactionMap | null) {
        this.transactionMap = new Map<string, SolutionNode[]>();

        if (cloneFromMe) {
            cloneFromMe.transactionMap.forEach((array: SolutionNode[], key: string) => {
                let clonedArray = new Array<SolutionNode>();
                let throwawaySet = new Set<SolutionNode>();
                array.forEach((node: SolutionNode) => {
                    let clonedNode = node.CreateClone(throwawaySet);
                    clonedArray.push(clonedNode);
                });
                this.transactionMap.set(key, clonedArray);
            });
        }
    }

    HasAnyTransactionsThatOutputObject(objectToObtain: string): boolean {
        return this.transactionMap.has(objectToObtain);
    }

    GetTransactionsThatOutputObject(objectToObtain: string): SolutionNode[] | undefined {
        return this.transactionMap.get(objectToObtain);
    }

    Has(objectToObtain: string): boolean {
        return this.transactionMap.has(objectToObtain);
    }

    Get(objectToObtain: string): SolutionNode[] | undefined {
        return this.transactionMap.get(objectToObtain);
    }

    AddToMap(t: SolutionNode) {
        // initiatize array, if it hasn't yet been
        if (!this.transactionMap.has(t.output)) {
            this.transactionMap.set(t.output, new Array<SolutionNode>());
        }
        // always add to list
        this.transactionMap.get(t.output)?.push(t);
    }

    RemoveTransaction(transaction: SolutionNode) {
        if (transaction) {
            if (this.transactionMap.has(transaction.output)) {
                const oldArray = this.transactionMap.get(transaction.output);
                if (oldArray) {
                    const newArray = new Array<SolutionNode>();
                    this.transactionMap.set(transaction.output, newArray);
                    oldArray.forEach((t: SolutionNode) => {
                        if (t !== transaction) {
                            newArray.push(t);
                        }
                    });
                }
            }
        }
    }
}