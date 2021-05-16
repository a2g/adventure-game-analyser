import { Transaction } from "./Transaction";
/**
 * need to test
 */
export class TransactionMap {
    private transactionMap: Map<string, Transaction[]>;

    constructor(cloneFromMe: TransactionMap | null) {
        this.transactionMap = new Map<string, Transaction[]>();

        if (cloneFromMe) {
            cloneFromMe.transactionMap.forEach((array: Transaction[], key: string) => {
                const cloned = array.map(x => Object.assign({}, x));
                this.transactionMap.set(key, cloned);
            });
        }
    }

    HasAnyTransactionsThatOutputObject(objectToObtain: string): boolean {
        return this.transactionMap.has(objectToObtain);
    }

    GetTransactionsThatOutputObject(objectToObtain: string): Transaction[] | undefined {
        return this.transactionMap.get(objectToObtain);
    }

    Has(objectToObtain: string): boolean {
        return this.transactionMap.has(objectToObtain);
    }

    Get(objectToObtain: string): Transaction[] | undefined {
        return this.transactionMap.get(objectToObtain);
    }

    AddToMap(t: Transaction) {
        // initiatize array, if it hasn't yet been
        if (!this.transactionMap.has(t.output)) {
            this.transactionMap.set(t.output, new Array<Transaction>());
        }
        // always add to list
        this.transactionMap.get(t.output)?.push(t);
    }

    RemoveTransaction(transaction: Transaction) {
        if (transaction) {
            if (this.transactionMap.has(transaction.output)) {
                const oldArray = this.transactionMap.get(transaction.output);
                if (oldArray) {
                    const newArray = new Array<Transaction>();
                    this.transactionMap.set(transaction.output, newArray);
                    oldArray.forEach((t: Transaction) => {
                        if (t !== transaction) {
                            newArray.push(t);
                        }
                    });
                }
            }
        }
    }
}