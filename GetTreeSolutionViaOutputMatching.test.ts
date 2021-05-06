//Typescript Unit test
import assert = require('assert');
import { GetTreeSolutionViaOutputMatching } from './GetTreeSolutionViaOutputMatching';
import { Transaction } from './Transaction';
import { GetMapFromJSonGlossy } from './GetMapFromJSonGlossy';


 

describe("GetTreeSolutionViaOutputMatching", () => {
    it("CreateMapAndTest", () => {

        const map = GetMapFromJSonGlossy();
        const collections = GetTreeSolutionViaOutputMatching(map, "prop-death-by-slamdunk");

        assert.strictEqual(1, collections.array.length);

        const collection = collections.array[0];
        const leafNodeMap = collection.GetLeafNodes();
        assert.strictEqual(5, leafNodeMap.size);
        assert.ok(leafNodeMap.has("inv-deflated-ball"));
        assert.ok(leafNodeMap.has("inv-pump-with-bike-adapter"));
        assert.ok(leafNodeMap.has("inv-needle"));
        assert.ok(leafNodeMap.has("prop-raised-backboard"));
        assert.ok(leafNodeMap.has("inv-pole-hook"));
    })
})