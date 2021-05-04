//Typescript Unit test
import assert = require('assert');
import { TruthTable } from "../TruthTable";
import { GetTreeSolutionViaOutputMatching } from '../GetTreeSolutionViaOutputMatching';
import { Transaction } from '../Transaction';
import { GetMapFromJSonGlossy } from '../GetMapFromJSonGlossy';


function AddToMap(map: Map<string, Transaction[]>, t: Transaction) {
    // initiatize array, if it hasn't yet been
    if (!map.has(t.output)) {
        map.set(t.output, new Array<Transaction>());
    }
    // always add to list
    map.get(t.output)?.push(t);
}

describe("GetTreeSolutionViaOutputMatching", () => {
    it("CreateMapAndTest", () => {

        const map = GetMapFromJSonGlossy();
        const collections = GetTreeSolutionViaOutputMatching(map, "prop-death-by-guitar");

        assert.equal(1, collections.array.length);

        const collection = collections.array[0];
        const leafNodes = collection.GetLeafNodes();
        assert.equal(4, leafNodes.length);
        
    })
})