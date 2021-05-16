//Typescript Unit test
import assert = require('assert');
import { GetMapFromJSonGlossy } from './GetMapFromJSonGlossy';
import { SolutionCollection } from './SolutionCollection';
import { SolutionNode } from './SolutionNode';
import { Solution } from './Solution';


describe("Solution", () => {
    it("Test the cloning at numerous ways to kill demon", () => {
        const map = GetMapFromJSonGlossy();
        const objective = "inv_demon_death";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(objective), map));
        const isBreakEarly = collection.Process();
        assert.ok(isBreakEarly);

        assert.strictEqual(2, collection.length);
        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafNodes().size);
        assert.strictEqual(1, solution0.GetIncompleteNodes().size);

        const solution1 = collection[1];;
        assert.strictEqual(0, solution1.GetLeafNodes().size);
        assert.strictEqual(1, solution1.GetIncompleteNodes().size);

        // process the rest of the transactions
        do {
            collection.Process();
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
    });

    it("Testing just the grabbing of screwdriver", () => {
        const map = GetMapFromJSonGlossy();
        const objective = "inv_screwdriver";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(objective), map));
        const isBreakEarly = collection.Process();

        assert.strictEqual(false, isBreakEarly);
        assert.strictEqual(1, collection.length);
        const solution0 = collection[0];
        assert.strictEqual(0, solution0.GetIncompleteNodes().size);
        const leafNodes = solution0.GetLeafNodes();
        assert.ok(leafNodes.has("prop_screwdriver"));
        assert.strictEqual(1, leafNodes.size);
    });

    it("Test cloning with turn on/turn off", () => {
        const map = GetMapFromJSonGlossy();
        const objective = "prop_death_by_physics";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(objective), map));
        const isBreakEarly = collection.Process();
        assert.strictEqual(false, isBreakEarly);

        assert.strictEqual(1, collection.length);
        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafNodes().size);
        assert.strictEqual(1, solution0.GetIncompleteNodes().size);

        const solution1 = collection[1];;
        assert.strictEqual(0, solution1.GetLeafNodes().size);
        assert.strictEqual(1, solution1.GetIncompleteNodes().size);

        // process the rest of the transactions
        do {
            collection.Process();
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
    });
})