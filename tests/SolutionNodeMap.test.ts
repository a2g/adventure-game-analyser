import assert = require('assert');
import { SolutionNodeMap } from '../src/SolutionNodeMap';
import { isUndefined } from 'util';
import { SolutionNode } from '../src/SolutionNode';

describe("ReactionMap", () => {
    it("test AddToMap works", () => {
        const blah = new SolutionNodeMap(null);

        // test that it is indeed null before
        const arrayBefore = blah.Get("outputA");
        assert.ok(isUndefined(arrayBefore));

        // do it!
        blah.AddToMap(new SolutionNode("outputA", "type", 1, null, "A", "B"));

        // test that it adds an array if the array is not yet null.
        const arrayAfter = blah.Get("outputA");
        assert.notEqual(arrayAfter, null);

        const countAfterAdding = arrayAfter ? arrayAfter.length : 0;
        assert.strictEqual(countAfterAdding, 1);
    });

    it("test RemoveNode works", () => {
        const blah = new SolutionNodeMap(null);
        for (let i = 0; i < 3; i++) {
            blah.AddToMap(new SolutionNode("outputA", "piffle", 1, null, "A", "B"));
        }
        const theOneToRemove = new SolutionNode("outputA", "piffle", 1, null, "A", "B");
        blah.AddToMap(theOneToRemove);
        {
            const arrayBefore = blah.Get("outputA");
            const countBeforeRemoval = arrayBefore ? arrayBefore.length : 0;
            assert.strictEqual(countBeforeRemoval, 4);
        }

        blah.RemoveNode(theOneToRemove);

        {
            const arrayAfter = blah.Get("outputA");
            const countAfterRemoval = arrayAfter ? arrayAfter.length : 0;
            assert.strictEqual(countAfterRemoval, 3);
        }
    });

    it("test Clone works", () => {

        // create original entries
        const array = new Array<SolutionNode>();
        array.push(new SolutionNode("blah", "outputA", 1, null, "a", "a"));
        array.push(new SolutionNode("blah", "outputA", 1, null, "b", "b"));
        array.push(new SolutionNode("blah", "outputA", 1, null, "c", "c"));

        // put them in a map
        const tmap = new SolutionNodeMap(null);
        array.forEach((t: SolutionNode) => {
            tmap.AddToMap(t);
        });

        // cloned the map, and modify it.
        {
            const cloned = new SolutionNodeMap(tmap);
            const clonedOutputA = cloned.Get("outputA");
            assert.ok(!isUndefined(array));
            assert.notEqual(null, array);
            if (clonedOutputA) {
                clonedOutputA[0].inputHints[0] = "d";
                clonedOutputA[1].inputHints[0] = "e";
                clonedOutputA[2].inputHints[0] = "f";
            }
        }

        // check the originals are still the same
        assert.strictEqual(array[0].inputHints[0], "a");
        assert.strictEqual(array[1].inputHints[0], "b");
        assert.strictEqual(array[2].inputHints[0], "c");
    });
});
