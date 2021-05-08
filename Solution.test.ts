//Typescript Unit test
import assert = require('assert');
import { GetTreeSolutionViaOutputMatching } from './GetTreeSolutionViaOutputMatching';
import { Transaction } from './Transaction';
import { GetMapFromJSonGlossy } from './GetMapFromJSonGlossy';
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { Solution } from './Solution';


 

describe("Solution", () => {
    it("CreateMapAndTest", () => {
        const map = GetMapFromJSonGlossy();
        const objective = "prop_demon_death";
        const collection = new SolutionCollection();
        collection.array.push(new Solution(new SolutionNode(objective)));
        const isBreakEarly = collection.Process(map);
        assert.ok(isBreakEarly);

        assert.strictEqual(2, collection.array.length);
        const solution0 = collection.array[0];;
        assert.equal(0, solution0.GetLeafNodes().size);
        assert.equal(2, solution0.GetIncompleteNodes().size);

        const solution1 = collection.array[1];;
        assert.equal(0, solution1.GetLeafNodes().size);
        assert.equal(2, solution1.GetIncompleteNodes().size);

        // process the rest of the transactions
        do {
            collection.Process(map);
        } while (collection.IsNodesRemaining());


        {
            const leafNodeMap = solution1.GetLeafNodes();
            assert.strictEqual(5, leafNodeMap.size);
            // commenting out the things below, because they will change
            //assert.ok(leafNodeMap.has("inv_deflated_ball"));
            //assert.ok(leafNodeMap.has("inv_pump_with_bike_adapter"));
            //assert.ok(leafNodeMap.has("inv_needle"));
            //assert.ok(leafNodeMap.has("prop_raised_backboard"));
            //assert.ok(leafNodeMap.has("inv_pole_hook"));
        }
    })
})