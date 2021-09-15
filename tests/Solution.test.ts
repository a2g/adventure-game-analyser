//Typescript Unit test
import assert = require('assert');
import { SolutionCollection } from '../src/SolutionCollection';
import { SolutionNode } from '../src/SolutionNode';
import { Solution } from '../src/Solution';
import { SceneSingle } from '../src/SceneSingle';


describe("Solution", () => {
    /*
    it("Test of a none clone solution", () => {
        const scene = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "inv_screwdriver";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "", objective), map));
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();

        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        const solution0 = collection[0];
        assert.strictEqual(0, solution0.GetIncompleteNodes().size);
        const leafNodes = solution0.GetLeafNodes();
        assert.ok(leafNodes.has("prop_screwdriver"));
        assert.strictEqual(1, leafNodes.size);
    });

    it("Test of a non cloning five step", () => {
        const scene = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "prop_death_by_guitar";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "", objective), map));
        // process the rest of the nodes
        do {
            collection.SolvePartiallyUntilCloning();
        } while (collection.IsNodesRemaining());
        
        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafNodes().size);
        assert.strictEqual(1, solution0.GetIncompleteNodes().size);

        {
            const leafNodeMap = solution0.GetLeafNodes();
            assert.strictEqual(5, leafNodeMap.size);
            // commenting out the things below, because they will change
            //assert.ok(leafNodeMap.has("inv_deflated_ball"));
            //assert.ok(leafNodeMap.has("inv_pump_with_bike_adapter"));
            //assert.ok(leafNodeMap.has("inv_needle"));
            //assert.ok(leafNodeMap.has("prop_raised_backboard"));
            //assert.ok(leafNodeMap.has("inv_pole_hook"));
        }
    });

    it("Test of another non-cloning 5 step", () => {
        const scene = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "prop_death_by_slamdunk";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "", objective), map));
        // process the rest of the nodes
        do {
            collection.SolvePartiallyUntilCloning();
        } while (collection.IsNodesRemaining());


        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafNodes().size);
        assert.strictEqual(1, solution0.GetIncompleteNodes().size);

        {
            const leafNodeMap = solution0.GetLeafNodes();
            assert.strictEqual(5, leafNodeMap.size);
            // commenting out the things below, because they will change
            //assert.ok(leafNodeMap.has("inv_deflated_ball"));
            //assert.ok(leafNodeMap.has("inv_pump_with_bike_adapter"));
            //assert.ok(leafNodeMap.has("inv_needle"));
            //assert.ok(leafNodeMap.has("prop_raised_backboard"));
            //assert.ok(leafNodeMap.has("inv_pole_hook"));
        }
    });
*/

    it("Test cloning with High Permutation scene2", () => {
        const scene = new SceneSingle("./src/TestHighPermutationSolutionScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "flag_win";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "", 1, null, objective), map, new Set<string>(),));
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();
        assert.strictEqual(false, wasCloneEncountered);

        // having this actually result in a single solution is awesome.
        // we don't want too many or it will be hard to understand
        // that the multiple solutions are the same thing.
        assert.strictEqual(collection.length, 1);
        const solution0 = collection[0];
        assert.strictEqual(solution0.GetLeafNodes().size, 27);
        assert.strictEqual(solution0.GetIncompleteNodes().size, 0);

        // process the rest of the nodes
        do {
            collection.SolvePartiallyUntilCloning();
        } while (collection.IsNodesRemaining());

        {
            const leafNodeMap = solution0.GetLeafNodes();
            assert.strictEqual(27, leafNodeMap.size);
        }
    });
})