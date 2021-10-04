//Typescript Unit test
import assert = require('assert');
import { SolverViaRootNode } from '../src/SolverViaRootNode';
import { SolutionNode } from '../src/SolutionNode';
import { Solution } from '../src/Solution';
import { ReadOnlyJsonSingle } from '../src/ReadOnlyJsonSingle';


describe("SceneSingle", () => {
  
    it("Test GetMapOfAllStartingThings", () => {
        const scene = new ReadOnlyJsonSingle("./src/TestHighPermutationSolutionScene.json");
       
        // this failed recently
        const map = scene.GetMapOfAllStartingThings();
       // assert.strictEqual(collection.length, 1);
        assert.ok(true);
        assert.strictEqual(map.size,14);
        assert.ok(map.has("inv_shared_toy"));
        const set = map.get("inv_shared_toy");
        if(set){
            assert.strictEqual(set.size, 4);
            assert.ok(set.has("char1"));
            assert.ok(set.has("char2"));
            assert.ok(set.has("char3"));
            assert.ok(set.has("char4"));
        }
    });
})