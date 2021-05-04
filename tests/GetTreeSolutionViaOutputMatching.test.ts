//Typescript Unit test
import assert = require('assert');
import { GetTreeSolutionViaOutputMatching } from '../GetTreeSolutionViaOutputMatching';
import { Transaction } from '../Transaction';
import { GetMapFromJSonGlossy } from '../GetMapFromJSonGlossy';


 

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