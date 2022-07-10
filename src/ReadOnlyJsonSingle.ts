import { SolutionNodeMap } from './SolutionNodeMap';
import _ from './20210415JsonPrivate/Gate/Gate.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';
import { Mix } from './Mix';
import { ReadOnlyJsonInterface } from './ReadOnlyJsonInterface';
import * as fs from "fs";
import { ReadOnlyJsonInterfaceCollater } from './ReadOnlyJsonInterfaceCollater';
import { SingleBigSwitch } from './SingleBigSwitch';
import { isNullOrUndefined } from 'util';
import { assert } from 'console';
import { BADFLAGS } from 'dns';


/**
 * So the most important part of this class is that the data
 * in it is read only. So I've put that in the name.
 * I wanted to convey the idea that it represents one *.json file
 * so that's in there too.
 * */

export class ReadOnlyJsonSingle implements ReadOnlyJsonInterface,
  ReadOnlyJsonInterfaceCollater {
  readonly allProps: Array<string>;
  readonly allFlags: Array<string>;
  readonly allInvs: Array<string>;
  readonly allChars: Array<string>;
  readonly mapOfStartingThings: Map<string, Set<string>>
  readonly startingInvSet: Set<string>;
  readonly startingPropSet: Set<string>
  readonly startingFlagSet: Set<string>
  readonly filename: string;
  readonly bags: Array<[string, string]>;

  constructor(filename: string) {
    this.filename = filename;
    assert(fs.existsSync(filename));
    const text = fs.readFileSync(filename, { encoding: "UTF-8" });

    const scenario = JSON.parse(text);
    const bags = new Array<[string, string]>();
    const setProps = new Set<string>();
    const setFlags = new Set<string>();
    const setInvs = new Set<string>();
    const setChars = new Set<string>();

    for (const gate of scenario.gates) {
      const gateType = gate.gate;
      const restrictions = gate.restrictions;
      setInvs.add("" + gate.inv1);
      setInvs.add("" + gate.inv2);
      setInvs.add("" + gate.inv3);
      setFlags.add("" + gate.flag1);
      setFlags.add("" + gate.flag2);
      setProps.add("" + gate.prop1);
      setProps.add("" + gate.prop2);
      setProps.add("" + gate.prop3);
      setProps.add("" + gate.prop4);
      setProps.add("" + gate.prop5);
      setProps.add("" + gate.prop6);
      setProps.add("" + gate.prop7);
    }

    // starting things is optional in the json
    if (scenario.hasOwnProperty("startingThings")) {
      for (const thing of scenario.startingThings) {
        if (!isNullOrUndefined(thing.char))
          setChars.add(thing.char);
      }
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
    this.startingPropSet = new Set<string>();
    this.mapOfStartingThings = new Map<string, Set<string>>();
    this.bags = new Array<[string, string]>();

    // starting things is optional in the json
    if (scenario.hasOwnProperty("startingThings")) {
      for (const thing of scenario.startingThings) {
        if (thing.thing.startsWith("inv"))
          this.startingInvSet.add(thing.thing)
        if (thing.thing.startsWith("flag"))
          this.startingFlagSet.add(thing.thing)
        if (thing.thing.startsWith("prop"))
          this.startingPropSet.add(thing.thing)
      }

      for (let item of scenario.startingThings) {
        if (!this.mapOfStartingThings.has(item.thing)) {
          this.mapOfStartingThings.set(item.thing, new Set<string>());
        }
        if (!isNullOrUndefined(item.char)) {
          const char = item.char;
          const array = this.mapOfStartingThings.get(item.thing);
          if (char.length && array != null) {
            array.add(char);
          }
        }
      }
    }

    // bags are optional in the json
    if (scenario.hasOwnProperty("bags")) {
      for (const bag of scenario.bags) {
        if (!isNullOrUndefined(bag.flag) && !isNullOrUndefined(bag.fileToMerge)) {
          const flag = bag.flag;
          const file = bag.fileToMerge;
          bags.push([flag, file]);
        }
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
    this.mapOfStartingThings.forEach((value: Set<string>, key: string) => {
      givenMap.set(key, value);
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

  GetStartingThingsInAMap(): Map<string, Set<string>> {
    return this.mapOfStartingThings;
  }

  GetStartingThingsForCharacter(charName: string): Set<string> {
    const startingThingSet = new Set<string>();
    this.mapOfStartingThings.forEach((value: Set<string>, thing: string) => {
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

  AddAllSolutionNodesToGivenMap(givenMap: SolutionNodeMap): SolutionNodeMap {
    const notUsed = new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "", "");
    SingleBigSwitch(this.filename, givenMap, notUsed);
    return givenMap;
  }

  FindHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
    const result = SingleBigSwitch(this.filename, null, objects) as unknown as Happenings | null;
    return result;
  }

  GetBags(): Array<[string, string]> {
    return this.bags;
  }

}
