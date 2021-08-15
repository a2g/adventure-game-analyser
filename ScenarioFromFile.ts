import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNode } from './SolutionNode';
import { assert } from 'console';
import scenario from './20210415JsonPrivate/scenario/schema/HighScene.json';
import objects from './20210415JsonPrivate/scenario/schema/HighObjects.json';
import _ from './20210415JsonPrivate/scenario/schema/Script/Script.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';
import { Happening } from './Happening';
import { Happen } from './Happen';
import { Mix } from './Mix';
import { ScenarioInterface } from './ScenarioInterface';
import * as fs from "fs";

function Stringify(name: string | undefined): string {
    return name ? name : "";
}


function GetState(name: string | undefined): string {
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
    
export class ScenarioFromFile implements ScenarioInterface {
    allProps: Array<string>;
    allRegs: Array<string>;
    allInvs: Array<string>;
    
    constructor() {
        const text = fs.readFileSync("20210415JsonPrivate/scenario/schema/HighScene.json", { encoding: "UTF-8" });
        const scenario = JSON.parse(text);

        const setProps = new Set<string>();
        const setRegs = new Set<string>();
        const setInvs = new Set<string>();
        const setChars = new Set<string>();

        for (const reaction of scenario.reactions) {
            const scriptType = reaction.script;
            const count = reaction.count;
            const restrictions = reaction.restrictions;
            setInvs.add("" + reaction.inv1);
            setInvs.add("" + reaction.inv2);
            setInvs.add("" + reaction.inv3);
            setRegs.add("" + reaction.reg1);
            setRegs.add("" + reaction.reg2);
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
        setRegs.delete("");
        setInvs.delete("");

        this.allProps = Array.from(setProps.values());
        this.allRegs = Array.from(setRegs.values());
        this.allInvs = Array.from(setInvs.values());
        this.allChars = Array.from(setChars.values());
    }

    GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb {
        throw new Error("Method not implemented.");
    }

    GetArrayOfProps(): string[] {
        throw new Error("Method not implemented.");
    }
    GetArrayOfInvs(): string[] {
        throw new Error("Method not implemented.");
    }
    GetArrayOfRegs(): string[] {
        throw new Error("Method not implemented.");
    }
    GetArrayOfSingleObjectVerbs(): string[] {
        throw new Error("Method not implemented.");
    }
    GetArrayOfInitialStatesOfInvs(): boolean[] {
        throw new Error("Method not implemented.");
    }
    GetArrayOfInitialStatesOfProps(): boolean[] {
        throw new Error("Method not implemented.");
    }
    GetArrayOfInitialStatesOfSingleObjectVerbs(): boolean[] {
        throw new Error("Method not implemented.");
    }
    GetArrayOfInitialStatesOfRegs(): boolean[] {
        throw new Error("Method not implemented.");
    }

    GetSetOfStartingProps(): Set<string> {
        throw new Error("Method not implemented.");
    }
    GetSetOfStartingInvs(): Set<string> {
        throw new Error("Method not implemented.");
    }
    GetSetOfStartingThings(): Set<[string, string]> {
        throw new Error("Method not implemented.");
    }
    GetStartingThingsForCharacter(name: string): Set<string> {
        throw new Error("Method not implemented.");
    }
    GetArrayOfCharacters(): string[] {
        throw new Error("Method not implemented.");
    }


    /*
    GetSetOfStartingProps(): Set<string>;
    GetArrayOfStartingInvs(): Set<string>;
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
    GetStartingThingsForCharacter(name: string): Set<string>;
    GetSetOfStartingInvs(): Set<string>;
    GetSetOfStartingThings(): Set<[string, string]>;
    GetArrayOfCharacters(): Array<string>;
    
    setOfStartingProps: Set<string>;
    arrayOfStaringInvs: Set<string>;
    */
    GetSolutionNodesMappedByInput(): SolutionNodeMap {
        const notUsed = new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "");
        const result = ScenarioFromFile.SingleBigSwitch(true, notUsed) as SolutionNodeMap;
        return result;
    }

    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
        const result = ScenarioFromFile.SingleBigSwitch(false, objects) as Happenings | null;
        return result;
    }

    private static SingleBigSwitch(isCollectingSolutionNodes: boolean, objects: MixedObjectsAndVerb): Happenings | SolutionNodeMap | null {
        const happs = new Happenings();
        const solutionNodesMappedByInput = new SolutionNodeMap(null);

        const text = fs.readFileSync("20210415JsonPrivate/scenario/schema/HighScene.json", { encoding: "UTF-8" });
        const scenario = JSON.parse(text);

        for (const reaction of scenario.reactions) {
            const scriptType = reaction.script;
            const count = reaction.count;
            const restrictions = reaction.restrictions;
            switch (scriptType) {
                case _.AUTO_PROP1_BECOMES_PROP2_VIA_PROPS:
                    {
                        const input = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        const prop1 = "" + reaction.prop3;
                        const prop2 = "" + reaction.prop4;
                        const prop3 = "" + reaction.prop5;
                        const prop4 = "" + reaction.prop6;
                        const prop5 = "" + reaction.prop7;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input, restrictions, prop1, count, prop2, prop3, prop4, prop5));
                    }
                    break;
                case _.AUTO_REG1_TRIGGERS_REG2:
                    {
                        const input = "" + reaction.reg1;
                        const output = "" + reaction.reg2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input));
                    }
                    break;
                case _.AUTO_REG1_TRIGGERED_BY_PROPS:
                    {
                        const output = "" + reaction.reg1;
                        const prop1 = "" + reaction.prop1;
                        const prop2 = "" + reaction.prop2;
                        const prop3 = "" + reaction.prop3;
                        const prop4 = "" + reaction.prop4;
                        const prop5 = "" + reaction.prop5;
                        const prop6 = "" + reaction.prop6;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, prop1, restrictions, prop2, count, prop3, prop4, prop5, prop6));
                    }
                    break;

                case _.INV1_AND_INV2_FORM_INV3:
                    if (isCollectingSolutionNodes) {
                        // losing all
                        const inputA = "" + reaction.inv1;
                        const inputB = "" + reaction.inv2;
                        const output = "" + reaction.inv3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));
                    }
                    else if (objects.Match("Use", reaction.inv1, reaction.inv2)) {
                        happs.text = "The " + reaction.inv1 + " and the " + reaction.inv2 + " has formed an" + reaction.inv3;
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv2)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv3)));
                        return happs;
                    }
                    break;
                case _.INV1_AND_INV2_GENERATE_INV3:
                    if (isCollectingSolutionNodes) {
                        // losing none
                        const inputA = "" + reaction.inv1;
                        const inputB = "" + reaction.inv2;
                        const output = "" + reaction.inv3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));
                    }
                    else if (objects.Match("Use", reaction.inv1, reaction.inv2)) {
                        happs.text = "The " + reaction.inv1 + " and the " + reaction.inv2 + " has generated an" + reaction.inv3;
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv2)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv3)));
                        return happs;
                    }
                    break;
                case _.INV1_BECOMES_INV2_VIA_KEEPING_INV3:
                    if (isCollectingSolutionNodes) {
                        // losing inv
                        const inputA = "" + reaction.inv1;
                        const output = "" + reaction.inv2;
                        const inputB = "" + reaction.inv3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.inv1, reaction.inv3)) {
                        happs.text = "Your " + reaction.inv1 + " has become a " + reaction.inv2
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv3)));
                        return happs;
                    }
                    break;
                case _.INV1_BECOMES_INV2_VIA_KEEPING_PROP1:
                    if (isCollectingSolutionNodes) {
                        // keeping prop1
                        const inputA = "" + reaction.inv1;
                        const output = "" + reaction.inv2;
                        const inputB = "" + reaction.prop1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.inv1, reaction.prop1)) {
                        happs.text = "Your " + reaction.inv1 + " has become a  " + reaction.inv2;
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                        happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                        return happs;
                    }
                    break;
                case _.INV1_BECOMES_INV2_VIA_LOSING_INV3:
                    if (isCollectingSolutionNodes) {
                        // losing inv
                        const inputA = "" + reaction.inv1;
                        const output = "" + reaction.inv2;
                        const inputB = "" + reaction.inv3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.inv1, reaction.inv3)) {
                        happs.text = "The " + reaction.inv1 + " has become a  " + reaction.inv2;
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv3)));
                        return happs;
                    }
                    break;
                case _.INV1_WITH_PROP1_REVEALS_PROP2_KEPT_ALL:
                    if (isCollectingSolutionNodes) {
                        const inputA = "" + reaction.inv1;
                        const inputB = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.inv1, reaction.prop1)) {
                        happs.text = "Using the " + reaction.inv1 + " with the  " + reaction.prop1 + " has revealed a " + reaction.prop2;
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        return happs;
                    }
                    break;
                case _.OBTAIN_INV1_VIA_PROP1_WITH_PROP2_LOSE_PROPS:
                    // eg obtain inv_meteor via radiation suit with the meteor.
                    // ^^ this is nearly a two in one, but the radiation suit never becomes inventory: you wear it.
                    if (isCollectingSolutionNodes) {
                        const output = "" + reaction.inv1;
                        const input1 = "" + reaction.prop1;
                        const input2 = "" + reaction.prop2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input1, restrictions, input2, count));

                    } else if (objects.Match("Use", reaction.prop1, reaction.prop2)) {
                        happs.text = "You use the " + reaction.prop1 + " with the " + reaction.prop2 + " and obtain the " + reaction.inv1;
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop2)));
                        return happs;
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_KEEPING_INV1:
                    if (isCollectingSolutionNodes) {
                        const inputA = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        const inputB = "" + reaction.inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        happs.text = "You use the " + reaction.inv1 + ", and the " + reaction.prop1 + " becomes a " + reaction.inv2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_KEEPING_PROP3:
                    if (isCollectingSolutionNodes) {
                        const inputA = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        const inputB = "" + reaction.prop3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        happs.text = "You use the " + reaction.prop3 + ", and the " + reaction.prop1 + " becomes a " + reaction.inv2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_LOSING_INV1:
                    if (isCollectingSolutionNodes) {
                        const inputA = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        const inputB = "" + reaction.inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        happs.text = "You use the " + reaction.inv1 + ", and the " + reaction.prop1 + " becomes a " + reaction.inv2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_VIA_LOSING_PROP3:
                    if (isCollectingSolutionNodes) {
                        const inputA = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        const inputB = "" + reaction.prop3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        happs.text = "You use the " + reaction.prop3 + ", and the " + reaction.prop1 + " becomes a " + reaction.prop2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop3)));
                        return happs;
                    }
                    break;
                case _.PROP1_BECOMES_PROP2_WHEN_GRAB_INV1:
                    if (isCollectingSolutionNodes) {
                        // This is a weird one, because there are two real-life outputs
                        // but only one puzzle output. I forget how I was going to deal with this.
                        const inputA = "" + reaction.prop1;
                        //const inputB, count = "" + reactionsFile.reactions[i].prop2;
                        const output = "" + reaction.inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, "undefined", count));

                    } else if (objects.Match("Grab", reaction.prop1, "")) {
                        happs.text = "You now have a " + reaction.inv1;
                        //ly don't mention what happen to the prop you clicked on.  "\n You notice the " + reaction.prop1 + " has now become a " + reaction.prop2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.PROP1_CHANGES_STATE_TO_PROP2_VIA_KEEPING_INV1:
                    if (isCollectingSolutionNodes) {
                        const inputA = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        const inputB = "" + reaction.inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, restrictions, inputB, count));

                    } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        happs.text = "You use the " + reaction.inv1 + ", and the " + reaction.prop1 + " is now " + GetState(reaction.prop2);
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.PROP1_GOES_WHEN_GRAB_INV1:
                    if (isCollectingSolutionNodes) {
                        const input = "" + reaction.prop1;
                        const output = "" + reaction.inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input, restrictions, "undefined", count));

                    } else if (objects.Match("Grab", reaction.prop1, "")) {
                        happs.text = "You now have a " + reaction.inv1;
                        //ly don't mention what happen to the prop you clicked on.  "\n You notice the " + reaction.prop1 + " has now become a " + reaction.prop2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.TOGGLE_PROP1_BECOMES_PROP2:
                    if (isCollectingSolutionNodes) {
                        const input = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input));

                    } else if (objects.Match("Toggle", reaction.prop1, "")) {
                        happs.text = "The " + reaction.prop1 + " has is now " + GetState(reaction.prop2);
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        return happs;
                    }
                    break;
                case _.TOGGLE_PROP1_CHANGES_STATE_TO_PROP2:
                    if (isCollectingSolutionNodes) {
                        const input = "" + reaction.prop1;
                        const output = "" + reaction.prop2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input));

                    } else if (objects.Match("Toggle", reaction.prop1, "")) {
                        happs.text = "The " + reaction.prop1 + " has become a " + reaction.prop2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        return happs;
                    }
                    break;
                case _.HACK_TO_STOP_ALLOW_TS_TO_IMPORT_THIS_FILE:
                    break;
                default:
                    assert(false && scriptType && "We didn't handle a scriptType that we're supposed to. Check to see if constant names are the same as their values in the schema.");

            }
        }
        return isCollectingSolutionNodes ? solutionNodesMappedByInput : null;
    }

} 