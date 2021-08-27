// This should really be handled as a chained set method that adds other sets
// but since there's one weird one in there (eg the tuple)
// and since this is needed twice, then I've put it in a method
// Maybe the best strategy is to factorize such that its only needed in one place...
export function GetSetOfStartingAll(set1: Set<[string, string]>, set2: Set<string>, set3: Set<string>) {
    const combined = new Set<string>();

    for (let blah of set1) {
        combined.add(blah[1]);
    }

    for (let blah of set2) {
        combined.add(blah);
    }

    for (let blah of set3) {
        combined.add(blah);
    }

    return combined;
}