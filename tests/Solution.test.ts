//Typescript Unit test
import assert = require('assert');
import { SolutionCollection } from '../src/SolutionCollection'; 
import { SolutionNode } from '../src/SolutionNode';
import { Solution } from '../src/Solution';
import { ScenarioFromFile } from '../src/ScenarioFromFile';


describe("Solution", () => {
    it("Testing just the grabbing of screwdriver", () => {
        const scene = new ScenarioFromFile("20210415JsonPrivate/HospScene.json");
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

    it("Test prop_death_by_guitar", () => {
        const scene = new ScenarioFromFile("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "prop_death_by_guitar";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "", objective), map));
        // process the rest of the transactions
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

    it("Test prop_death_by_slamdunk", () => {
        const scene = new ScenarioFromFile("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "prop_death_by_slamdunk";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "", objective), map));
        // process the rest of the transactions
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


    it("Test the cloning at numerous ways to kill demon", () => {
        const scene = new ScenarioFromFile("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "inv_solution";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "",  objective), map));
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();
        assert.ok(wasCloneEncountered);

        assert.strictEqual(2, collection.length);
        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafNodes().size);
        assert.strictEqual(1, solution0.GetIncompleteNodes().size);

        const solution1 = collection[1];;
        assert.strictEqual(0, solution1.GetLeafNodes().size);
        assert.strictEqual(1, solution1.GetIncompleteNodes().size);

        // process the rest of the transactions
        do {
            collection.SolvePartiallyUntilCloning();
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

  

    it("Test cloning with turn on/turn off", () => {
        const scene = new ScenarioFromFile("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "prop_death_by_physics";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "",  objective), map));
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();
        assert.strictEqual(false, wasCloneEncountered);

        assert.strictEqual(1, collection.length);
        const solution0 = collection[0];;
        assert.strictEqual(0, solution0.GetLeafNodes().size);
        assert.strictEqual(1, solution0.GetIncompleteNodes().size);

        const solution1 = collection[1];;
        assert.strictEqual(0, solution1.GetLeafNodes().size);
        assert.strictEqual(1, solution1.GetIncompleteNodes().size);

        // process the rest of the transactions
        do {
            collection.SolvePartiallyUntilCloning();
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