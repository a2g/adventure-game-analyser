//Typescript Unit test
import assert = require('assert');
import { GetMapFromJSonGlossy } from '../GetMapFromJSonGlossy';
import { SolutionCollection } from '../SolutionCollection';
import { SolutionNodeInput } from '../SolutionNodeInput';
import { SolutionNode } from '../SolutionNode';
import { Solution } from '../Solution';
const testName = "root via test";

describe("Solution", () => {
    it("Testing just the grabbing of screwdriver", () => {

        // arrange
        const map = GetMapFromJSonGlossy();
        const objective = "inv_screwdriver";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode("", "", objective), map));

        // act 
        const wasCloneEncountered = collection.ProcessUntilCloning();

        // assert
        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        assert.strictEqual(0, collection[0].GetIncompleteNodes().size);
        assert.ok(collection[0].GetLeafNodes().has("//inv_screwdriver/prop_screwdriver"));
        assert.strictEqual(1, collection[0].GetLeafNodes().size);
    });

    it("Test prop_death_by_guitar", () => {

        // arrange
        const map = GetMapFromJSonGlossy();
        const objective = "prop_death_by_guitar";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(testName, "", objective), map));
        
        // act 
        const wasCloneEncountered = collection.ProcessUntilCloning();

        //assert 
        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        assert.strictEqual(0, collection[0].GetIncompleteNodes().size);
        assert.strictEqual(5, collection[0].GetLeafNodes().size);
    });

    it("Test prop_death_by_slamdunk", () => {

        // arrange
        const map = GetMapFromJSonGlossy();
        const objective = "prop_death_by_slamdunk";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(testName, "", objective), map));

        // act 
        const wasCloneEncountered = collection.ProcessUntilCloning();

        //assert 
        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        assert.strictEqual(0, collection[0].GetIncompleteNodes().size);
        assert.strictEqual(5, collection[0].GetLeafNodes().size);
    });


    it("Test the cloning at numerous ways to kill demon", () => {

        // arrange
        const map = GetMapFromJSonGlossy();
        const objective = "inv_demon_death";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(testName, "", objective), map));

        // act
        const wasCloneEncountered = collection.ProcessUntilCloning();

        // assert
        assert.ok(wasCloneEncountered);
        assert.strictEqual(2, collection.length);
        assert.strictEqual(0, collection[0].GetLeafNodes().size);
        assert.strictEqual(1, collection[0].GetIncompleteNodes().size);
        assert.strictEqual(0, collection[1].GetLeafNodes().size);
        assert.strictEqual(2, collection[1].GetIncompleteNodes().size);

        // act again
        collection.ProcessUntilCompletion();

        // assert again
        const leafNodeMap = collection[0].GetLeafNodes();
        assert.strictEqual(5, leafNodeMap.size);
    });

  

    it("prop_moderately_accelerated_vacuum_tube", () => {

        // arrange
        const map = GetMapFromJSonGlossy();
        const objective = "prop_moderately_accelerated_vacuum_tube";
        const collection = new SolutionCollection();
        collection.push(new Solution(new SolutionNode(testName, "", objective), map));

        // act
        const wasCloneEncountered = collection.ProcessUntilCloning();

        // assert
        assert.strictEqual(false, wasCloneEncountered);
        assert.strictEqual(1, collection.length);
        assert.strictEqual(13, collection[0].GetLeafNodes().size);
        assert.strictEqual(0, collection[0].GetIncompleteNodes().size);

        // act again
        collection.ProcessUntilCompletion();

        assert.strictEqual(1, collection.length);
        assert.strictEqual(13, collection[0].GetLeafNodes().size);
    });
})