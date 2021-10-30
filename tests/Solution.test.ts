//Typescript Unit test
import assert = require('assert');
import { SolverViaRootNode } from '../src/SolverViaRootNode';
import { SolutionNode } from '../src/SolutionNode';
import { Solution } from '../src/Solution';
import { ReadOnlyJsonSingle } from '../src/ReadOnlyJsonSingle';


describe("Solution", () => {
    /*
    it("Test of a none clone solution", () => {
        const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = json.GenerateSolutionNodesMappedByInput();
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
        const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = json.GenerateSolutionNodesMappedByInput();
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
        const json = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = json.GenerateSolutionNodesMappedByInput();
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

    it("Solution test cloning with High Permutation scene2", () => {
        const json = new ReadOnlyJsonSingle("./tests/TestHighPermutationSolution.json");
        const startingThings = json.GetMapOfAllStartingThings();
        const collection = new SolverViaRootNode(startingThings);
        collection.InitializeByCopyingThese(json.GenerateSolutionNodesMappedByInput(), startingThings);
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();
        assert.strictEqual(false, wasCloneEncountered);

        // having this actually result in a single solution is awesome.
        // we don't want too many or it will be hard to understand
        // that the multiple solutions are the same thing.
        assert.strictEqual(collection.GetSolutions().length, 1);
        const solution0 = collection.GetSolutions()[0];
        assert.strictEqual(solution0.GetLeafNodes().size, 27);
        assert.strictEqual(solution0.GetUnprocessedNodes().size, 0);

        // process the rest of the nodes
        do {
            collection.SolvePartiallyUntilCloning();
        } while (collection.IsAnyNodesUnprocessed());

        {
            const leaves = solution0.GetLeafNodes();
            assert.strictEqual(27, leaves.size);
            assert.ok(leaves.has("/root comment 1/flag_win/inv_final_catalyst/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_switched_on_item1/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_switched_on_item2/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_switched_on_item3/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_switched_on_item4/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_switched_on_item1/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_switched_on_item2/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_switched_on_item3/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_stageB/prop_switched_on_item1/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_stageB/prop_switched_on_item2/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_stageB/prop_stageA/prop_dispatcher/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_stageD/prop_stageC/prop_stageB/prop_stageA/prop_switched_on_item1/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item1/prop_rigged_item1/prop_switch1/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item1/prop_rigged_item1/prop_attached_item1/prop_rigging_place1/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item1/prop_rigged_item1/prop_attached_item1/inv_box_of_items/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item2/prop_rigged_item2/prop_switch2/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item2/prop_rigged_item2/prop_attached_item2/prop_rigging_place2/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item2/prop_rigged_item2/prop_attached_item2/inv_box_of_items/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item3/prop_rigged_item3/prop_switch3/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item3/prop_rigged_item3/prop_attached_item3/prop_rigging_place3/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item3/prop_rigged_item3/prop_attached_item3/inv_box_of_items/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item4/prop_rigged_item4/prop_switch4/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item4/prop_rigged_item4/prop_attached_item4/prop_rigging_place4/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item4/prop_rigged_item4/prop_attached_item4/inv_box_of_items/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item5/prop_rigged_item5/prop_switch5/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item5/prop_rigged_item5/prop_attached_item5/prop_rigging_place5/"));
            assert.ok(leaves.has("/root comment 1/flag_win/prop_stageE/prop_switched_on_item5/prop_rigged_item5/prop_attached_item5/inv_box_of_items/"));
        }
    });
})