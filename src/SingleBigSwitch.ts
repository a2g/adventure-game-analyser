import { assert } from 'console';
import { Happenings } from './Happenings';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { SolutionNodeMap } from './SolutionNodeMap';
import * as fs from "fs";
import _ from './20210415JsonPrivate/Script/Script.json';
import { Happen } from './Happen';
import { Happening } from './Happening';
import { SolutionNode } from './SolutionNode'; 
import { ExtractBracketedPart } from './ExtractBracketedPart';

function Stringify(name: string | undefined): string {
    return name ? name : "";
}


export function SingleBigSwitch(filename: string, solutionNodesMappedByInput: SolutionNodeMap | null, objects: MixedObjectsAndVerb): Happenings | null {
    const happs = new Happenings();

    const text = fs.readFileSync(filename, { encoding: "UTF-8" });
    const scenario = JSON.parse(text);

    for (const reaction of scenario.reactions) {
        const scriptType = reaction.script;
        let count = 1;
        if(reaction.count!==undefined) {
            count = reaction.count;
        }

        const restrictions = reaction.restrictions;
        switch (scriptType) {
            case _.AUTO_PROP1_BECOMES_PROP2_BY_PROPS:
                if (solutionNodesMappedByInput) {
                    const input = "" + reaction.prop1;
                    const output = "" + reaction.prop2;
                    const prop1 = "" + reaction.prop3;
                    const prop2 = "" + reaction.prop4;
                    const prop3 = "" + reaction.prop5;
                    const prop4 = "" + reaction.prop6;
                    const prop5 = "" + reaction.prop7;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, input, prop1, prop2, prop3, prop4, prop5));
                }
                break;
            case _.AUTO_FLAG1_SET_BY_FLAG2:
                if (solutionNodesMappedByInput) {
                    const output = "" + reaction.flag1;
                    const input = "" + reaction.flag2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, input));
                }
                break;
            case _.AUTO_FLAG1_SET_BY_PROPS:
                if (solutionNodesMappedByInput) {
                    const output = "" + reaction.flag1;
                    const prop1 = "" + reaction.prop1;
                    const prop2 = "" + reaction.prop2;
                    const prop3 = "" + reaction.prop3;
                    const prop4 = "" + reaction.prop4;
                    const prop5 = "" + reaction.prop5;
                    const prop6 = "" + reaction.prop6;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, prop1, prop2, prop3, prop4, prop5, prop6));
                }
                break;
            case _.FLAG1_SET_BY_LOSING_INV1_USED_WITH_PROP1_AND_PROPS:
                if(solutionNodesMappedByInput) {
                    const output = "" + reaction.flag1;
                    const inputA = "" + reaction.inv1;
                    const inputB = "" + reaction.prop1;
                    const inputC = "" + reaction.prop2;
                    const inputD = "" + reaction.prop3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB, inputC, inputD));
                } else if (objects.Match("Use", reaction.inv1, reaction.prop1)){
                    happs.text = "With everything set up correctly, you use the" + reaction.inv1 + " with the " + reaction.prop1 + " and something good happens...";
                    happs.array.push(new Happening(Happen.FlagIsSet, Stringify(reaction.flag)));
                    happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                    happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop2)));
                    happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop3)));
                }
                break;
            case _.FLAG1_SET_BY_USING_INV1_WITH_INV2:
                    if (solutionNodesMappedByInput) {
                        const inputA = "" + reaction.inv1;
                        const inputB = "" + reaction.inv2;
                        const output = "" + reaction.flag1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));
                    } else if (objects.Match("Use", reaction.inv1, reaction.inv2)) {
                        happs.text = "You use the " + reaction.inv1 + " with the  " + reaction.inv2 + " and something good happens...";
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv2)));
                        happs.array.push(new Happening(Happen.FlagIsSet, Stringify(reaction.flag1)));
                        return happs;
                    }
                    break;
            case _.FLAG1_SET_BY_USING_INV1_WITH_PROP1:
                    if (solutionNodesMappedByInput) {
                        const inputA = "" + reaction.inv1;
                        const inputB = "" + reaction.prop1;
                        const output = "" + reaction.flag1;
                        solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));
                    } else if (objects.Match("Use", reaction.inv1, reaction.prop1)) {
                        happs.text = "You use the " + reaction.inv1 + " with the  " + reaction.prop1 + " and something good happens...";
                        happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                        happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                        happs.array.push(new Happening(Happen.FlagIsSet, Stringify(reaction.flag1)));
                        return happs;
                    }
                    break;
            case _.FLAG1_SET_BY_USING_PROP1_WITH_PROP2:
                if (solutionNodesMappedByInput) {
                    const inputA = "" + reaction.prop1;
                    const inputB = "" + reaction.prop2;
                    const output = "" + reaction.flag1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));
                } else if (objects.Match("Use", reaction.prop1, reaction.prop2)) {
                    happs.text = "You use the " + reaction.prop1 + " with the  " + reaction.prop2  + " and something good happens...";
                    happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop2)));
                    happs.array.push(new Happening(Happen.FlagIsSet, Stringify(reaction.flag1)));
                    return happs;
                }
                break;
            case _.INV1_AND_INV2_FORM_INV3:
                if (solutionNodesMappedByInput) {
                    // losing all
                    const inputA = "" + reaction.inv1;
                    const inputB = "" + reaction.inv2;
                    const output = "" + reaction.inv3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));
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
                if (solutionNodesMappedByInput) {
                    // losing none
                    const inputA = "" + reaction.inv1;
                    const inputB = "" + reaction.inv2;
                    const output = "" + reaction.inv3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));
                }
                else if (objects.Match("Use", reaction.inv1, reaction.inv2)) {
                    happs.text = "The " + reaction.inv1 + " and the " + reaction.inv2 + " has generated an" + reaction.inv3;
                    happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                    happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv2)));
                    happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv3)));
                    return happs;
                }
                break;
            case _.INV1_BECOMES_INV2_BY_KEEPING_INV3:
                if (solutionNodesMappedByInput) {
                    // losing inv
                    const inputA = "" + reaction.inv1;
                    const output = "" + reaction.inv2;
                    const inputB = "" + reaction.inv3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA,  inputB));

                } else if (objects.Match("Use", reaction.inv1, reaction.inv3)) {
                    happs.text = "Your " + reaction.inv1 + " has become a " + reaction.inv2
                    happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                    happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                    happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv3)));
                    return happs;
                }
                break;
            case _.INV1_BECOMES_INV2_BY_KEEPING_PROP1:
                if (solutionNodesMappedByInput) {
                    // keeping prop1
                    const inputA = "" + reaction.inv1;
                    const output = "" + reaction.inv2;
                    const inputB = "" + reaction.prop1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.inv1, reaction.prop1)) {
                    happs.text = "Your " + reaction.inv1 + " has become a  " + reaction.inv2;
                    happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                    happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                    happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                    return happs;
                }
                break;
            case _.INV1_BECOMES_INV2_BY_LOSING_INV3:
                if (solutionNodesMappedByInput) {
                    // losing inv
                    const inputA = "" + reaction.inv1;
                    const output = "" + reaction.inv2;
                    const inputB = "" + reaction.inv3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.inv1, reaction.inv3)) {
                    happs.text = "The " + reaction.inv1 + " has become a  " + reaction.inv2;
                    happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                    happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv2)));
                    happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv3)));
                    return happs;
                }
                break;

            case _.INV1_WITH_PROP1_REVEALS_PROP2_KEPT_ALL:
                if (solutionNodesMappedByInput) {
                    const inputA = "" + reaction.inv1;
                    const inputB = "" + reaction.prop1;
                    const output = "" + reaction.prop2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.inv1, reaction.prop1)) {
                    happs.text = "Using the " + reaction.inv1 + " with the  " + reaction.prop1 + " has revealed a " + reaction.prop2;
                    happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                    happs.array.push(new Happening(Happen.PropStays, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    return happs;
                }
                break;
            case _.OBTAIN_INV1_BY_PROP1_WITH_PROP2_LOSE_PROPS:
                // eg obtain inv_meteor via radiation suit with the meteor.
                // ^^ this is nearly a two in one, but the radiation suit never becomes inventory: you wear it.
                if (solutionNodesMappedByInput) {
                    const output = "" + reaction.inv1;
                    const inputA = "" + reaction.prop1;
                    const inputB = "" + reaction.prop2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.prop1, reaction.prop2)) {
                    happs.text = "You use the " + reaction.prop1 + " with the " + reaction.prop2 + " and obtain the " + reaction.inv1;
                    happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop2)));
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_BY_KEEPING_INV1:
                if (solutionNodesMappedByInput) {
                    const inputA = "" + reaction.prop1;
                    const output = "" + reaction.prop2;
                    const inputB = "" + reaction.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                    happs.text = "You use the " + reaction.inv1 + ", and the " + reaction.prop1 + " becomes a " + reaction.inv2;
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_BY_KEEPING_PROP3:
                if (solutionNodesMappedByInput) {
                    const inputA = "" + reaction.prop1;
                    const output = "" + reaction.prop2;
                    const inputB = "" + reaction.prop3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                    happs.text = "You use the " + reaction.prop3 + ", and the " + reaction.prop1 + " becomes a " + reaction.inv2;
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_BY_LOSING_INV1:
                if (solutionNodesMappedByInput) {
                    const inputA = "" + reaction.prop1;
                    const output = "" + reaction.prop2;
                    const inputB = "" + reaction.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                    happs.text = "You use the " + reaction.inv1 + ", and the " + reaction.prop1 + " becomes a " + reaction.inv2;
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    happs.array.push(new Happening(Happen.InvGoes, Stringify(reaction.inv1)));
                    return happs;
                }
                break;

            case _.PROP1_BECOMES_PROP2_BY_LOSING_PROP3:
                if (solutionNodesMappedByInput) {
                    const inputA = "" + reaction.prop1;
                    const output = "" + reaction.prop2;
                    const inputB = "" + reaction.prop3;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                    happs.text = "You use the " + reaction.prop3 + ", and the " + reaction.prop1 + " becomes a " + reaction.prop2;
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop3)));
                    return happs;
                }
                break;
            case _.PROP1_BECOMES_PROP2_WHEN_GRAB_INV1:
                if (solutionNodesMappedByInput) {
                    // This is a weird one, because there are two real-life outputs
                    // but only one puzzle output. I forget how I was going to deal with this.
                    const inputA = "" + reaction.prop1;
                    //const inputB, count = "" + reactionsFile.reactions[i].prop2;
                    const output = "" + reaction.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA));

                } else if (objects.Match("Grab", reaction.prop1, "")) {
                    happs.text = "You now have a " + reaction.inv1;
                    //ly don't mention what happen to the prop you clicked on.  "\n You notice the " + reaction.prop1 + " has now become a " + reaction.prop2;
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                    return happs;
                }
                break;
            case _.PROP1_CHANGES_STATE_TO_PROP2_BY_KEEPING_INV1:
                if (solutionNodesMappedByInput) {
                    const inputA = "" + reaction.prop1;
                    const output = "" + reaction.prop2;
                    const inputB = "" + reaction.inv1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA, inputB));

                } else if (objects.Match("Use", reaction.prop1, reaction.inv1)) {
                    happs.text = "You use the " + reaction.inv1 + ", and the " + reaction.prop1 + " is now " + ExtractBracketedPart(reaction.prop2);
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    happs.array.push(new Happening(Happen.InvStays, Stringify(reaction.inv1)));
                    return happs;
                }
                break;
            case _.PROP1_GOES_WHEN_GRAB_INV1:
                if (solutionNodesMappedByInput) {
                    const output = "" + reaction.inv1;
                    const inputA = "" + reaction.prop1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA));

                } else if (objects.Match("Grab", reaction.prop1, "")) {
                    happs.text = "You now have a " + reaction.inv1;
                    //ly don't mention what happen to the prop you clicked on.  "\n You notice the " + reaction.prop1 + " has now become a " + reaction.prop2;
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.InvAppears, Stringify(reaction.inv1)));
                    return happs;
                }
                break;
            case _.TOGGLE_PROP1_BECOMES_PROP2:
                if (solutionNodesMappedByInput) {
                    const output = "" + reaction.prop2;
                    const inputA = "" + reaction.prop1;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, inputA));

                } else if (objects.Match("Toggle", reaction.prop1, "")) {
                    happs.text = "The " + reaction.prop1 + " has become a " + reaction.prop2;
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    return happs;
                }
                break;
            case _.TOGGLE_PROP1_CHANGES_STATE_TO_PROP2:
                if (solutionNodesMappedByInput) {
                    const input = "" + reaction.prop1;
                    const output = "" + reaction.prop2;
                    solutionNodesMappedByInput.AddToMap(new SolutionNode(output, scriptType, count, restrictions, input));

                } else if (objects.Match("Toggle", reaction.prop1, "")) {
                    happs.text = "The " + reaction.prop1 + " is now " + ExtractBracketedPart(reaction.prop2);
                    happs.array.push(new Happening(Happen.PropGoes, Stringify(reaction.prop1)));
                    happs.array.push(new Happening(Happen.PropAppears, Stringify(reaction.prop2)));
                    return happs;
                }
                break;
            default:
                assert(false && scriptType && "We didn't handle a scriptType that we're supposed to. Check to see if constant names are the same as their values in the schema.");

        }
    }
    return null;
}
