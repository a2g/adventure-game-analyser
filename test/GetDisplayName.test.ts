import assert = require('assert');
import { GetDisplayName } from '../GetDisplayName';

describe("GetDisplayName", () => {
    it("TestAllNamesSoFar", () => {
        assert.equal("broken_radio", GetDisplayName("prop_broken_radio"));
        assert.equal("broken_radio", GetDisplayName("inv_broken_radio"));
    });
});
