import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNode } from './SolutionNode';
import { assert } from 'console';
import _ from './20210415JsonPrivate/Script/Script.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';
import { Happening } from './Happening';
import { Happen } from './Happen';
import { Mix } from './Mix';
import { SceneInterface } from './SceneInterface';
import * as fs from "fs";
import { stringify } from 'querystring';
import { SceneInterfaceCollater } from './SceneInterfaceCollater';
import { ExtractBracketedPart } from './ExtractBracketedPart';
import { SingleBigSwitch } from './SingleBigSwitch';
import { GetSetOfStartingAll } from './GetSetOfStartingAll';


export class SceneSingle implements SceneInterface,
    SceneInterfaceCollater {
    allProps: Array<string>;
    allFlags: Array<string>;
    allInvs: Array<string>;
    allChars: Array<string>;
    startingThingSet: Set<[string, string]>;
    startingInvSet: Set<string>;
    startingPropSet: Set<string>
    startingFlagSet: Set<string>
    filename: string;

    constructor(filename: string) {
        filename = filename;
        this.filename = filename;
        const text = fs.readFileSync(filename, { encoding: "UTF-8" });
        const scenario = JSON.parse(text);

        const setProps = new Set<string>();
        const setFlags = new Set<string>();
        const setInvs = new Set<string>();
        const setChars = new Set<string>();

        for (const reaction of scenario.reactions) {
            const scriptType = reaction.script;
            const restrictions = reaction.restrictions;
            setInvs.add("" + reaction.inv1);
            setInvs.add("" + reaction.inv2);
            setInvs.add("" + reaction.inv3);
            setFlags.add("" + reaction.flag1);
            setFlags.add("" + reaction.flag2);
            setProps.add("" + reaction.prop1);
            setProps.add("" + reaction.prop2);
            setProps.add("" + reaction.prop3);
            setProps.add("" + reaction.prop4);
            setProps.add("" + reaction.prop5);
            setProps.add("" + reaction.prop6);
            setProps.add("" + reaction.prop7);
        }

        for (let i = 0; i < scenario.startingThings.length; i++) {
            const thing = scenario.startingThings[i];
            setChars.add(thing.char);
        }

        setChars.delete("");
        setChars.delete("undefined");
        setProps.delete("");
        setProps.delete("undefined");
        setFlags.delete("");
        setFlags.delete("undefined");
        setInvs.delete("");
        setInvs.delete("undefined");

        this.allProps = Array.from(setProps.values());
        this.allFlags = Array.from(setFlags.values());
        this.allInvs = Array.from(setInvs.values());
        this.allChars = Array.from(setChars.values());

        // preen starting set from JSON
        const startingPropsSet = new Set<string>();
        scenario.startingProps.forEach(function (value: { prop: string; }, index: number, array: { prop: string; }[]): void {
            startingPropsSet.add("" + value.prop);
        });
        this.startingPropSet = startingPropsSet;

        // preen starting invs from the startingThings
        this.startingInvSet = new Set<string>();
        this.startingFlagSet = new Set<string>();
        for (let i = 0; i < scenario.startingThings.length; i++) {
            const thing = scenario.startingThings[i];
            if (thing.thing.startsWith("inv"))
                this.startingInvSet.add(thing.thing)
            if (thing.thing.startsWith("flag"))
                this.startingFlagSet.add(thing.thing)
        }

        this.startingThingSet = new Set<[string, string]>();
        for (let i = 0; i < scenario.startingThings.length; i++) {
            const thing = scenario.startingThings[i];
            this.startingThingSet.add([thing.char, thing.thing]);
        }
    }

    AddStartingPropsToGivenSet(givenSet: Set<string>): void {
        for (let prop of this.startingPropSet) {
            givenSet.add(prop);
        }
    }
    AddStartingFlagsToGivenSet(givenSet: Set<string>): void {
        for (let flag of this.startingFlagSet) {
            givenSet.add(flag);
        }
    }
    AddStartingInvsToGivenSet(givenSet: Set<string>): void {
        for (let inv of this.startingInvSet) {
            givenSet.add(inv);
        }
    }
    AddStartingThingsToGivenSet(givenSet: Set<[string, string]>): void {
        for (let thing of this.startingThingSet) {
            givenSet.add(thing);
        }
    }
    AddPropsToGivenSet(givenSet: Set<string>): void {
        for (let prop of this.allProps) {
            givenSet.add(prop);
        }
    }
    AddFlagsToGivenSet(givenSet: Set<string>): void {
        for (let flag of this.allFlags) {
            givenSet.add(flag);
        }
    }
    AddInvsToGivenSet(givenSet: Set<string>): void {
        for (let inv of this.allInvs) {
            givenSet.add(inv);
        }
    }
    AddCharsToGivenSet(givenSet: Set<string>): void {
        for (let char of this.allChars) {
            givenSet.add(char);
        }
    }

    GetArrayOfProps(): Array<string> {
        return this.allProps;
    }

    GetArrayOfInvs(): Array<string> {
        return this.allInvs;
    }

    GetArrayOfFlags(): Array<string> {
        return this.allFlags;
    }

    GetArrayOfSingleObjectVerbs(): Array<string> {
        return ["grab", "toggle"];
    }

    GetArrayOfInitialStatesOfSingleObjectVerbs(): Array<boolean> {
        return [true, true];
    }

    GetArrayOfInitialStatesOfFlags(): Array<number> {
        // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
        const startingSet = this.GetSetOfStartingFlags();
        const initialStates = new Array<number>();
        for (const flag of this.allFlags) {
            const isNonZero = startingSet.has(flag);
            initialStates.push(isNonZero ? 1 : 0);
        };
        return initialStates;
    }

    GetSetOfStartingFlags(): Set<string> {
        return this.startingFlagSet;
    }

    GetSetOfStartingProps(): Set<string> {
        return this.startingPropSet;
    }

    GetSetOfStartingInvs(): Set<string> {
        return this.startingInvSet;
    }

    GetSetOfStartingThings(): Set<[string, string]> {
        return this.startingThingSet;
    }

    GetSetOfStartingAll(): Set<string> {
        return GetSetOfStartingAll(this.startingThingSet, this.startingInvSet, this.startingPropSet);
    }

    GetStartingThingsForCharacter(name: string): Set<string> {
        const startingThingSet = new Set<string>();
        for (const thing of this.startingThingSet) {
            if (thing[0] === name) {
                startingThingSet.add(thing[1])
            }
        }
        return startingThingSet;
    }


    GetArrayOfInitialStatesOfProps(): Array<boolean> {
        // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
        const startingSet = this.GetSetOfStartingProps();
        const visibilities = new Array<boolean>();
        for (const prop of this.allProps) {
            const isVisible = startingSet.has(prop);
            visibilities.push(isVisible);
        };

        return visibilities;
    }

    GetArrayOfInitialStatesOfInvs(): Array<boolean> {
        // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
        const startingSet = this.GetSetOfStartingInvs();
        const visibilities = new Array<boolean>();
        for (const inv of this.allInvs) {
            const isVisible = startingSet.has(inv);
            visibilities.push(isVisible);
        };

        return visibilities;
    }

    GetArrayOfCharacters(): Array<string> {
        return this.allChars;
    }

    GetSolutionNodesMappedByInput(): SolutionNodeMap {
        const result = new SolutionNodeMap(null);
        const notUsed = new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "", "");
        SingleBigSwitch(this.filename, result, notUsed);
        return result;
    }

    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
        const result = SingleBigSwitch(this.filename, null, objects) as unknown as Happenings | null;
        return result;
    }

}


