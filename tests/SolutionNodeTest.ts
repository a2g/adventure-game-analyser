//Typescript Unit test
import assert = require('assert');
import { SolutionCollection } from '../src/SolutionCollection'; 
import { SolutionNode } from '../src/SolutionNode';
import { Solution } from '../src/Solution';
import { SceneSingle } from '../src/SceneSingle';
import { SpecialNodes } from '../src/SpecialNodes';


describe("Solution", () => {
    /*
    it("Test of a none clone node", () => {
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
        let root = new SolutionNode("root", "", 1, null, "A");
        let segA = new SolutionNode("A", "", 1, null, "B");
        let segB = new SolutionNode("B", "", 1, null, "C");
        let segC = new SolutionNode("C", "", 1, null, "D");
        let segD = new SolutionNode("D", SpecialNodes.VerifiedLeaf, 1, null, "E");
        root.inputs.push(segA);
        segA.inputs.push(segB);
        segB.inputs.push(segC);
        segC.inputs.push(segD);

        root.inputHints.push("A");
        root.inputHints.push("B");
        root.inputHints.push("C");
        root.inputHints.push("B");

        
        //assert.strictEqual("", segC.G)
    });
})