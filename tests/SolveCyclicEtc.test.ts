//Typescript Unit test
import assert = require('assert');
import { SolveCyclicEtc } from "../src/SolveCyclicEtc";
import { RowOfSheet } from "../src/RowOfSheet";

const actions: Array<string> = ["examine", "grab"];


describe("SolveCyclicEtc", () => {
    it("TestInitKeywordIsOk", () => {
        const r1 = new RowOfSheet();
        r1.name = "oWater";
        r1.commandToMakeVisible = "init";
        const rows: Array<RowOfSheet> = [r1];
        assert.equal(SolveCyclicEtc(rows, actions), "ok");
    });

    it("TestInitKeywordInCapsIsOk", () => {
        const r1 = new RowOfSheet();
        r1.name = "oWater";
        r1.commandToMakeVisible = "INIT";
        const rows: Array<RowOfSheet> = [r1];

        assert.equal(SolveCyclicEtc(rows, actions), "ok");
    });

    it("TestComplicatedDependencyIsOk", () => {
        const r1 = new RowOfSheet();
        r1.name = "oObjA";
        r1.commandToMakeVisible = "use oObjB oObjC";


        const r2 = new RowOfSheet();
        r2.name = "oObjB";
        r2.commandToMakeVisible = "use oObjA oObjC";

        const r3 = new RowOfSheet();
        r3.name = "oObjC";
        r3.commandToMakeVisible = "use oObjA oObjB";

        const rows: Array<RowOfSheet> = [r1, r2, r3];
        assert.equal(SolveCyclicEtc(rows, actions), "ok")
    });

    it("TestTwoObjectCyclicalDependencyIsBad", () => {
        const r1 = new RowOfSheet();
        r1.name = "oObjA";
        r1.commandToMakeVisible = "init";

        const r2 = new RowOfSheet();
        r2.name = "oObjB";
        r2.commandToMakeVisible = "use oObjA oObjB";

        const rows: Array<RowOfSheet> = [r1, r2];
        assert.notEqual(SolveCyclicEtc(rows, actions), "ok")
    });

    it("TestOneObjectCyclicalDependencyIsBad", () => {
        const r1 = new RowOfSheet();
        r1.name = "oObjA";
        r1.commandToMakeVisible = "grab oObjA";

        const rows: Array<RowOfSheet> = [r1];
        assert.notEqual(SolveCyclicEtc(rows, actions), "ok")
    });

    it("TestTwoObjectWithUseIsOk", () => {
        const r1 = new RowOfSheet();
        r1.name = "oObjA";
        r1.commandToMakeVisible = "init";

        const r2 = new RowOfSheet();
        r2.name = "oObjB";
        r2.commandToMakeVisible = "init";

        const r3 = new RowOfSheet();
        r3.name = "oObjC";
        r3.commandToMakeVisible = "use oObjA oObjB";

        const rows: Array<RowOfSheet> = [r1, r2, r3];
        assert.equal(SolveCyclicEtc(rows, actions), "ok")
    });

    it("TestTwoObjectWithoutUseIsBad", () => {
        const r1 = new RowOfSheet();
        r1.name = "oObjA";
        r1.commandToMakeVisible = "init";

        const r2 = new RowOfSheet();
        r2.name = "oObjB";
        r2.commandToMakeVisible = "init";

        const r3 = new RowOfSheet();
        r3.name = "oObjC";
        r3.commandToMakeVisible = "grab oObjA oObjB";

        const rows: Array<RowOfSheet> = [r1, r2, r3];
        assert.notEqual(SolveCyclicEtc(rows, actions), "ok")
    });

    // TODO, the error states from Solve Cyclic?
});


