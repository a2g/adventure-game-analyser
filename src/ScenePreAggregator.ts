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
import { SceneSingle } from './SceneSingle';
import { SingleBigSwitch } from './SingleBigSwitch';

function Stringify(name: string | undefined): string {
    return name ? name : "";
}
    
export class ScenePreCacheMultiple implements SceneInterface {
    allProps: Array<string>;
    allFlags: Array<string>;
    allInvs: Array<string>;
    allChars: Array<string>;
    startingThingSet: Set<[string, string]>;
    startingInvSet: Set<string>;
    startingPropSet: Set<string>;
    allScenes: Map<string, SceneSingle>;
    
    constructor(filenames:Set<string>) {
        this.allScenes = new Map<string, SceneSingle>();
        for(let file of filenames){
            let scene = new SceneSingle(file);
            this.allScenes.set(file,scene);
        }

        // create sets for the 3 member and 4 indirect sets
        this.startingPropSet = new Set<string>();
        this.startingInvSet = new Set<string>();
        this.startingThingSet = new Set<[string, string]>();
        const setProps = new Set<string>();
        const setFlags = new Set<string>();
        const setInvs = new Set<string>();
        const setChars = new Set<string>();
        
        // collate the 3 member and 4 indirect sets
        for(let scene of this.allScenes.values()){
            scene.AddStartingPropsToGivenSet(this.startingPropSet);
            scene.AddStartingInvsToGivenSet(this.startingInvSet);
            scene.AddStartingThingsToGivenSet(this.startingThingSet);
            scene.AddPropsToGivenSet(setProps);
            scene.AddFlagsToGivenSet(setFlags);
            scene.AddInvsToGivenSet(setInvs);
            scene.AddCharsToGivenSet(setChars);
        }

        // clean 3 member and 4 indirect sets
        this.startingPropSet.delete("");
        this.startingInvSet.delete("");
        this.startingThingSet.delete(["",""]);
        setChars.delete("");
        setProps.delete("");
        setFlags.delete("");
        setInvs.delete("");

        // finally set arrays for the four
        this.allProps = Array.from(setProps.values());
        this.allFlags = Array.from(setFlags.values());
        this.allInvs = Array.from(setInvs.values());
        this.allChars = Array.from(setChars.values());
    }
    
    AddStartingPropsToGivenSet(givenSet: Set<string>): void {
        throw new Error('Method not implemented.');
    }
    AddStartingInvsToGivenSet(givenSet: Set<string>): void {
        throw new Error('Method not implemented.');
    }
    AddStartingThingsToGivenSet(givenSet: Set<[string, string]>): void {
        throw new Error('Method not implemented.');
    }
    AddPropsToGivenSet(givenSet: Set<string>): void {
        throw new Error('Method not implemented.');
    }
    AddFlagsToGivenSet(givenSet: Set<string>): void {
        throw new Error('Method not implemented.');
    }
    AddInvsToGivenSet(givenSet: Set<string>): void {
        throw new Error('Method not implemented.');
    }
    AddCharsToGivenSet(givenSet: Set<string>): void {
        throw new Error('Method not implemented.');
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
        return this.startingPropSet;
    }

    GetSetOfStartingInvs(): Set<string> {
        return this.startingInvSet;
    }


    GetSetOfStartingThings(): Set<[string, string]> {
        return this.startingThingSet;
    }

    GetSetOfStartingEverythings() : Set<string> {
        return this.GetSetOfStartingEverythings(this.startingThingSet, this.startingInvSet, this.startingPropSet);
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
        const solutionNodesMappedByInput = new SolutionNodeMap(null);

        for(let filename of this.allScenes.keys() ){
            const notUsed = new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "");
            SingleBigSwitch(filename, solutionNodesMappedByInput, notUsed);
        }
        return solutionNodesMappedByInput;
    }

    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
        for(let filename of this.allScenes.keys() ){
            const result = SingleBigSwitch(filename, null, objects) as unknown as Happenings | null;
            if(result)
                return result;
        }
        return null;
    }
}

 
