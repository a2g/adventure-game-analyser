import { Happenings } from './Happenings';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { SolutionNodeMap } from './SolutionNodeMap';
import * as fs from "fs";
import _ from './20210415JsonPrivate/Gate/Gate.json';
import { Happen } from './Happen';
import { Happening } from './Happening';
import { SolutionNode } from './SolutionNode';
import { ExtractBracketedPart } from './ExtractBracketedPart';
import { isNullOrUndefined } from 'util';

function Stringify(name: string | undefined): string {
    return name ? name : "";
}


export function SingleBigSwitch(filename: string, solutionNodesMappedByInput: SolutionNodeMap | null, objects: MixedObjectsAndVerb): Happenings | null {

    const text = fs.readFileSync(filename, { encoding: "UTF-8" });
    const scenario = JSON.parse(text);

    for (const gate of scenario.gates) {
        const gateType = gate.gate;
        let count = 1;
        if (gate.count !== undefined) {
            count = gate.count;
        }

        const happs = new Happenings();
        const restrictions = gate.restrictions;
        switch (gateType) {
            case _.AUTO_FLAG1_CAUSES_IMPORT_OF_JSON:
                if (solutionNodesMappedByInput) {
                    const output = "" + gate.fileToMerge;
                    const input = "" + gate.flag1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, input));
                }
                break;
            case _.AUTO_PROP1_BECOMES_PROP2_BY_PROPS:
                if (solutionNodesMappedByInput) {
                    const input = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    const prop1 = "" + gate.prop3;
                    const prop2 = "" + gate.prop4;
                    const prop3 = "" + gate.prop5;
                    const prop4 = "" + gate.prop6;
                    const prop5 = "" + gate.prop7;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, input, prop1, prop2, prop3, prop4, prop5));
                }
                break;

            case _.AUTO_FLAG1_SET_BY_FLAG2:
                if (solutionNodesMappedByInput) {
                    const output = "" + gate.flag1;
                    const input = "" + gate.flag2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, input));
                }
                break;
            case _.AUTO_FLAG1_SET_BY_PROPS:
                if (solutionNodesMappedByInput) {
                    const output = "" + gate.flag1;
                    const prop1 = "" + gate.prop1;
                    const prop2 = "" + gate.prop2;
                    const prop3 = "" + gate.prop3;
                    const prop4 = "" + gate.prop4;
                    const prop5 = "" + gate.prop5;
                    const prop6 = "" + gate.prop6;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, prop1, prop2, prop3, prop4, prop5, prop6));
                }
                break;
            case _.FLAG1_SET_BY_LOSING_INV1_USED_WITH_PROP1_AND_PROPS:
                happs.text = "With everything set up correctly, you use the" + gate.inv1 + " with the " + gate.prop1 + " and something good happens...";
                happs.array.push(new Happening(Happen.FlagIsSet, Stringify(gate.flag1)));
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop1)));
                if (!isNullOrUndefined(gate.prop2))
                    happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop2)));
                if (!isNullOrUndefined(gate.prop3))
                    happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop3)));
                if (solutionNodesMappedByInput) {
                    const output = "" + gate.flag1;
                    const inputA = "" + gate.inv1;
                    const inputB = "" + gate.prop1;
                    const inputC = "" + gate.prop2;
                    const inputD = "" + gate.prop3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB, inputC, inputD));
                } else if (objects.Match("Use", gate.inv1, gate.prop1)) {
                    return happs;
                }
                break;

            case _.FLAG1_SET_BY_USING_INV1_WITH_INV2:
                happs.text = "You use the " + gate.inv1 + " with the  " + gate.inv2 + " and something good happens...";
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv2)));
                happs.array.push(new Happening(Happen.FlagIsSet, Stringify(gate.flag1)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.inv1;
                    const inputB = "" + gate.inv2;
                    const output = "" + gate.flag1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.inv1, gate.inv2)) {
                    return happs;
                }
                break;

            case _.FLAG1_SET_BY_USING_INV1_WITH_PROP1:
                happs.text = "You use the " + gate.inv1 + " with the  " + gate.prop1 + " and something good happens...";
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.FlagIsSet, Stringify(gate.flag1)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.inv1;
                    const inputB = "" + gate.prop1;
                    const output = "" + gate.flag1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.inv1, gate.prop1)) {
                    return happs;
                }
                break;
            case _.FLAG1_SET_BY_USING_INV1_WITH_PROP1_LOSE_PROPS:
                happs.text = "You use the " + gate.inv1 + " with the  " + gate.prop1 + " and something good happens...";
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.FlagIsSet, Stringify(gate.flag1)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.inv1;
                    const inputB = "" + gate.prop1;
                    const output = "" + gate.flag1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.inv1, gate.prop1)) {
                    return happs;
                }
                break;
            case _.FLAG1_SET_BY_USING_INV1_WITH_PROP1_NEED_FLAG2:
                happs.text = "You use the " + gate.inv1 + " with the  " + gate.prop1 + " and something good happens...";
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.FlagIsSet, Stringify(gate.flag1)));
                if (solutionNodesMappedByInput) {
                    const output = "" + gate.flag1;
                    const inputA = "" + gate.inv1;
                    const inputB = "" + gate.prop1;
                    const inputC = "" + gate.flag2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB, inputC));
                } else if (objects.Match("Use", gate.inv1, gate.prop1)) {
                    return happs;
                }
                break;
            case _.FLAG1_SET_BY_USING_PROP1_WITH_PROP2:
                happs.text = "You use the " + gate.prop1 + " with the  " + gate.prop2 + " and something good happens...";
                happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop2)));
                happs.array.push(new Happening(Happen.FlagIsSet, Stringify(gate.flag1)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.prop1;
                    const inputB = "" + gate.prop2;
                    const output = "" + gate.flag1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.prop1, gate.prop2)) {
                    return happs;
                }
                break;
            case _.INV1_AND_INV2_FORM_INV3:
                happs.text = "The " + gate.inv1 + " and the " + gate.inv2 + " has formed an" + gate.inv3;
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv2)));
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv3)));
                if (solutionNodesMappedByInput) {
                    // losing all
                    const inputA = "" + gate.inv1;
                    const inputB = "" + gate.inv2;
                    const output = "" + gate.inv3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                }
                else if (objects.Match("Use", gate.inv1, gate.inv2)) {
                    return happs;
                }
                break;
            case _.INV1_AND_INV2_GENERATE_INV3:
                happs.text = "The " + gate.inv1 + " and the " + gate.inv2 + " has generated an" + gate.inv3;
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv2)));
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv3)));
                if (solutionNodesMappedByInput) {
                    // losing none
                    const inputA = "" + gate.inv1;
                    const inputB = "" + gate.inv2;
                    const output = "" + gate.inv3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                }
                else if (objects.Match("Use", gate.inv1, gate.inv2)) {
                    return happs;
                }
                break;
            case _.INV1_BECOMES_INV2_BY_KEEPING_INV3:
                happs.text = "Your " + gate.inv1 + " has become a " + gate.inv2
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv2)));
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv3)));
                if (solutionNodesMappedByInput) {
                    // losing inv
                    const inputA = "" + gate.inv1;
                    const output = "" + gate.inv2;
                    const inputB = "" + gate.inv3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.inv1, gate.inv3)) {
                    return happs;
                }
                break;
            case _.INV1_BECOMES_INV2_BY_KEEPING_PROP1:
                happs.text = "Your " + gate.inv1 + " has become a  " + gate.inv2;
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv2)));
                happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop1)));
                if (solutionNodesMappedByInput) {
                    // keeping prop1
                    const inputA = "" + gate.inv1;
                    const output = "" + gate.inv2;
                    const inputB = "" + gate.prop1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.inv1, gate.prop1)) {
                    return happs;
                }
                break;
            case _.INV1_BECOMES_INV2_BY_LOSING_INV3:
                happs.text = "The " + gate.inv1 + " has become a  " + gate.inv2;
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv2)));
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv3)));
                if (solutionNodesMappedByInput) {
                    // losing inv
                    const inputA = "" + gate.inv1;
                    const output = "" + gate.inv2;
                    const inputB = "" + gate.inv3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.inv1, gate.inv3)) {
                    return happs;
                }
                break;
            case _.INV1_WITH_PROP1_REVEALS_PROP2_KEPT_ALL:
                happs.text = "Using the " + gate.inv1 + " with the  " + gate.prop1 + " has revealed a " + gate.prop2;
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.PropStays, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.inv1;
                    const inputB = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));

                } else if (objects.Match("Use", gate.inv1, gate.prop1)) {
                    return happs;
                }
                break;
            case _.OBTAIN_INV1_BY_PROP1_WITH_PROP2_LOSE_PROPS:
                // eg obtain inv_meteor via radiation suit with the meteor.
                // ^^ this is nearly a two in one, but the radiation suit never becomes inventory: you wear it.
                happs.text = "You use the " + gate.prop1 + " with the " + gate.prop2 + " and obtain the " + gate.inv1;
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop2)));
                if (solutionNodesMappedByInput) {
                    const output = "" + gate.inv1;
                    const inputA = "" + gate.prop1;
                    const inputB = "" + gate.prop2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.prop1, gate.prop2)) {
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_AS_INV1_BECOMES_INV2:
                happs.text = "The " + gate.prop1 + "has become a " + gate.prop2 + ". And your " + gate.inv1 + " has become a " + gate.inv2 + ".";
                //ly don't mention what happen to the prop you clicked on.  "\n You notice the " + gate.prop1 + " has now become a " + gate.prop2;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv1)));
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv2)));
                if (solutionNodesMappedByInput) {
                    // Another weird one, with two outputs - but only one output slot in the graph
                    // We fill the graph with the main output of the puzzle, otherwise
                    // the won't puzzle won't get solved.
                    const output = "" + gate.prop1;
                    const inputA = "" + gate.prop2;
                    const inputB = "" + gate.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.inv1, gate.prop1)) {
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_BY_KEEPING_INV1:
                happs.text = "You use the " + gate.inv1 + ", and the " + gate.prop1 + " becomes a " + gate.inv2;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv1)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    const inputB = "" + gate.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.prop1, gate.inv1)) {
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_BY_KEEPING_PROP3:
                happs.text = "You use the " + gate.prop3 + ", and the " + gate.prop1 + " becomes a " + gate.prop2;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    const inputB = "" + gate.prop3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.prop1, gate.prop3)) {
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_BY_LOSING_INV1:
                happs.text = "You use the " + gate.inv1 + ", and the " + gate.prop1 + " becomes a " + gate.inv1;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                happs.array.push(new Happening(Happen.InvGoes, Stringify(gate.inv1)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    const inputB = "" + gate.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.prop1, gate.inv1)) {
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_BY_LOSING_PROP3:
                happs.text = "You use the " + gate.prop3 + ", and the " + gate.prop1 + " becomes a " + gate.prop2;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop3)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    const inputB = "" + gate.prop3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.prop1, gate.inv1)) {
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_WHEN_GRAB_INV1:
                happs.text = "You now have a " + gate.inv1;
                //ly don't mention what happen to the prop you clicked on.  "\n You notice the " + gate.prop1 + " has now become a " + gate.prop2;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv1)));
                if (solutionNodesMappedByInput) {
                    // This is a weird one, because there are two real-life outputs
                    // but only one puzzle output. I forget how I was going to deal with this.
                    const inputA = "" + gate.prop1;
                    //const inputB, count = "" + reactionsFile.gates[i].prop2;
                    const output = "" + gate.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA));
                } else if (objects.Match("Grab", gate.prop1, "")) {
                    return happs;
                }
                break;

            case _.PROP1_CHANGES_STATE_TO_PROP2_BY_KEEPING_INV1:
                happs.text = "You use the " + gate.inv1 + ", and the " + gate.prop1 + " is now " + ExtractBracketedPart(gate.prop2);
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                happs.array.push(new Happening(Happen.InvStays, Stringify(gate.inv1)));
                if (solutionNodesMappedByInput) {
                    const inputA = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    const inputB = "" + gate.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA, inputB));
                } else if (objects.Match("Use", gate.prop1, gate.inv1)) {
                    return happs;
                }
                break;
            case _.PROP1_GOES_WHEN_GRAB_INV1:
                happs.text = "You now have a " + gate.inv1;
                //ly don't mention what happen to the prop you clicked on.  "\n You notice the " + gate.prop1 + " has now become a " + gate.prop2;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.InvAppears, Stringify(gate.inv1)));
                if (solutionNodesMappedByInput) {
                    const output = "" + gate.inv1;
                    const inputA = "" + gate.prop1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA));
                } else if (objects.Match("Grab", gate.prop1, "")) {
                    return happs;
                }
                break;
            case _.TOGGLE_PROP1_BECOMES_PROP2:
                happs.text = "The " + gate.prop1 + " has become a " + gate.prop2;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                if (solutionNodesMappedByInput) {
                    const output = "" + gate.prop2;
                    const inputA = "" + gate.prop1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, inputA));
                } else if (objects.Match("Toggle", gate.prop1, "")) {
                    return happs;
                }
                break;
            case _.TOGGLE_PROP1_CHANGES_STATE_TO_PROP2:
                happs.text = "The " + gate.prop1 + " is now " + ExtractBracketedPart(gate.prop2);
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                if (solutionNodesMappedByInput) {
                    const input = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, input));
                } else if (objects.Match("Toggle", gate.prop1, "")) {
                    return happs;
                }
                break;
            case _.TOGGLE_PROP1_REVEALS_PROP2_AS_IT_BECOMES_PROP3:
                happs.text = "The " + gate.prop1 + " becomes " + gate.prop3 + " and reveals " + gate.prop2;
                happs.array.push(new Happening(Happen.PropGoes, Stringify(gate.prop1)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop2)));
                happs.array.push(new Happening(Happen.PropAppears, Stringify(gate.prop3)));
                if (solutionNodesMappedByInput) {
                    const input = "" + gate.prop1;
                    const output = "" + gate.prop2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, gateType, count, happs, restrictions, input));
                } else if (objects.Match("Toggle", gate.prop1, "")) {
                    return happs;
                }
                break;
            default:
                console.log("We didn't handle a gateType that we're supposed to. Check to see if constant names are the same as their values in the schema. " + gateType);

        }
    }
    return null;
}
