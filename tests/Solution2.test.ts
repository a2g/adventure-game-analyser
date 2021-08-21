//Typescript Unit test
import assert = require('assert');
import { SolutionCollection } from '../src/SolutionCollection';
import { SolutionNode } from '../src/SolutionNode';
import { Solution } from '../src/Solution';
import { SceneSingle } from '../src/SceneSingle';
const testName = "root via test";

describe("Solution", () => {
    it("Testing just the grabbing of screwdriver", () => {

        // arrange
        const scene = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "inv_screwdriver";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "", objective), map));

        // act 
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();

        // assert
        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        assert.strictEqual(0, collection[0].GetIncompleteNodes().size);
        assert.ok(collection[0].GetLeafNodes().has("//inv_screwdriver/prop_screwdriver"));
        assert.strictEqual(1, collection[0].GetLeafNodes().size);
    });

    it("Test prop_death_by_guitar", () => {

        // arrange
        const scene = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "prop_death_by_guitar";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(testName, "", objective), map));

        // act 
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();

        //assert 
        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        assert.strictEqual(0, collection[0].GetIncompleteNodes().size);
        assert.strictEqual(5, collection[0].GetLeafNodes().size);
    });

    it("Test prop_death_by_slamdunk", () => {

        // arrange
        const scene = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "prop_death_by_slamdunk";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(testName, "", objective), map));

        // act 
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();

        //assert 
        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        assert.strictEqual(0, collection[0].GetIncompleteNodes().size);
        assert.strictEqual(5, collection[0].GetLeafNodes().size);
    });


    it("Test the cloning at numerous ways to kill demon", () => {

        // arrange
        const scene = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "inv_solution";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(testName, "", objective), map));

        // act
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();

        // assert
        assert.ok(wasCloneEncountered);
        assert.strictEqual(3, collection.length);
        assert.strictEqual(0, collection[0].GetLeafNodes().size);
        assert.strictEqual(1, collection[0].GetIncompleteNodes().size);
        assert.strictEqual(0, collection[1].GetLeafNodes().size);
        assert.strictEqual(2, collection[1].GetIncompleteNodes().size);

        // act again
        collection.SolveUntilZeroNodesRemaining();

        // assert again
        const leafNodeMap = collection[0].GetLeafNodes();
        assert.strictEqual(5, leafNodeMap.size);
    });



    it("prop_moderately_accelerated_vacuum_tube", () => {

        // arrange
        const scene = new SceneSingle("20210415JsonPrivate/HospScene.json");
        const map = scene.GetSolutionNodesMappedByInput();
        const objective = "prop_moderately_accelerated_vacuum_tube";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(testName, "", objective), map));

        // act
        const wasCloneEncountered = collection.SolvePartiallyUntilCloning();

        // assert
        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        assert.strictEqual(13, collection[0].GetLeafNodes().size);
        assert.strictEqual(0, collection[0].GetIncompleteNodes().size);

        // act again
        collection.SolveUntilZeroNodesRemaining();

        assert.strictEqual(1, collection.length);
        assert.strictEqual(13, collection[0].GetLeafNodes().size);
    });
})