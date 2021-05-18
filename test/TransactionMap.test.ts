import assert = require('assert');
import { TransactionMap } from '../TransactionMap';
import { Verb } from '../Verb';
import { isUndefined } from 'util';
import { SolutionNode } from '../SolutionNode';

describe("TransactionMap", () => {
    it("test AddToMap works", () => {
        const blah = new TransactionMap(null);

        // test that it is indeed null before
        const arrayBefore = blah.Get("outputA");
        assert.ok(isUndefined(arrayBefore));

        // do it!
        blah.AddToMap(new SolutionNode("ramble", "outputA", "A", "B"));

        // test that it adds an array if the array is not yet null.
        const arrayAfter = blah.Get("outputA");
        assert.notEqual(null, arrayAfter);

        const countAfterAdding = arrayAfter ? arrayAfter.length : 0;
        assert.strictEqual(1, countAfterAdding);
    });

    it("test RemoveTransaction works", () => {
        const blah = new TransactionMap(null);
        for (let i = 0; i < 3; i++) {
            blah.AddToMap(new SolutionNode("piffle", "outputA", "A", "B"));
        }
        const theOneToRemove = new SolutionNode("piffle", "outputA", "A", "B");
        blah.AddToMap(theOneToRemove);
        {
            const arrayBefore = blah.Get("outputA");
            const countBeforeRemoval = arrayBefore ? arrayBefore.length : 0;
            assert.strictEqual(4, countBeforeRemoval);
        }

        blah.RemoveTransaction(theOneToRemove);

        {
            const arrayAfter = blah.Get("outputA");
            const countAfterRemoval = arrayAfter ? arrayAfter.length : 0;
            assert.strictEqual(3, countAfterRemoval);
        }
    });

    it("test Clone works", () => {

        // create original entries
        const array = new Array<SolutionNode>();
        array.push(new SolutionNode("blah", "outputA", "a", "a"));
        array.push(new SolutionNode("blah", "outputA", "b", "b"));
        array.push(new SolutionNode("blah", "outputA", "c", "c"));

        // put them in a map
        const tmap = new TransactionMap(null);
        array.forEach((t: SolutionNode) => {
            tmap.AddToMap(t);
        });

        // cloned the map, and modify it.
        {
            const cloned = new TransactionMap(tmap);
            const clonedOutputA = cloned.Get("outputA");
            assert.ok(!isUndefined(array));
            assert.notEqual(null, array);
            if (clonedOutputA) {
                clonedOutputA[0].inputs[0].inputName = "d";
                clonedOutputA[1].inputs[0].inputName = "e";
                clonedOutputA[2].inputs[0].inputName = "f";
            }
        }

        // check the originals are still the same
        assert.strictEqual("a", array[0].inputs[0].inputName);
        assert.strictEqual("b", array[1].inputs[0].inputName);
        assert.strictEqual("c", array[2].inputs[0].inputName);
    });
});
