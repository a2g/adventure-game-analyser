import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNode } from './SolutionNode';
import { assert } from 'console';
import _ from '../20210415JsonPrivate/Script/Script.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';
import { Happening } from './Happening';
import { Happen } from './Happen';
import { Mix } from './Mix';
import { SceneInterface } from './SceneInterface';
import * as fs from "fs";
import { stringify } from 'querystring';
import { SceneInterfaceCollater } from 'SceneInterfaceCollater';
import { ExtractBracketedPart } from 'ExtractBracketedPart';

    
export class SceneSingle implements SceneInterface, 
SceneInterfaceCollater{
    allProps: Array<string>;
    allFlags: Array<string>;
    allInvs: Array<string>;
    allChars: Array<string>;
    startingThingSet: Set<[string, string]>;
    startingInvSet: Set<string>;
    startingPropsSet: Set<string>
    filename:string;
    
    constructor(filename:string) {
        this.filename = filename;
        const text = fs.readFileSync(filename, { encoding: "UTF-8" });
        const scenario = JSON.parse(text);

        const setProps = new Set<string>();
        const setFlags = new Set<string>();
        const setInvs = new Set<string>();
        const setChars = new Set<string>();

        for (const reaction of scenario.reactions) {
            const scriptType = reaction.script;
            const count = reaction.count;
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
        setProps.delete("");
        setFlags.delete("");
        setInvs.delete("");

        this.allProps = Array.from(setProps.values());
        this.allFlags = Array.from(setFlags.values());
        this.allInvs = Array.from(setInvs.values());
        this.allChars = Array.from(setChars.values());

        // preen starting set from JSON
        const startingPropsSet = new Set<string>();
        scenario.startingProps.forEach(function (value: { prop: string; }, index: number, array: { prop: string; }[]): void {
            startingPropsSet.add("" + value.prop);
        });
        this.startingPropsSet = startingPropsSet;
  
        // preen starting invs from the startingThings
        this.startingInvSet = new Set<string>();
        for (let i = 0; i < scenario.startingThings.length; i++) {
            const thing = scenario.startingThings[i];
            if (thing.thing.startsWith("inv"))
                this.startingInvSet.add(thing.thing)
        }

        this.startingThingSet = new Set<[string, string]>();
        for (let i = 0; i < scenario.startingThings.length; i++) {
            const thing = scenario.startingThings[i];
            this.startingThingSet.add([thing.char, thing.thing]);
        }
    }

    AddStartingPropsToGivenSet(givenSet: Set<string>): void {
        for(let prop of this.startingPropsSet){
            givenSet.add(prop);
        }
    }
    AddStartingInvsToGivenSet(givenSet: Set<string>): void {
        for(let inv of this.startingInvSet){
            givenSet.add(inv);
        }
    }
    AddStartingThingsToGivenSet(givenSet: Set<[string, string]>): void {
       for(let thing of this.startingThingSet){
           givenSet.add(thing);
       }
    }
    AddPropsToGivenSet(givenSet: Set<string>): void {
        for(let prop of this.startingPropsSet){
            givenSet.add(prop);
        }
    }
    AddFlagsToGivenSet(givenSet: Set<string>): void {
       for(let flag of this.allFlags){
           givenSet.add(flag);
       }
    }
    AddInvsToGivenSet(givenSet: Set<string>): void {
        for(let inv of this.allInvs){
            givenSet.add(inv);
        }
    }
    AddCharsToGivenSet(givenSet: Set<string>): void {
        for(let char of this.allChars){
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

    GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb {
        const verb = strings[0].toLowerCase();

        if (verb === "grab") {
            if (this.allProps.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "");
            else if (this.allProps.includes("prop_" + strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, "prop_" + strings[1], "");
            return new MixedObjectsAndVerb(Mix.ErrorGrabButNoProp, "", "", "");
        } else if (verb === "toggle") {
            if (this.allProps.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "");
            else if (this.allProps.includes("prop_" + strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, "prop_" + strings[1], "");
            else if (this.allInvs.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, strings[1], "");
            else if (this.allInvs.includes("inv_" + strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, "inv_" + strings[1], "");
            return new MixedObjectsAndVerb(Mix.ErrorToggleButNoInvOrProp, "", "", "");
        } else if (verb === "use") {
            if (this.allInvs.includes(strings[1]) && this.allInvs.includes(strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsInv, verb, strings[1], strings[2]);
            else if (this.allInvs.includes("inv_" + strings[1]) && this.allInvs.includes("inv_" + strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsInv, verb, "inv_" + strings[1], "inv_" + strings[2]);
            else if (this.allInvs.includes(strings[1]) && this.allProps.includes(strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsProp, verb, strings[1], strings[2]);
            else if (this.allInvs.includes("inv_" + strings[1]) && this.allProps.includes("prop_" + strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsProp, verb, "inv_" + strings[1], "prop_" + strings[2]);
            else if (this.allProps.includes("prop_" + strings[1]) && this.allProps.includes("prop_" + strings[2]))
                return new MixedObjectsAndVerb(Mix.PropVsProp, verb, "prop_" + strings[1], "prop_" + strings[2]);
        }
        return new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "");
    }

    private static GetState(name: string | undefined): string {
        if (name) {
            const firstOpenBracket: number = name.indexOf("(");

            if (firstOpenBracket >= 0) {
                const lastIndexOf = name.lastIndexOf(")");

                if (lastIndexOf > firstOpenBracket) {
                    return name.slice(firstOpenBracket, lastIndexOf - 1);
                }
            }
        }
        return "undefined";
    }

    GetArrayOfSingleObjectVerbs(): Array<string> {
        return ["grab", "toggle"];
    }

    GetArrayOfInitialStatesOfSingleObjectVerbs(): Array<boolean> {
        return [true, true];
    }

    GetArrayOfInitialStatesOfFlags(): Array<boolean> {
        const array = new Array<boolean>();
        for (const flag of this.allFlags) {
            array.push(flag.length > 0);// I used value.length>0 to get rid of the unused variable warnin
        };
        return array;
    }

    GetSetOfStartingProps(): Set<string> {
        return this.startingPropsSet;
    }

    GetSetOfStartingInvs(): Set<string> {
        return this.startingInvSet;
    }


    GetSetOfStartingThings(): Set<[string, string]> {
        return this.startingThingSet;
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
        const notUsed = new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "");
        const result = SingleBigSwitch(this.filename, true, notUsed) as SolutionNodeMap;
        return result;
    }

    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
        const result = SingleBigSwitch(this.filename, false, objects) as unknown as Happenings | null;
        return result;
    }

}


function SingleBigSwitch(filename: string, arg1: boolean, notUsed: MixedObjectsAndVerb): SolutionNodeMap {
    throw new Error('Function not implemented.');
}

