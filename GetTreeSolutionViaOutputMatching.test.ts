//Typescript Unit test
import assert = require('assert');
import { GetTreeSolutionViaOutputMatching } from './GetTreeSolutionViaOutputMatching';
import { Transaction } from './Transaction';
import { GetMapFromJSonGlossy } from './GetMapFromJSonGlossy';


 

describe("GetTreeSolutionViaOutputMatching", () => {
    it("CreateMapAndTest", () => {
        const map = GetMapFromJSonGlossy();
        const collections = GetTreeSolutionViaOutputMatching(map, "prop_demon_death");

        assert.strictEqual(1, collections.array.length);

        const collection = collections.array[0];
        const leafNodeMap = collection.GetLeafNodes();
        assert.strictEqual(5, leafNodeMap.size);
        assert.ok(leafNodeMap.has("inv_deflated_ball"));
        assert.ok(leafNodeMap.has("inv_pump_with_bike_adapter"));
        assert.ok(leafNodeMap.has("inv_needle"));
        assert.ok(leafNodeMap.has("prop_raised_backboard"));
        assert.ok(leafNodeMap.has("inv_pole_hook"));
    })
})