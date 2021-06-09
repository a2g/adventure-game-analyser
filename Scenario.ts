import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNode } from './SolutionNode';
import { assert } from 'console';
import scenario from '../20210415JsonPrivate/scenario/Scenario.json';
import objects from '../20210415JsonPrivate/scenario/schema/objects/Objects.json'
import _ from '../20210415JsonPrivate/scenario/schema/Script/Script.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';
import { Happening } from './Happening';
import { Happen } from './Happen';
import { Mix } from './Mix';
import { ScenarioInterface } from './ScenarioInterface';

function Stringify(name: string | undefined): string {
    return name ? name : "";
}
export class Scenario implements ScenarioInterface {
    GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb {
        return Scenario.GetMixedObjectsAndVerbFromThreeStrings(strings);
    }
    GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
        return Scenario.GetHappeningsIfAny(objects);
    }
    GetArrayOfSingleObjectVerbs(): string[] {
        return Scenario.GetArrayOfSingleObjectVerbs();
    }
    GetArrayOfVisibilitiesOfSingleObjectVerbs(): boolean[] {
        return Scenario.GetArrayOfVisibilitiesOfSingleObjectVerbs();
    }
    GetArrayOfProps(): string[] {
        return Scenario.GetArrayOfProps();
    }
    GetArrayOfInvs(): string[] {
        return Scenario.GetArrayOfProps();
    }
    GetArrayOfRegs(): string[] {
        return Scenario.GetArrayOfRegs();
    }
    GetArrayOfPropVisibilities(): boolean[] {
        return Scenario.GetArrayOfPropVisibilities();
    }
    GetArrayOfInvVisibilities(): boolean[] {
        return Scenario.GetArrayOfInvVisibilities();
    }
    GetSolutionNodeMap(): SolutionNodeMap {
        return Scenario.GetSolutionNodeMap();
    }

    static GetMixedObjectsAndVerbFromThreeStrings(strings: string[]): MixedObjectsAndVerb {
        const verb = strings[0].toLowerCase();

        if (verb === "grab") {
            if (objects.definitions.prop_type.enum.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "");
            else if (objects.definitions.prop_type.enum.includes("prop_" + strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, "prop_" + strings[1], "");
            return new MixedObjectsAndVerb(Mix.ErrorGrabButNoProp, "", "", "");
        } else if (verb === "toggle") {
            if (objects.definitions.prop_type.enum.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, strings[1], "");
            else if (objects.definitions.prop_type.enum.includes("prop_" + strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsProp, verb, "prop_" + strings[1], "");
            else if (objects.definitions.inv_type.enum.includes(strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, strings[1], "");
            else if (objects.definitions.inv_type.enum.includes("inv_" + strings[1]))
                return new MixedObjectsAndVerb(Mix.SingleVsInv, verb, "inv_" + strings[1], "");
            return new MixedObjectsAndVerb(Mix.ErrorToggleButNoInvOrProp, "", "", "");
        } else if (verb === "use") {
            if (objects.definitions.inv_type.enum.includes(strings[1]) && objects.definitions.inv_type.enum.includes(strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsInv, verb, strings[1], strings[2]);
            else if (objects.definitions.inv_type.enum.includes("inv_" + strings[1]) && objects.definitions.inv_type.enum.includes("inv_" + strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsInv, verb, "inv_" + strings[1], "inv_" + strings[2]);
            else if (objects.definitions.inv_type.enum.includes(strings[1]) && objects.definitions.prop_type.enum.includes(strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsProp, verb, strings[1], strings[2]);
            else if (objects.definitions.inv_type.enum.includes("inv_" + strings[1]) && objects.definitions.prop_type.enum.includes("prop_" + strings[2]))
                return new MixedObjectsAndVerb(Mix.InvVsProp, verb, "inv_" + strings[1], "prop_" + strings[2]);
            else if (objects.definitions.prop_type.enum.includes("prop_" + strings[1]) && objects.definitions.prop_type.enum.includes("prop_" + strings[2]))
                return new MixedObjectsAndVerb(Mix.PropVsProp, verb, "prop_" + strings[1], "prop_" + strings[2]);
        }
        return new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "");
    }

    static GetState(name: string | undefined): string {
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

    static GetSolutionNodeMap(): SolutionNodeMap {
        const notUsed = new MixedObjectsAndVerb(Mix.ErrorVerbNotIdentified, "", "", "");
        const result = Scenario.SingleBigSwtich(true, notUsed) as SolutionNodeMap;
        return result;
    }

    static GetHappeningsIfAny(objects: MixedObjectsAndVerb): Happenings | null {
        const result = Scenario.SingleBigSwtich(false, objects) as Happenings | null;
        return result;
    }

    static SingleBigSwtich(isCollectingSolutionNodes: boolean, objects: MixedObjectsAndVerb): Happenings | SolutionNodeMap | null {
        const happs = new Happenings();
        const solutionNodesMappedByInput = new SolutionNodeMap(null);

        for (let i = 0; i < scenario.reactions.length; i++) {
            const reaction = scenario.reactions[i];
            const scriptType = reaction.script;
            switch (scriptType) {
                case _.AUTO_PROP1_BECOMES_PROP2_VIA_PROPS:
                    {
                        const input = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
                        const prop1 = "" + scenario.reactions[i].prop3;
                        const prop2 = "" + scenario.reactions[i].prop4;
                        const prop3 = "" + scenario.reactions[i].prop5;
                        const prop4 = "" + scenario.reactions[i].prop6;
                        const prop5 = "" + scenario.reactions[i].prop7;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input, prop1, prop2, prop3, prop4, prop5));
                    }
                    break;
                case _.AUTO_REG1_TRIGGERS_REG2:
                    {
                        const input = "" + scenario.reactions[i].reg1;
                        const output = "" + scenario.reactions[i].reg2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input));
                    }
                    break;
                case _.AUTO_REG1_TRIGGERED_BY_PROPS:
                    {
                        const output = "" + scenario.reactions[i].reg1;
                        const prop1 = "" + scenario.reactions[i].prop1;
                        const prop2 = "" + scenario.reactions[i].prop2;
                        const prop3 = "" + scenario.reactions[i].prop3;
                        const prop4 = "" + scenario.reactions[i].prop4;
                        const prop5 = "" + scenario.reactions[i].prop5;
                        const prop6 = "" + scenario.reactions[i].prop6;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, prop1, prop2, prop3, prop4, prop5, prop6));
                    }
                    break;

                case _.INV1_AND_INV2_FORM_INV3:
                    if (isCollectingSolutionNodes) {
                        // losing all
                        const inputA = "" + scenario.reactions[i].inv1;
                        const inputB = "" + scenario.reactions[i].inv2;
                        const output = "" + scenario.reactions[i].inv3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));
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
                        const inputA = "" + scenario.reactions[i].inv1;
                        const inputB = "" + scenario.reactions[i].inv2;
                        const output = "" + scenario.reactions[i].inv3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));
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
                        const inputA = "" + scenario.reactions[i].inv1;
                        const output = "" + scenario.reactions[i].inv2;
                        const inputB = "" + scenario.reactions[i].inv3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

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
                        const inputA = "" + scenario.reactions[i].inv1;
                        const output = "" + scenario.reactions[i].inv2;
                        const inputB = "" + scenario.reactions[i].prop1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

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
                        const inputA = "" + scenario.reactions[i].inv1;
                        const output = "" + scenario.reactions[i].inv2;
                        const inputB = "" + scenario.reactions[i].inv3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

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
                        const inputA = "" + scenario.reactions[i].inv1;
                        const inputB = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

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
                        const output = "" + scenario.reactions[i].inv1;
                        const input1 = "" + scenario.reactions[i].prop1;
                        const input2 = "" + scenario.reactions[i].prop2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input1, input2));

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
                        const inputA = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
                        const inputB = "" + scenario.reactions[i].inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

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
                        const inputA = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
                        const inputB = "" + scenario.reactions[i].prop3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

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
                        const inputA = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
                        const inputB = "" + scenario.reactions[i].inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

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
                        const inputA = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
                        const inputB = "" + scenario.reactions[i].prop3;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

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
                        const inputA = "" + scenario.reactions[i].prop1;
                        //const inputB = "" + reactionsFile.reactions[i].prop2;
                        const output = "" + scenario.reactions[i].inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA));

                    } else if (objects.Match("Grab", reaction.prop1, "")) {
                        happs.text = "You now have a " + reaction.inv1;
                        // deliberately don't mention what happen to the prop you clicked on.  "\n You notice the " + reaction.prop1 + " has now become a " + reaction.prop2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.PROP1_CHANGES_STATE_TO_PROP2_VIA_KEEPING_INV1:
                    if (isCollectingSolutionNodes) {
                        const inputA = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
                        const inputB = "" + scenario.reactions[i].inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, inputA, inputB));

                    } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                        happs.text = "You use the " + reaction.inv1 + ", and the " + reaction.prop1 + " is now " + Scenario.GetState(reaction.prop2);
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.PROP1_GOES_WHEN_GRAB_INV1:
                    if (isCollectingSolutionNodes) {
                        const input = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].inv1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input));

                    } else if (objects.Match("Grab", reaction.prop1, "")) {
                        happs.text = "You now have a " + reaction.inv1;
                        // deliberately don't mention what happen to the prop you clicked on.  "\n You notice the " + reaction.prop1 + " has now become a " + reaction.prop2;
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                        return happs;
                    }
                    break;
                case _.TOGGLE_PROP1_BECOMES_PROP2:
                    if (isCollectingSolutionNodes) {
                        const input = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, input));

                    } else if (objects.Match("Toggle", reaction.prop1, "")) {
                        happs.text = "The " + reaction.prop1 + " has is now " + Scenario.GetState(reaction.prop2);
                        happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                        return happs;
                    }
                    break;
                case _.TOGGLE_PROP1_CHANGES_STATE_TO_PROP2:
                    if (isCollectingSolutionNodes) {
                        const input = "" + scenario.reactions[i].prop1;
                        const output = "" + scenario.reactions[i].prop2;
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
    static GetArrayOfSingleObjectVerbs(): Array<string> {
        return ["grab", "toggle"];
    }
    static GetArrayOfVisibilitiesOfSingleObjectVerbs(): Array<boolean> {
        return [true, true];
    }

    static GetArrayOfProps(): Array<string> {
        return objects.definitions.prop_type.enum;
    }
    static GetArrayOfInvs(): Array<string> {
        return objects.definitions.inv_type.enum;
    }
    static GetArrayOfRegs(): Array<string> {
        return objects.definitions.reg_type.enum;
    }

    static GetArrayOfRegStartingValues(): Array<boolean> {
        const array = new Array<boolean>();
        objects.definitions.reg_type.enum.forEach((value: string) => {
            array.push(value.length>0);// I used value.length>0 to get rid of the unused variable warnin
        });
        return array;
    }
    static GetArrayOfPropVisibilities(): Array<boolean> {

        // preen starting set from JSON
        const startingSet = new Set<string>();
        scenario.startingProps.forEach(function (value: { prop: string; }, index: number, array: { prop: string; }[]): void {
            startingSet.add(value.prop);
        });

        // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
        const visibilities = new Array<boolean>();
        objects.definitions.prop_type.enum.forEach((prop: string) => {
            const isVisible = startingSet.has(prop);
            visibilities.push(isVisible);
        });

        return visibilities;
    }

    static GetArrayOfInvVisibilities(): Array<boolean> {

        // preen starting set from JSON
        const startingSet = new Set<string>();
        scenario.startingInvs.forEach(function (value: { inv: string; }, index: number, array: { inv: string; }[]): void {
            startingSet.add(value.inv);
        });

        // construct array of booleans in exact same order as ArrayOfProps - so they can be correlated
        const visibilities = new Array<boolean>();
        objects.definitions.inv_type.enum.forEach((inv: string) => {
            const isVisible = startingSet.has(inv);
            visibilities.push(isVisible);
        });

        return visibilities;
    }



}