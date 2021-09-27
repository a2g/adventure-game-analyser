import { SolutionNodeMap } from './SolutionNodeMap'; 
import _ from './20210415JsonPrivate/Script/Script.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings'; 
import { Mix } from './Mix';
import { SceneInterface } from './SceneInterface';
import * as fs from "fs"; 
import { SceneInterfaceCollater } from './SceneInterfaceCollater'; 
import { SingleBigSwitch } from './SingleBigSwitch';
import { isNullOrUndefined } from 'util';


export class SceneSingle implements SceneInterface,
    SceneInterfaceCollater {
    allProps: Array<string>;
    allFlags: Array<string>;
    allInvs: Array<string>;
    allChars: Array<string>;
    startingThingsMaster:  Map<string, Set<string>>
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
            if(!isNullOrUndefined(thing.char))
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

        // preen starting invs from the startingThings
        this.startingInvSet = new Set<string>();
        this.startingFlagSet = new Set<string>();
        this.startingPropSet  = new Set<string>();
        for (let i = 0; i < scenario.startingThings.length; i++) {
            const thing = scenario.startingThings[i];
            if (thing.thing.startsWith("inv"))
                this.startingInvSet.add(thing.thing)
            if (thing.thing.startsWith("flag"))
                this.startingFlagSet.add(thing.thing)
            if (thing.thing.startsWith("prop"))
                this.startingPropSet.add(thing.thing)
        }

        this.startingThingsMaster = new Map<string, Set<string>>();
        for (let i = 0; i < scenario.startingThings.length; i++) {
            const char: string = isNullOrUndefined(scenario.startingThings[i].char) ? "" : scenario.startingThings[i].char;
            const item = scenario.startingThings[i].thing;
            if (!this.startingThingsMaster.has(item.thing)) {
                this.startingThingsMaster.set(item.thing, new Set<string>());
            }
            const array = this.startingThingsMaster.get(item.thing);
            if (char.length && array != null) {
                array.add(char);
            }
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

    AddStartingThingCharsToGivenMap(givenMap: Map<string, Set<string>>): void {
        this.startingThingsMaster.forEach((value:Set<string>, key:string)=>{
            givenMap.set(key,value);
        });
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

    GetMapOfAllStartingThings(): Map<string, Set<string>> {
        return this.startingThingsMaster;
    }

    GetStartingThingsForCharacter(charName: string): Set<string> {
        const startingThingSet = new Set<string>();
        this.startingThingsMaster.forEach((value: Set<string>, thing: string) => {
            for (let item of value) {
                if (item == charName) {
                    startingThingSet.add(thing);
                    break;
                }
            }
        });
        
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

    GenerateSolutionNodesMappedByInput(): SolutionNodeMap {
        const result = new SolutionNodeMap(null);
        const notUsed = new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "", "");
        SingleBigSwitch(this.filename, result, notUsed);
        return result;
    }

    FindHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
        const result = SingleBigSwitch(this.filename, null, objects) as unknown as Happenings | null;
        return result;
    }

}


